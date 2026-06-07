import { useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContextCore';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accessGranted, setAccessGranted }}>
      {children}
    </ThemeContext.Provider>
  );
};
