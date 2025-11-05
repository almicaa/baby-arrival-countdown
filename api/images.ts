import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// ⚠️ Ovo koristimo samo u backendu, frontend NE vidi ovaj key
const SUPABASE_URL = 'https://sqjjlvmdfsagklkplwdk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxampsdm1kZnNhZ2tsa3Bsd2RrIiwicm9sZSIsInNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjMzODExOCwiZXhwIjoyMDc3OTE0MTE4fQ.BHUUjyKfRTYxMGUeYXF-fTVWiysINxgeEsvFt-VkJHE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('monthly_images')
        .select('*')
        .order('month_number');

      if (error) throw error;
      console.log('Fetched images:', data);
      return res.status(200).json(data || []);
    } catch (err: any) {
      console.error('Error fetching images:', err.message);
      return res.status(500).json({ error: 'Failed to fetch images', details: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { month_number, image_data } = req.body;
      if (!month_number || !image_data) return res.status(400).json({ error: 'Missing month_number or image_data' });

      const base64Data = image_data.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const matches = image_data.match(/^data:image\/(\w+);base64,/);
      const fileExt = matches ? matches[1] : 'jpg';
      const fileName = `month-${month_number}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('preg-photos')
        .upload(fileName, buffer, {
          contentType: `image/${fileExt}`,
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('preg-photos').getPublicUrl(fileName);

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
      console.log('Uploaded image for month', month_number, data);

      return res.status(200).json(data);
    } catch (err: any) {
      console.error('Error uploading image:', err.message);
      return res.status(500).json({ error: 'Failed to upload image', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
console.log("Radi");