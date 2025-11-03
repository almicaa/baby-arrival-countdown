
import React, { useRef } from 'react';

interface MonthCardProps {
  monthNumber: number;
  imageUrl: string;
  isCurrent: boolean;
  isPast: boolean;
  onImageUpload: (monthNumber: number, imageUrl: string) => void;
}

const CameraIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);


const MonthCard: React.FC<MonthCardProps> = ({ monthNumber, imageUrl, isCurrent, isPast, onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cardClasses = [
    'flex', 'flex-col', 'items-center', 'justify-center', 'space-y-2',
    'p-3', 'rounded-lg', 'transition-all', 'duration-300', 'ease-in-out', 'cursor-pointer',
    'group', // for hover effects
    isCurrent ? 'bg-pink-200 scale-110 shadow-lg ring-4 ring-pink-300' : 'bg-slate-100',
    isPast ? 'opacity-70' : 'opacity-100'
  ].join(' ');
  
  const handleCardClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageUpload(monthNumber, e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={cardClasses} onClick={handleCardClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleCardClick()} aria-label={`Upload image for month ${monthNumber}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        aria-hidden="true"
      />
      <div className="relative">
        <img
          src={imageUrl}
          alt={`Baby development month ${monthNumber}`}
          className="w-16 h-16 rounded-full object-cover border-2 border-white"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300 rounded-full">
          <CameraIcon />
        </div>
      </div>
      <span className={`font-bold text-sm ${isCurrent ? 'text-white' : 'text-slate-500'}`}>
        Month {monthNumber}
      </span>
    </div>
  );
};

export default MonthCard;
