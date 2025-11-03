
import React, { useState, useEffect } from 'react';
import CountdownTimer from './components/CountdownTimer';
import MonthsProgressBar from './components/MonthsProgressBar';
import { DUE_DATE, PREGNANCY_START_DATE } from './constants';

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block text-pink-400" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
);

const App: React.FC = () => {
  const [currentPregnancyMonth, setCurrentPregnancyMonth] = useState<number>(1);

  useEffect(() => {
    const calculateCurrentMonth = () => {
      const now = new Date();
      const startDate = new Date(PREGNANCY_START_DATE);
      
      if (now < startDate) {
        return 1;
      }

      const monthsElapsed = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
      
      // We add 1 because pregnancy months are 1-indexed.
      const currentMonth = monthsElapsed + 1;
      
      // Cap the month at 9.
      return Math.min(Math.max(currentMonth, 1), 9);
    };

    setCurrentPregnancyMonth(calculateCurrentMonth());
  }, []);

  const getFormattedDueDate = () => {
    const date = new Date(DUE_DATE);
    const day = date.getDate();
    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) {
      suffix = 'st';
    } else if (day === 2 || day === 22) {
      suffix = 'nd';
    } else if (day === 3 || day === 23) {
      suffix = 'rd';
    }
    return `${date.toLocaleString('default', { month: 'long' })} ${day}${suffix}`;
  };


  return (
    <div className="min-h-screen bg-pink-50 text-slate-700 flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-4xl mx-auto text-center space-y-8">
        
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-pink-500 tracking-tight">
            Little Miracle is on the Way!
          </h1>
          <p className="text-lg md:text-xl text-slate-500">
            Counting down the moments until we meet our baby.
          </p>
        </header>

        <main className="bg-white rounded-2xl shadow-lg p-6 md:p-10 space-y-8">
          <div className="flex items-center justify-center space-x-2">
            <HeartIcon />
            <h2 className="text-2xl font-semibold text-slate-600">Due on {getFormattedDueDate()}</h2>
            <HeartIcon />
          </div>

          <CountdownTimer dueDate={DUE_DATE} />
        
          <div className="border-t border-pink-100 pt-8">
             <h3 className="text-2xl font-semibold text-slate-600 mb-6">Baby's 9 Month Journey</h3>
             <MonthsProgressBar currentMonth={currentPregnancyMonth} />
          </div>
        </main>

        <footer className="text-slate-400 pt-4">
          <p>Made with love <HeartIcon /></p>
        </footer>
      </div>
    </div>
  );
};

export default App;
