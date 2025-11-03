
import React, { useState, useEffect } from 'react';
import type { TimeLeft } from '../types';

interface CountdownTimerProps {
  dueDate: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ dueDate }) => {
  const calculateTimeLeft = (): TimeLeft | {} => {
    const difference = +new Date(dueDate) - +new Date();
    let timeLeft: TimeLeft | {} = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft | {}>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  // FIX: Refactored to use .map() and .filter() to avoid an explicit `JSX.Element[]` type annotation.
  // This resolves the "Cannot find namespace 'JSX'" error by letting TypeScript infer the type.
  const timerComponents = Object.keys(timeLeft)
    .map((interval) => {
      const value = timeLeft[interval as keyof TimeLeft];

      if (value === undefined || value === null) {
        return null;
      }

      return (
        <div key={interval} className="flex flex-col items-center justify-center bg-pink-100/50 p-4 rounded-xl min-w-[80px] md:min-w-[100px] shadow-inner">
          <span
            key={value}
            className="text-4xl md:text-6xl font-bold text-pink-500 animate-number-update"
          >
            {String(value).padStart(2, '0')}
          </span>
          <span className="text-sm md:text-base font-medium uppercase text-slate-500 tracking-wider">
            {interval}
          </span>
        </div>
      );
    })
    .filter(Boolean);

  return (
    <div className="flex justify-center items-center gap-3 md:gap-5">
      {timerComponents.length ? timerComponents : <span className="text-2xl font-bold text-green-500">Welcome Baby!</span>}
    </div>
  );
};

export default CountdownTimer;