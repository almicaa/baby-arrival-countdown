import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Direktno ubacujemo URL i anon key
const supabase = createClient(
  'https://sqjjlvmdfsagklkplwdk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxampsdm1kZnNhZ2tsa3Bsd2RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMzgxMTgsImV4cCI6MjA3NzkxNDExOH0.D6RQsAbInvkRhiYTDRtZtS8z8Ze4pySRJclLZruZzTU'
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Received request:', req.method, req.url);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('monthly_images')
        .select('*')
        .order('month_number');

      console.log('Fetched data:', data, 'Error:', error);
      if (error) throw error;

      return res.status(200).json(data || []);
    } catch (error: any) {
      console.error('Error fetching images:', error);
      return res.status(500).json({ error: 'Failed to fetch images', details: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { month_number, image_data } = req.body;
      console.log('POST body:', req.body);

      if (!month_number || !image_data) {
        return res.status(400).json({ error: 'Missing month_number or image_data' });
      }

      const base64Data = image_data.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      const matches = image_data.match(/^data:image\/(\w+);base64,/);
      const fileExt = matches ? matches[1] : 'jpg';
      const fileName = `month-${month_number}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('preg-photos')
        .upload(fileName, buffer, { contentType: `image/${fileExt}`, cacheControl: '3600', upsert: true });

      console.log('Upload error:', uploadError);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('preg-photos')
        .getPublicUrl(fileName);

      const { data, error: dbError } = await supabase
        .from('monthly_images')
        .upsert({ month_number, image_url: publicUrl, file_path: fileName, mime_type: `image/${fileExt}`, file_size: buffer.length }, { onConflict: 'month_number' })
        .select()
        .single();

      console.log('DB result:', data, 'DB error:', dbError);
      if (dbError) throw dbError;

      return res.status(200).json(data);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      return res.status(500).json({ error: 'Failed to upload image', details: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}