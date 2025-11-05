import React, { useState, useEffect } from 'react';
import MonthCard from './MonthCard';
import { MONTHS_DATA } from '../constants';
import type { MonthData } from '../types';
import { supabase } from '../src/supabaseClient';


interface MonthsProgressBarProps {
  currentMonth: number;
}

const MonthsProgressBar: React.FC<MonthsProgressBarProps> = ({ currentMonth }) => {

  const [monthImages, setMonthImages] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploadingMonth, setUploadingMonth] = useState<number | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('monthly_images')
        .select('*')
        .order('month_number');

      if (error) throw error;

      const imagesMap = data.reduce((acc, item) => {
        acc[item.month_number] = item.image_url;
        return acc;
      }, {} as Record<number, string>);

      setMonthImages(imagesMap);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (monthNumber: number, file: File) => {
    try {
      setUploadingMonth(monthNumber);

      const fileExt = file.name.split('.').pop();
      const fileName = `month-${monthNumber}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('preg-photos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('preg-photos')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('monthly_images')
        .upsert({
          month_number: monthNumber,
          image_url: publicUrl,
          file_path: fileName,
          file_size: file.size,
          mime_type: file.type
        }, { onConflict: 'month_number' });

      if (dbError) throw dbError;

      setMonthImages(prev => ({ ...prev, [monthNumber]: publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Upload failed, please try again.');
      fetchImages(); 
    } finally {
      setUploadingMonth(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-lg">Loading images...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-9 gap-4">
      {MONTHS_DATA.map((month, index) => (
        <MonthCard
          key={month.monthNumber}
          monthNumber={month.monthNumber}
          imageUrl={monthImages[month.monthNumber] || month.imageUrl}
          description={month.description}
          isCurrent={month.monthNumber === currentMonth}
          isPast={month.monthNumber < currentMonth}
          onImageUpload={handleImageUpload}
          uploading={uploadingMonth === month.monthNumber}
          animationStyle={{ animationDelay: `${index * 75}ms` }}
        />
      ))}
    </div>
  );
};

export default MonthsProgressBar;
