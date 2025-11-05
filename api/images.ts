import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Server koristi Service Role Key
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('monthly_images')
        .select('*')
        .order('month_number');

      if (error) throw error;

      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const { month_number, image_data } = req.body;

      if (!month_number || !image_data)
        return res.status(400).json({ error: 'Missing month_number or image_data' });

      // Convert Base64 to buffer
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
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('preg-photos')
        .getPublicUrl(fileName);

      // Save to database
      const { data, error: dbError } = await supabase
        .from('monthly_images')
        .upsert({
          month_number,
          image_url: publicUrl,
          file_path: fileName,
          mime_type: `image/${fileExt}`,
          file_size: buffer.length,
        }, { onConflict: 'month_number' })
        .select()
        .single();

      if (dbError) throw dbError;

      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('API error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
