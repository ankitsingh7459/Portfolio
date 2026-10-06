import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { Stack } from '../Stack';
import { stackData } from '../../../data/stack';

const renderStack = () => {
  return render(
    <LazyMotion features={domAnimation}>
      <Stack />
    </LazyMotion>
  );
};

describe('Stack Component', () => {
  it('renders section heading with cat stack.json command', async () => {
    renderStack();
    await waitFor(() => {
      expect(screen.getByText('cat stack.json')).toBeInTheDocument();
    });
  });

  it('uses semantic dl, ul, and li elements for JSON grouping', () => {
    const { container } = renderStack();
    expect(container.querySelector('dl')).toBeInTheDocument();
    expect(container.querySelectorAll('dt').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('dd').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('ul').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('li').length).toBeGreaterThan(0);
  });

  it('renders technologies from stack data', () => {
    renderStack();
    Object.values(stackData).forEach((items) => {
      items.forEach((item) => {
        expect(screen.getByText(new RegExp(`"${item}"`, 'i'))).toBeInTheDocument();
      });
    });
  });
});
