import React, { useRef } from 'react';

interface MonthCardProps {
  monthNumber: number;
  imageUrl: string;
  description: string;
  isCurrent: boolean;
  isPast: boolean;
  onImageUpload: (monthNumber: number, file: File) => void;
  uploading?: boolean;
  animationStyle: React.CSSProperties;
}

const CameraIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const MonthCard: React.FC<MonthCardProps> = ({
  monthNumber,
  imageUrl,
  description,
  isCurrent,
  isPast,
  onImageUpload,
  uploading = false,
  animationStyle,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cardBaseClasses =
    'flex flex-col items-center justify-center space-y-2 p-3 rounded-lg transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer group animate-pop-in';
  const currentClasses =
    'bg-[var(--accent-highlight)] scale-110 shadow-lg ring-4 ring-[var(--accent-ring)]';
  const defaultClasses = 'bg-[var(--accent-secondary)]';
  const pastClasses = 'opacity-70';
  const futureClasses = 'opacity-100';

  const cardClasses = [
    cardBaseClasses,
    isCurrent ? currentClasses : defaultClasses,
    isPast ? pastClasses : futureClasses,
  ].join(' ');

  const handleCardClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(monthNumber, file);
    }
  };

  return (
    <div
      className={cardClasses}
      style={animationStyle}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && !uploading && handleCardClick()}
      aria-label={`Month ${monthNumber}: ${description}. Click to upload image.`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        aria-hidden="true"
        disabled={uploading}
      />
      <div className="relative">
        <img
          src={imageUrl}
          alt={`Baby at month ${monthNumber}, ${description}`}
          className="w-16 h-16 rounded-full object-cover border-2 border-white"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300 rounded-full">
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          ) : (
            <CameraIcon />
          )}
        </div>
      </div>
      <div className="text-center">
        <p
          className={`font-bold text-sm whitespace-nowrap ${
            isCurrent ? 'text-white' : 'text-[var(--text-secondary)]'
          }`}
        >
          Month {monthNumber}
        </p>
        <p
          className={`text-xs italic ${
            isCurrent ? 'text-white/90' : 'text-[var(--text-secondary)] opacity-80'
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default MonthCard;
