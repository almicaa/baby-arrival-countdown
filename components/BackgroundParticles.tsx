import React from 'react';

const BackgroundParticles: React.FC = () => {
  const particles = React.useMemo(() => {
    const particleArray = [];
    const colors = [
      'bg-[var(--accent-primary)]',
      'bg-[var(--accent-highlight)]',
      'bg-[var(--accent-ring)]',
    ];
    const numParticles = 25;

    for (let i = 0; i < numParticles; i++) {
      const size = Math.random() * 25 + 10; // size between 10px and 35px
      const style = {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 20 + 15}s`, // duration between 15s and 35s
        animationDelay: `-${Math.random() * 20}s`, // negative delay starts animation partway through
      };
      const colorClass = colors[Math.floor(Math.random() * colors.length)];
      particleArray.push({ id: i, style, colorClass });
    }
    return particleArray;
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className={`particle ${p.colorClass}`}
          style={p.style}
        />
      ))}
    </div>
  );
};

export default BackgroundParticles;
