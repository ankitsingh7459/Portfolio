import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Terminal } from '../Terminal';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const setupMatchMedia = (isDesktop = true) => {
  window.matchMedia = vi.fn().mockImplementation((query) => {
    let matches = false;
    if (query === '(min-width: 768px)' || query === '(pointer: fine)') {
      matches = isDesktop;
    }
    return {
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  });
};

const renderTerminal = () => {
  return render(
    <MemoryRouter>
      <Terminal />
    </MemoryRouter>
  );
};

describe('Terminal UI Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMatchMedia(true);
  });

  it('renders collapsed prompt line initially and never autofocuses', () => {
    renderTerminal();
    const trigger = screen.getByRole('button', { name: /open interactive terminal/i });
    expect(trigger).toBeInTheDocument();
    expect(screen.getByText("type 'help'")).toBeInTheDocument();
    expect(document.activeElement).not.toBe(trigger);
  });

  it('expands terminal on click and shows desktop input when on desktop', async () => {
    renderTerminal();
    const trigger = screen.getByRole('button', { name: /open interactive terminal/i });
    fireEvent.click(trigger);

    expect(screen.getByRole('log')).toBeInTheDocument();
    const input = screen.getByRole('textbox', { name: /terminal command input/i });
    expect(input).toBeInTheDocument();
  });

  it('executes command on Enter and displays output in log', async () => {
    renderTerminal();
    fireEvent.click(screen.getByRole('button', { name: /open interactive terminal/i }));

    const input = screen.getByRole('textbox', { name: /terminal command input/i });
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    const log = screen.getByRole('log');
    expect(log).toHaveTextContent('> help');
    expect(log).toHaveTextContent('Available commands:');
    expect(input.value).toBe('');
  });

  it('walks command history with ArrowUp and ArrowDown', async () => {
    renderTerminal();
    fireEvent.click(screen.getByRole('button', { name: /open interactive terminal/i }));

    const input = screen.getByRole('textbox', { name: /terminal command input/i });

    // Run first command
    fireEvent.change(input, { target: { value: 'whoami' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Run second command
    fireEvent.change(input, { target: { value: 'projects' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // ArrowUp once -> 'projects'
    fireEvent.keyDown(input, { key: 'ArrowUp', code: 'ArrowUp' });
    expect(input.value).toBe('projects');

    // ArrowUp again -> 'whoami'
    fireEvent.keyDown(input, { key: 'ArrowUp', code: 'ArrowUp' });
    expect(input.value).toBe('whoami');

    // ArrowDown once -> 'projects'
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });
    expect(input.value).toBe('projects');

    // ArrowDown again -> empty
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });
    expect(input.value).toBe('');
  });

  it('clears output log on clear command and on Ctrl+L', async () => {
    renderTerminal();
    fireEvent.click(screen.getByRole('button', { name: /open interactive terminal/i }));

    const input = screen.getByRole('textbox', { name: /terminal command input/i });

    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(screen.getByRole('log')).toHaveTextContent('Available commands:');

    // Run clear command
    fireEvent.change(input, { target: { value: 'clear' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(screen.getByRole('log')).not.toHaveTextContent('Available commands:');

    // Re-add content and test Ctrl+L
    fireEvent.change(input, { target: { value: 'whoami' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(screen.getByRole('log')).toHaveTextContent('> whoami');

    fireEvent.keyDown(input, { key: 'l', ctrlKey: true });
    expect(screen.getByRole('log')).not.toHaveTextContent('> whoami');
  });

  it('completes command on Tab only when input has text and match exists', async () => {
    renderTerminal();
    fireEvent.click(screen.getByRole('button', { name: /open interactive terminal/i }));

    const input = screen.getByRole('textbox', { name: /terminal command input/i });

    // Tab with empty input does not change input
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    input.dispatchEvent(tabEvent);
    expect(input.value).toBe('');
    expect(tabEvent.defaultPrevented).toBe(false);

    // Tab with prefix completes
    fireEvent.change(input, { target: { value: 'proj' } });
    fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });
    expect(input.value).toBe('projects');
  });

  it('blurs input on Escape key', async () => {
    renderTerminal();
    fireEvent.click(screen.getByRole('button', { name: /open interactive terminal/i }));

    const input = screen.getByRole('textbox', { name: /terminal command input/i });
    input.focus();
    expect(document.activeElement).toBe(input);

    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
    expect(document.activeElement).not.toBe(input);
  });

  it('handles navigation to route /projects/printapm and section #projects', async () => {
    // Setup target DOM section for #projects
    const section = document.createElement('section');
    section.id = 'projects';
    const heading = document.createElement('h2');
    heading.textContent = 'Projects';
    section.appendChild(heading);
    document.body.appendChild(section);

    const scrollIntoViewMock = vi.fn();
    section.scrollIntoView = scrollIntoViewMock;

    renderTerminal();
    fireEvent.click(screen.getByRole('button', { name: /open interactive terminal/i }));

    const input = screen.getByRole('textbox', { name: /terminal command input/i });

    // Open route target
    fireEvent.change(input, { target: { value: 'open printapm' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(mockNavigate).toHaveBeenCalledWith('/projects/printapm');

    // Open section target
    fireEvent.change(input, { target: { value: 'open projects' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(scrollIntoViewMock).toHaveBeenCalled();

    document.body.removeChild(section);
  });

  it('renders mobile chips when on mobile screen or coarse pointer', async () => {
    setupMatchMedia(false); // Mobile
    renderTerminal();
    fireEvent.click(screen.getByRole('button', { name: /open interactive terminal/i }));

    // Input should NOT be present on mobile
    expect(screen.queryByRole('textbox', { name: /terminal command input/i })).toBeNull();

    // Chips should be present
    const helpChip = screen.getByRole('button', { name: 'help' });
    expect(helpChip).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'projects' })).toBeInTheDocument();

    // Clicking chip executes command
    fireEvent.click(helpChip);
    const log = screen.getByRole('log');
    expect(log).toHaveTextContent('> help');
    expect(log).toHaveTextContent('Available commands:');
  });

  it('renders HTML-looking user input strictly as plain text nodes, never creating DOM elements', async () => {
    renderTerminal();
    fireEvent.click(screen.getByRole('button', { name: /open interactive terminal/i }));

    const input = screen.getByRole('textbox', { name: /terminal command input/i });
    const xss = '<img src=x onerror=alert(1)>';

    fireEvent.change(input, { target: { value: xss } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    const log = screen.getByRole('log');
    expect(log).toHaveTextContent(xss);
    expect(log.querySelector('img')).toBeNull();
  });
});
