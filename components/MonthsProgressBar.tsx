
import React, { useState, useEffect } from 'react';
import MonthCard from './MonthCard';
import { MONTHS_DATA } from '../constants';
import type { MonthData } from '../types';

interface MonthsProgressBarProps {
  currentMonth: number;
}

const MonthsProgressBar: React.FC<MonthsProgressBarProps> = ({ currentMonth }) => {
  const [months, setMonths] = useState<MonthData[]>(() => {
    try {
      const savedMonths = window.localStorage.getItem('babyCountdownMonths');
      if (savedMonths) {
        return JSON.parse(savedMonths);
      }
    } catch (error) {
      console.error("Could not parse months data from localStorage", error);
    }
    return MONTHS_DATA;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('babyCountdownMonths', JSON.stringify(months));
    } catch (error) {
      console.error("Could not save months data to localStorage", error);
    }
  }, [months]);

  const handleImageUpload = (monthNumber: number, newImageUrl: string) => {
    setMonths(prevMonths =>
      prevMonths.map(month =>
        month.monthNumber === monthNumber
          ? { ...month, imageUrl: newImageUrl }
          : month
      )
    );
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-9 gap-4">
      {months.map((month, index) => (
        <MonthCard
          key={month.monthNumber}
          monthNumber={month.monthNumber}
          imageUrl={month.imageUrl}
          description={month.description}
          isCurrent={month.monthNumber === currentMonth}
          isPast={month.monthNumber < currentMonth}
          onImageUpload={handleImageUpload}
          animationStyle={{ animationDelay: `${index * 75}ms` }}
        />
      ))}
    </div>
  );
};

export default MonthsProgressBar;