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
    } catch (error) {
      console.error('Error fetching images:', error);
      alert('Failed to load images. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (monthNumber: number, file: File) => {
    try {
      setUploadingMonth(monthNumber);

      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const imageData = await base64Promise;

      // Optimistic update
      setMonthImages(prev => ({ ...prev, [monthNumber]: imageData }));

      // Upload via API
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month_number: monthNumber, image_data: imageData })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Upload failed');
      }

      const result = await response.json();

      // Update with server URL
      setMonthImages(prev => ({ ...prev, [monthNumber]: result.image_url }));
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(`Failed to upload image: ${error.message}`);
      fetchImages(); // revert optimistic update
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
