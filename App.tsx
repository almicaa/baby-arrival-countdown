
import React, { useState, useEffect } from 'react';
import CountdownTimer from './components/CountdownTimer';
import MonthsProgressBar from './components/MonthsProgressBar';
import ThemeSelector from './components/ThemeSelector';
import BackgroundParticles from './components/BackgroundParticles';
import { DUE_DATE, PREGNANCY_START_DATE } from './constants';
import { themes, Theme } from './themes';


const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block text-[var(--accent-primary)]" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
);

const App: React.FC = () => {
  const [currentPregnancyMonth, setCurrentPregnancyMonth] = useState<number>(1);
  const [babyName, setBabyName] = useState<string>(() => {
    try {
      return window.localStorage.getItem('babyName') || '';
    } catch {
      return '';
    }
  });
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    try {
      const savedThemeName = window.localStorage.getItem('babyCountdownTheme');
      const savedTheme = themes.find(t => t.name === savedThemeName);
      return savedTheme || themes[1]; // Default to first theme
    } catch {
      return themes[0];
    }
  });

  useEffect(() => {
    // Apply theme colors as CSS variables
    const root = document.documentElement;
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Save theme to localStorage
    try {
      window.localStorage.setItem('babyCountdownTheme', currentTheme.name);
    } catch (error) {
      console.error("Could not save theme to localStorage", error);
    }
  }, [currentTheme]);
  
  useEffect(() => {
    try {
      window.localStorage.setItem('babyName', babyName);
    } catch (error) {
      console.error("Could not save baby's name to localStorage", error);
    }
  }, [babyName]);

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

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col items-center justify-center p-4 overflow-hidden relative transition-colors duration-500">
      <BackgroundParticles />
      <div className="absolute top-4 right-4 z-10">
        <ThemeSelector onThemeChange={handleThemeChange} currentThemeName={currentTheme.name} />
      </div>

      <div className="w-full max-w-4xl mx-auto text-center space-y-8 z-10 pt-16 md:pt-0">
        
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--accent-primary)] tracking-tight">
            {babyName ? `${babyName} is on the Way!` : 'Little Miracle is on the Way!'}
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)]">
            Counting down the moments until we meet our baby.
          </p>
        </header>

        <main className="bg-[var(--bg-secondary)] rounded-2xl shadow-lg p-6 md:p-10 space-y-8">
          <div className="mb-6">
            <label htmlFor="babyNameInput" className="sr-only">Baby's Name</label>
            <input
                id="babyNameInput"
                type="text"
                value={babyName}
                onChange={(e) => setBabyName(e.target.value)}
                placeholder="Enter Baby's Name"
                className="text-center bg-transparent border-b-2 border-[var(--accent-secondary)] focus:outline-none focus:ring-0 focus:border-[var(--accent-primary)] text-xl text-[var(--text-primary)] transition duration-300 w-full max-w-xs mx-auto block"
                aria-label="Baby's Name"
            />
          </div>

          <div className="flex items-center justify-center space-x-2">
            <HeartIcon />
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Due on {getFormattedDueDate()}</h2>
            <HeartIcon />
          </div>

          <CountdownTimer dueDate={DUE_DATE} babyName={babyName} />
        
          <div className="border-t border-[var(--accent-secondary)] pt-8">
             <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">Baby's 9 Month Journey</h3>
             <MonthsProgressBar currentMonth={currentPregnancyMonth} />
          </div>
        </main>

        <footer className="text-[var(--text-secondary)] pt-4">
          <p>Made with love <HeartIcon /></p>
        </footer>
      </div>
    </div>
  );
};

export default App;
