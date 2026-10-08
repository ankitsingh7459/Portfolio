import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar/Navbar';

// Mock resumeData
vi.mock('../../data/resume', () => ({
  resumeData: {
    available: true,
  },
}));

describe('Responsive Behavior & Mobile Navigation', () => {
  it('renders mobile menu button with proper aria attributes', () => {
    render(<Navbar />);
    const menuBtn = screen.getByRole('button', { name: /open navigation menu/i });
    expect(menuBtn).toBeInTheDocument();
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
    expect(menuBtn.className).toContain('min-h-[44px]');
  });

  it('toggles mobile menu open and closed when mobile button is clicked', () => {
    render(<Navbar />);
    const menuBtn = screen.getByRole('button', { name: /open navigation menu/i });

    // Open menu
    fireEvent.click(menuBtn);
    expect(menuBtn).toHaveAttribute('aria-expanded', 'true');
    const mobileNavDialog = screen.getByRole('dialog', { name: /mobile navigation/i });
    expect(mobileNavDialog).toBeInTheDocument();

    // Verify touch targets for mobile nav links (44px min height)
    const mobileLinks = screen.getAllByRole('button', { name: /\$ cd ~\//i });
    expect(mobileLinks.length).toBeGreaterThan(0);
    mobileLinks.forEach((link) => {
      expect(link.className).toContain('min-h-[44px]');
    });

    // Close menu by clicking toggle again
    fireEvent.click(menuBtn);
    expect(screen.queryByRole('dialog', { name: /mobile navigation/i })).not.toBeInTheDocument();
  });

  it('closes mobile menu when Escape key is pressed', () => {
    render(<Navbar />);
    const menuBtn = screen.getByRole('button', { name: /open navigation menu/i });

    // Open menu
    fireEvent.click(menuBtn);
    expect(screen.getByRole('dialog', { name: /mobile navigation/i })).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /mobile navigation/i })).not.toBeInTheDocument();
  });
});
