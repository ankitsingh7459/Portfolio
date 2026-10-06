import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { runCommand, complete, addHistory } from '../../lib/terminalCommands';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { heroData } from '../../data/hero';
import { aboutLines } from '../../data/about';
import { DEFAULT_PROJECTS } from '../../data/projects';
import { stackData } from '../../data/stack';
import { resumeData } from '../../data/resume';
import { contactData } from '../../data/contact';

const MOBILE_CHIPS = ['help', 'projects', 'about', 'stack', 'resume', 'contact'];

const checkIsDesktopMedia = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return true;
  const mqlWidth = window.matchMedia('(min-width: 768px)');
  const mqlPointer = window.matchMedia('(pointer: fine)');
  return mqlWidth.matches && mqlPointer.matches;
};

export const Terminal = () => {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [logs, setLogs] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDesktop, setIsDesktop] = useState(checkIsDesktopMedia);

  const inputRef = useRef(null);
  const logContainerRef = useRef(null);

  const ctx = {
    hero: heroData,
    about: aboutLines,
    projects: DEFAULT_PROJECTS,
    stack: stackData,
    resume: resumeData,
    contact: contactData,
  };

  // Detect desktop (width >= 768px and fine pointer) vs mobile / coarse pointer
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mqlWidth = window.matchMedia('(min-width: 768px)');
    const mqlPointer = window.matchMedia('(pointer: fine)');
    const update = () => setIsDesktop(checkIsDesktopMedia());

    mqlWidth.addEventListener?.('change', update);
    mqlPointer.addEventListener?.('change', update);
    return () => {
      mqlWidth.removeEventListener?.('change', update);
      mqlPointer.removeEventListener?.('change', update);
    };
  }, []);

  // Auto-scroll log to bottom when logs update
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleNavigate = (target) => {
    if (!target) return;
    if (target.startsWith('/')) {
      navigate(target);
      setTimeout(() => {
        const heading = document.querySelector('h1, h2');
        if (heading) {
          heading.setAttribute('tabindex', '-1');
          heading.focus();
        }
      }, 50);
    } else if (target.startsWith('#')) {
      const sectionId = target.slice(1);
      const sectionEl = document.getElementById(sectionId);
      if (sectionEl) {
        sectionEl.scrollIntoView({
          behavior: prefersReduced ? 'instant' : 'smooth',
        });
        const heading = sectionEl.querySelector('h2, h1, h3') || sectionEl;
        heading.setAttribute('tabindex', '-1');
        heading.focus();
      }
    }
  };

  const executeCommand = (cmdStr) => {
    const result = runCommand(cmdStr, ctx);

    if (result.kind === 'clear') {
      setLogs([]);
    } else {
      setLogs((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          command: cmdStr,
          lines: result.lines,
        },
      ]);
    }

    if (result.kind === 'navigate' && result.target) {
      handleNavigate(result.target);
    }

    const nextHistory = addHistory(history, cmdStr);
    setHistory(nextHistory);
    setHistoryIndex(-1);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim().length > 0) {
        executeCommand(inputValue);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx =
        historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputValue(history[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (history.length === 0 || historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) {
        setHistoryIndex(-1);
        setInputValue('');
      } else {
        setHistoryIndex(nextIdx);
        setInputValue(history[nextIdx]);
      }
    } else if (e.key === 'Tab') {
      // Tab completes ONLY when input has text and a completion exists;
      // otherwise Tab moves focus normally (no keyboard trap).
      if (inputValue.trim().length > 0) {
        const matches = complete(inputValue);
        if (matches.length > 0) {
          e.preventDefault();
          setInputValue(matches[0]);
        }
      }
    } else if (e.key === 'Escape') {
      inputRef.current?.blur();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      setLogs([]);
    }
  };

  return (
    <div className="pt-6 w-full max-w-2xl" data-testid="terminal-container">
      {!isExpanded ? (
        <button
          type="button"
          onClick={() => {
            setIsExpanded(true);
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
          onFocus={() => setIsExpanded(true)}
          className="group inline-flex items-center gap-2 font-mono text-xs md:text-sm text-[#B9B09A] hover:text-[#F1E9D2] border border-transparent hover:border-[#2E2A21] px-2.5 py-1.5 rounded-[2px] transition-colors cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2 min-h-[44px]"
          aria-label="Open interactive terminal"
        >
          <span className="text-[#E8A33D] select-none" aria-hidden="true">
            ~/ankit $
          </span>
          <span>type &apos;help&apos;</span>
          <span
            className="text-[#E8A33D] opacity-0 group-hover:opacity-100 transition-opacity ml-1 select-none"
            aria-hidden="true"
          >
            _
          </span>
        </button>
      ) : (
        <div className="border border-[#2E2A21] bg-[#16140F] rounded-[2px] p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2E2A21] pb-2 font-mono text-xs text-[#B9B09A]">
            <div className="flex items-center gap-2">
              <span className="text-[#E8A33D]" aria-hidden="true">
                ●
              </span>
              <span>terminal</span>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-[#B9B09A] hover:text-[#F1E9D2] hover:underline px-1 py-0.5 rounded-[2px] focus-visible:outline-2 focus-visible:outline-[#E8A33D] cursor-pointer"
              aria-label="Collapse terminal panel"
            >
              [close]
            </button>
          </div>

          {/* Output log area */}
          <div
            ref={logContainerRef}
            role="log"
            aria-live="polite"
            className="max-h-64 overflow-y-auto space-y-2 font-mono text-xs text-[#F1E9D2] pr-1"
          >
            {logs.length === 0 && (
              <p className="text-[#B9B09A] select-none">
                Interactive shell ready. Type &apos;help&apos; to view commands.
              </p>
            )}

            {logs.map((entry) => (
              <div key={entry.id} className="space-y-1">
                <div className="flex items-center gap-2 text-[#E8A33D]">
                  <span className="select-none" aria-hidden="true">&gt; </span>
                  <span>{entry.command}</span>
                </div>
                {entry.lines.map((line, idx) => (
                  <p
                    key={`${entry.id}-line-${idx}`}
                    className="text-[#F1E9D2] whitespace-pre-wrap pl-3"
                  >
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Interactive controls: Desktop input vs Mobile chips */}
          {isDesktop ? (
            <div className="flex items-center gap-2 pt-2 border-t border-[#2E2A21]">
              <label htmlFor="terminal-input" className="sr-only">
                Terminal command input
              </label>
              <span
                className="font-mono text-xs text-[#E8A33D] select-none"
                aria-hidden="true"
              >
                $
              </span>
              <input
                id="terminal-input"
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                spellCheck="false"
                placeholder="type 'help' or command..."
                className="font-mono text-xs bg-transparent text-[#F1E9D2] placeholder-[#B9B09A]/50 focus:outline-none flex-1 py-1"
              />
            </div>
          ) : (
            <div className="pt-2 border-t border-[#2E2A21] space-y-2">
              <span className="font-mono text-[10px] text-[#B9B09A] block">
                Quick commands:
              </span>
              <div className="flex flex-wrap gap-2">
                {MOBILE_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => executeCommand(chip)}
                    className="font-mono text-xs text-[#F1E9D2] bg-[#1E1B15] border border-[#2E2A21] hover:border-[#E8A33D] hover:text-[#E8A33D] px-3 py-2 rounded-[2px] min-h-[44px] inline-flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Terminal;
