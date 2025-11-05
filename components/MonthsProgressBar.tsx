import React, { useState, useEffect } from 'react';
import MonthCard from './MonthCard';
import { MONTHS_DATA } from '../constants';

interface MonthsProgressBarProps {
  currentMonth: number;
}

interface MonthImage {
  month_number: number;
  image_url: string;
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
      const response = await fetch('/api/images');
      if (!response.ok) throw new Error('Failed to fetch images');
      const data: MonthImage[] = await response.json();
      const imagesMap = data.reduce((acc, item) => {
        acc[item.month_number] = item.image_url;
        return acc;
      }, {} as Record<number, string>);
      setMonthImages(imagesMap);
    } catch (err) {
      console.error('Error fetching images:', err);
      alert('Failed to load images. Refresh page.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (monthNumber: number, file: File) => {
    try {
      setUploadingMonth(monthNumber);

      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const imageData = await base64Promise;

      // Optimistic update
      setMonthImages(prev => ({ ...prev, [monthNumber]: imageData }));

      const res = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month_number: monthNumber, image_data: imageData }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || 'Upload failed');
      }

      const result = await res.json();
      setMonthImages(prev => ({ ...prev, [monthNumber]: result.image_url }));
    } catch (err: any) {
      console.error('Error uploading image:', err);
      alert(`Upload failed: ${err.message}`);
      fetchImages(); // revert
    } finally {
      setUploadingMonth(null);
    }
  };

  if (loading) return <p>Loading images...</p>;

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
