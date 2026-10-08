import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { About } from '../About';
import { aboutLines } from '../../../data/about';

const renderAbout = () => {
  return render(
    <LazyMotion features={domAnimation}>
      <About />
    </LazyMotion>
  );
};

describe('About Component', () => {
  it('renders section heading with cat about.txt command', async () => {
    renderAbout();
    await waitFor(() => {
      expect(screen.getByText('cat about.txt')).toBeInTheDocument();
    });
  });

  it('renders about lines from data source', () => {
    renderAbout();
    aboutLines.forEach((line) => {
      expect(screen.getByText(line)).toBeInTheDocument();
    });
  });
});
