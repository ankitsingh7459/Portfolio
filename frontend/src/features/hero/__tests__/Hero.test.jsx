import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { Hero } from '../Hero';
import { heroData } from '../../../data/hero';

const renderHero = () => {
  return render(
    <LazyMotion features={domAnimation}>
      <Hero />
    </LazyMotion>
  );
};

describe('Hero Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('has full accessible text present in DOM from first render via .sr-only', () => {
    const { container } = renderHero();

    const srOnly = container.querySelector('.sr-only');
    expect(srOnly).toBeInTheDocument();
    expect(srOnly).toHaveTextContent(heroData.prompt);
    expect(srOnly).toHaveTextContent(heroData.name);
    expect(srOnly).toHaveTextContent(heroData.descriptor);
    expect(srOnly).toHaveTextContent(heroData.heroLine);
  });

  it('renders actions that are present, focusable, and clickable', () => {
    renderHero();

    const primaryBtn = screen.getByRole('button', { name: heroData.primaryAction.label });
    expect(primaryBtn).toBeInTheDocument();
    primaryBtn.focus();
    expect(document.activeElement).toBe(primaryBtn);

    // Test scroll interaction
    const scrollIntoViewMock = vi.fn();
    const mockTarget = document.createElement('div');
    mockTarget.id = heroData.primaryAction.targetId;
    mockTarget.scrollIntoView = scrollIntoViewMock;
    document.body.appendChild(mockTarget);

    fireEvent.click(primaryBtn);
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
    document.body.removeChild(mockTarget);

    // Test secondary link
    const secondaryLink = screen.getByRole('link', { name: heroData.secondaryAction.label });
    expect(secondaryLink).toBeInTheDocument();
    expect(secondaryLink).toHaveAttribute('href', heroData.secondaryAction.href);
    expect(secondaryLink).toHaveAttribute('target', '_blank');
    expect(secondaryLink).toHaveAttribute('rel', 'noopener noreferrer');
    secondaryLink.focus();
    expect(document.activeElement).toBe(secondaryLink);
  });

  it('renders all text immediately without typing animation when prefers-reduced-motion is true', async () => {
    // Mock matchMedia to simulate prefers-reduced-motion: reduce
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('prefers-reduced-motion: reduce'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = renderHero();

    // Visual layer is aria-hidden="true"
    const visualContainer = container.querySelector('[aria-hidden="true"]');
    expect(visualContainer).toBeInTheDocument();
    expect(visualContainer).toHaveTextContent(heroData.prompt);
    expect(visualContainer).toHaveTextContent(heroData.name);
    expect(visualContainer).toHaveTextContent(heroData.descriptor);
    expect(visualContainer).toHaveTextContent(heroData.heroLine);

    // No blinking cursor should exist
    const cursor = container.querySelector('.cursor-block');
    expect(cursor).not.toBeInTheDocument();
  });

  it('skips typing animation on keydown and displays all text immediately', () => {
    // Default motion: matchMedia returns false
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = renderHero();
    const visualContainer = container.querySelector('[aria-hidden="true"]');

    // Initially, prompt hasn't completed typing all content
    // Trigger keydown to skip
    act(() => {
      fireEvent.keyDown(window, { key: 'Escape' });
    });

    // Everything is now fully displayed
    expect(visualContainer).toHaveTextContent(heroData.prompt);
    expect(visualContainer).toHaveTextContent(heroData.name);
    expect(visualContainer).toHaveTextContent(heroData.descriptor);
    expect(visualContainer).toHaveTextContent(heroData.heroLine);
  });

  it('skips typing animation on click and displays all text immediately', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = renderHero();
    const section = container.querySelector('#hero');
    const visualContainer = container.querySelector('[aria-hidden="true"]');

    act(() => {
      fireEvent.click(section);
    });

    expect(visualContainer).toHaveTextContent(heroData.prompt);
    expect(visualContainer).toHaveTextContent(heroData.name);
    expect(visualContainer).toHaveTextContent(heroData.descriptor);
    expect(visualContainer).toHaveTextContent(heroData.heroLine);
  });
});
