import { useEffect } from 'react';

export const useKeyboardShortcuts = ({ onTerminal, onChat, onTheme }) => {
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === '`' && e.ctrlKey) { e.preventDefault(); onTerminal?.(); }
      if (e.key === '/' && !e.ctrlKey) { e.preventDefault(); onChat?.(); }
      if (e.key === 'd' && e.ctrlKey) { e.preventDefault(); onTheme?.(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onTerminal, onChat, onTheme]);
};
