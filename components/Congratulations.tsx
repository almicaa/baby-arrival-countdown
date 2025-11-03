
import React from 'react';

interface CongratulationsProps {
  babyName: string;
}

const Congratulations: React.FC<CongratulationsProps> = ({ babyName }) => {
  const confettiPieces = Array.from({ length: 50 }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}%`,
      animationDuration: `${2 + Math.random() * 2}s`,
      animationDelay: `${Math.random() * 3}s`,
    };
    const colorClass = i % 3 === 0 
      ? 'bg-[var(--accent-primary)]' 
      : i % 3 === 1 
        ? 'bg-[var(--accent-highlight)]' 
        : 'bg-[var(--accent-ring)]';
    
    return <div key={i} className={`confetti-piece ${colorClass}`} style={style} />;
  });

  return (
    <div className="relative flex flex-col items-center justify-center p-8 rounded-xl w-full overflow-hidden">
      {confettiPieces}
      <div className="z-10 text-center animate-celebrate">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--accent-primary)]">
          {babyName ? `Welcome to the world, ${babyName}!` : 'Welcome to the world!'}
        </h2>
        <p className="text-lg text-[var(--text-secondary)] mt-2">
          {babyName ? `The wait is over! ${babyName} has arrived.` : 'The wait is over! Our little one has arrived.'}
        </p>
      </div>
    </div>
  );
};

export default Congratulations;
