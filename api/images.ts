import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Supabase client koristi service_role key, jer je ovo backend (serverless function)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - fetch all images
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('monthly_images')
        .select('month_number, image_url')
        .order('month_number');

      if (error) throw error;

      return res.status(200).json(data || []);
    } catch (err: any) {
      console.error('Error fetching images:', err);
      return res.status(500).json({ error: 'Failed to fetch images', details: err.message });
    }
  }

  // POST - upload new image
  if (req.method === 'POST') {
    try {
      const { month_number, image_data } = req.body;

      if (!month_number || !image_data) {
        return res.status(400).json({ error: 'Missing month_number or image_data' });
      }

      if (month_number < 1 || month_number > 9) {
        return res.status(400).json({ error: 'month_number must be between 1-9' });
      }

      // Convert base64 to buffer
      const base64Data = image_data.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Detect file extension
      const matches = image_data.match(/^data:image\/(\w+);base64,/);
      const fileExt = matches ? matches[1] : 'jpg';

      const fileName = `month-${month_number}-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('preg-photos')
        .upload(fileName, buffer, {
          contentType: `image/${fileExt}`,
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('preg-photos')
        .getPublicUrl(fileName);

      // Save to database (upsert)
      const { error: dbError } = await supabase
        .from('monthly_images')
        .upsert({
          month_number,
          image_url: publicUrl,
          file_path: fileName,
          mime_type: `image/${fileExt}`,
          file_size: buffer.length
        }, { onConflict: 'month_number' });

      if (dbError) throw dbError;

      // Always return JSON with image_url
      return res.status(200).json({ image_url: publicUrl });
    } catch (err: any) {
      console.error('Error uploading image:', err);
      return res.status(500).json({ error: 'Failed to upload image', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
