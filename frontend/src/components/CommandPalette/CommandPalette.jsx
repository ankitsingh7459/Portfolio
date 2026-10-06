import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { getCommandPaletteItems } from './commandPaletteItems';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const inputRef = useRef(null);
  const dialogRef = useRef(null);
  const backdropRef = useRef(null);
  const listboxRef = useRef(null);
  const previousFocusRef = useRef(null);

  const allItems = useMemo(() => getCommandPaletteItems(), []);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
    );
  }, [allItems, query]);

  // Open modal handler
  const openModal = () => {
    previousFocusRef.current = document.activeElement;
    setIsOpen(true);
    setQuery('');
    setActiveIndex(0);
  };

  // Close modal handler
  const closeModal = () => {
    setIsOpen(false);
    setQuery('');
    setActiveIndex(0);
    // Restore focus to opener element
    if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
      previousFocusRef.current.focus();
    }
  };

  // Global keyboard shortcuts (Ctrl+K / Cmd+K, Escape) and custom event listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        closeModal();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        const target = e.target;
        const tagName = target?.tagName?.toLowerCase();
        const isEditing =
          tagName === 'input' ||
          tagName === 'textarea' ||
          tagName === 'select' ||
          target?.isContentEditable;

        // Do not open when user is typing in form inputs (e.g. contact form)
        if (isEditing) return;

        e.preventDefault();
        if (isOpen) {
          closeModal();
        } else {
          openModal();
        }
      }
    };

    const handleCustomOpen = () => {
      openModal();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomOpen);
    };
  }, [isOpen]);

  // Lock body scroll and focus input when opened
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Auto-focus input
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 20);

      return () => {
        document.body.style.overflow = originalOverflow;
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  // Ensure active option is scrolled into view
  useEffect(() => {
    if (listboxRef.current && filteredItems.length > 0) {
      const activeEl = listboxRef.current.children[activeIndex];
      if (activeEl && typeof activeEl.scrollIntoView === 'function') {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex, filteredItems]);

  const runItemAction = (item) => {
    if (!item) return;

    if (item.type === 'route') {
      navigate(item.target);
      setTimeout(() => {
        const heading = document.querySelector('h1, h2');
        if (heading) {
          heading.setAttribute('tabindex', '-1');
          heading.focus();
        }
      }, 50);
    } else if (item.type === 'section') {
      const sectionId = item.target.replace(/^#/, '');
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({
          behavior: prefersReduced ? 'instant' : 'smooth',
        });
        const heading = el.querySelector('h2, h1, h3') || el;
        heading.setAttribute('tabindex', '-1');
        heading.focus();
      }
    } else if (item.type === 'external') {
      window.open(item.target, '_blank', 'noopener,noreferrer');
    } else if (item.type === 'download') {
      const a = document.createElement('a');
      a.href = item.target;
      a.download = item.filename || 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    closeModal();
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredItems.length === 0) return;
      setActiveIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredItems.length === 0) return;
      setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      if (filteredItems.length > 0) {
        setActiveIndex(filteredItems.length - 1);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems.length > 0 && filteredItems[activeIndex]) {
        runItemAction(filteredItems[activeIndex]);
      }
    } else if (e.key === 'Tab') {
      // Focus trap within modal
      e.preventDefault();
    }
  };

  if (!isOpen) return null;

  const activeItem = filteredItems[activeIndex];

  return (
    <div
      ref={backdropRef}
      onClick={(e) => {
        if (e.target === backdropRef.current) closeModal();
      }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/70 backdrop-blur-sm"
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-xl bg-[#16140F] border border-[#2E2A21] rounded-[2px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search header / Combobox */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2E2A21] bg-[#1E1B15]">
          <span className="font-mono text-sm text-[#E8A33D] select-none" aria-hidden="true">
            &gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-listbox"
            aria-activedescendant={activeItem ? activeItem.id : undefined}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Type a command or search..."
            className="w-full bg-transparent font-mono text-xs md:text-sm text-[#F1E9D2] placeholder-[#B9B09A]/50 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block font-mono text-[10px] text-[#B9B09A] border border-[#2E2A21] px-1.5 py-0.5 rounded-[2px]">
            ESC
          </kbd>
        </div>

        {/* Results Listbox */}
        <div className="overflow-y-auto p-2 max-h-96">
          {filteredItems.length === 0 ? (
            <p className="px-3 py-6 text-center font-mono text-xs text-[#B9B09A]">
              no matches
            </p>
          ) : (
            <ul
              ref={listboxRef}
              id="command-palette-listbox"
              role="listbox"
              aria-label="Command palette suggestions"
              className="space-y-1"
            >
              {filteredItems.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <li
                    key={item.id}
                    id={item.id}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => runItemAction(item)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`px-3 py-2.5 rounded-[2px] flex items-center justify-between cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-[#E8A33D]/15 text-[#F1E9D2] border border-[#E8A33D]/40'
                        : 'text-[#B9B09A] hover:bg-[#1E1B15] border border-transparent'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-xs font-semibold text-[#F1E9D2]">
                        {item.label}
                      </span>
                      {item.description && (
                        <span className="font-sans text-[11px] text-[#B9B09A]">
                          {item.description}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[10px] text-[#E8A33D] px-1.5 py-0.5 border border-[#2E2A21] rounded-[2px] uppercase">
                      {item.category}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#2E2A21] bg-[#1E1B15] font-mono text-[10px] text-[#B9B09A]">
          <div className="flex items-center gap-3">
            <span>↑↓ navigate</span>
            <span>↵ select</span>
            <span>esc close</span>
          </div>
          <span>warm terminal</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
