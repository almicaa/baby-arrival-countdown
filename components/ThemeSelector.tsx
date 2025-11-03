
import React from 'react';
import { themes, Theme } from '../themes';

interface ThemeSelectorProps {
  onThemeChange: (theme: Theme) => void;
  currentThemeName: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onThemeChange, currentThemeName }) => {
  return (
    <div className="flex items-center justify-center space-x-2 p-2 bg-white/50 rounded-full shadow-sm">
      {themes.map((theme) => (
        <button
          key={theme.name}
          onClick={() => onThemeChange(theme)}
          className={`w-6 h-6 rounded-full transition-all duration-200 ease-in-out focus:outline-none ${currentThemeName === theme.name ? 'ring-2 ring-offset-2 ring-[var(--accent-primary)] scale-110' : 'hover:scale-110'}`}
          style={{ backgroundColor: theme.colors['--accent-primary'] }}
          aria-label={`Select ${theme.name} theme`}
          title={`${theme.name} Theme`}
        />
      ))}
    </div>
  );
};

export default ThemeSelector;
