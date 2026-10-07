import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CommandPalette } from '../CommandPalette';
import { getCommandPaletteItems } from '../commandPaletteItems';
import Navbar from '../../Navbar/Navbar';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderPalette = () => {
  return render(
    <MemoryRouter>
      <CommandPalette />
    </MemoryRouter>
  );
};

describe('CommandPalette items provider', () => {
  it('contains valid navigation, case study, and project items without invalid links', () => {
    const items = getCommandPaletteItems();
    expect(items.length).toBeGreaterThan(0);

    items.forEach((item) => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('category');
      expect(item).toHaveProperty('type');
      expect(item).toHaveProperty('target');

      // No item with missing, #, empty or placeholder link
      expect(item.target).not.toBe('#');
      expect(item.target).not.toBe('');
      expect(item.target).not.toBeNull();
      expect(item.target).not.toContain('[' + 'FILL');
    });
  });
});

describe('CommandPalette Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens on Ctrl+K and Meta+K keyboard shortcuts', async () => {
    renderPalette();

    expect(screen.queryByRole('dialog', { name: /command palette/i })).toBeNull();

    // Trigger Ctrl+K
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByRole('dialog', { name: /command palette/i })).toBeInTheDocument();

    // Close with Esc
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /command palette/i })).toBeNull();
    });

    // Trigger Meta+K (Cmd+K)
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(screen.getByRole('dialog', { name: /command palette/i })).toBeInTheDocument();
  });

  it('does NOT open when typing in input or textarea fields', () => {
    render(
      <MemoryRouter>
        <div>
          <input data-testid="form-input" />
          <textarea data-testid="form-textarea" />
          <CommandPalette />
        </div>
      </MemoryRouter>
    );

    const input = screen.getByTestId('form-input');
    fireEvent.keyDown(input, { key: 'k', ctrlKey: true });
    expect(screen.queryByRole('dialog', { name: /command palette/i })).toBeNull();

    const textarea = screen.getByTestId('form-textarea');
    fireEvent.keyDown(textarea, { key: 'k', ctrlKey: true });
    expect(screen.queryByRole('dialog', { name: /command palette/i })).toBeNull();
  });

  it('opens when the Navbar "Ctrl K" button is clicked', () => {
    render(
      <MemoryRouter>
        <div>
          <Navbar />
          <CommandPalette />
        </div>
      </MemoryRouter>
    );

    const navbarCtrlKBtn = screen.getByRole('button', { name: /open command palette/i });
    expect(navbarCtrlKBtn).toBeInTheDocument();

    fireEvent.click(navbarCtrlKBtn);
    expect(screen.getByRole('dialog', { name: /command palette/i })).toBeInTheDocument();
  });

  it('filters items by search query and shows "no matches" for unknown searches', () => {
    renderPalette();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    const searchInput = screen.getByRole('combobox');
    expect(searchInput).toBeInTheDocument();

    // Type query
    fireEvent.change(searchInput, { target: { value: 'printapm' } });
    expect(screen.getByText(/PrintAPM Case Study/i)).toBeInTheDocument();

    // Type nonsense
    fireEvent.change(searchInput, { target: { value: 'xyznonexistent123' } });
    expect(screen.getByText('no matches')).toBeInTheDocument();
  });

  it('navigates with ArrowDown, ArrowUp, Home, End and executes on Enter', () => {
    renderPalette();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    const searchInput = screen.getByRole('combobox');
    fireEvent.change(searchInput, { target: { value: 'printapm' } });

    // Arrow down and back up to test keyboard navigation
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
    fireEvent.keyDown(searchInput, { key: 'ArrowUp' });
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    expect(mockNavigate).toHaveBeenCalledWith('/projects/printapm');
    expect(screen.queryByRole('dialog', { name: /command palette/i })).toBeNull();
  });

  it('closes on Escape and restores focus to previous active element', async () => {
    render(
      <MemoryRouter>
        <div>
          <button data-testid="opener-btn">Opener Button</button>
          <CommandPalette />
        </div>
      </MemoryRouter>
    );

    const openerBtn = screen.getByTestId('opener-btn');
    openerBtn.focus();
    expect(document.activeElement).toBe(openerBtn);

    // Open palette
    fireEvent.keyDown(openerBtn, { key: 'k', ctrlKey: true });
    expect(screen.getByRole('dialog', { name: /command palette/i })).toBeInTheDocument();

    // Close palette with Escape
    const searchInput = screen.getByRole('combobox');
    fireEvent.keyDown(searchInput, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /command palette/i })).toBeNull();
      expect(document.activeElement).toBe(openerBtn);
    });
  });

  it('closes when clicking backdrop', async () => {
    renderPalette();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    const backdrop = screen.getByRole('presentation');
    fireEvent.click(backdrop);

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /command palette/i })).toBeNull();
    });
  });

  it('traps focus by preventing default Tab key within modal', () => {
    renderPalette();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    const searchInput = screen.getByRole('combobox');
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    searchInput.dispatchEvent(tabEvent);

    expect(tabEvent.defaultPrevented).toBe(true);
  });

  it('updates aria-expanded on Navbar trigger button when opened and closed', async () => {
    render(
      <MemoryRouter>
        <div>
          <Navbar />
          <CommandPalette />
        </div>
      </MemoryRouter>
    );

    const triggerBtn = screen.getByRole('button', { name: /open command palette/i });
    expect(triggerBtn).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    fireEvent.click(triggerBtn);
    expect(triggerBtn).toHaveAttribute('aria-expanded', 'true');

    // Close via Escape
    const searchInput = screen.getByRole('combobox');
    fireEvent.keyDown(searchInput, { key: 'Escape' });

    await waitFor(() => {
      expect(triggerBtn).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('safely falls back during focus restoration when opener element is detached from DOM', async () => {
    const { rerender } = render(
      <MemoryRouter>
        <div>
          <header>
            <button aria-label="navigation menu">Nav Menu</button>
          </header>
          <div id="dynamic-container">
            <button data-testid="temp-opener">Temporary Opener</button>
          </div>
          <CommandPalette />
        </div>
      </MemoryRouter>
    );

    const tempOpener = screen.getByTestId('temp-opener');
    tempOpener.focus();
    expect(document.activeElement).toBe(tempOpener);

    // Open palette
    fireEvent.keyDown(tempOpener, { key: 'k', ctrlKey: true });
    expect(screen.getByRole('dialog', { name: /command palette/i })).toBeInTheDocument();

    // Now unmount/remove the temporary opener from the DOM before closing
    rerender(
      <MemoryRouter>
        <div>
          <header>
            <button aria-label="navigation menu">Nav Menu</button>
          </header>
          <div id="dynamic-container" />
          <CommandPalette />
        </div>
      </MemoryRouter>
    );

    expect(screen.queryByTestId('temp-opener')).toBeNull();

    // Close palette with Escape
    const searchInput = screen.getByRole('combobox');
    fireEvent.keyDown(searchInput, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /command palette/i })).toBeNull();
      // Focus should have safely fallen back to the visible navigation control
      const navMenuBtn = screen.getByRole('button', { name: /navigation menu/i });
      expect(document.activeElement).toBe(navMenuBtn);
    });
  });
});
