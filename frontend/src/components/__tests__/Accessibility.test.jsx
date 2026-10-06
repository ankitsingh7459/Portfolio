import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'framer-motion';
import axe from 'axe-core';

import Layout from '../Layout';
import Hero from '../../features/hero/Hero';
import Projects from '../../features/projects/Projects';
import About from '../../features/about/About';
import Stack from '../../features/stack/Stack';
import Log from '../../features/log/Log';
import Resume from '../../features/resume/Resume';
import Contact from '../../features/contact/Contact';
import Terminal from '../../features/terminal/Terminal';
import CommandPalette from '../CommandPalette/CommandPalette';
import PrintApmCaseStudy from '../../pages/PrintApmCaseStudy';

describe('Accessibility Automated Audits (axe-core)', () => {
  it('has zero critical or serious a11y violations on complete Home page layout', async () => {
    const { container } = render(
      <LazyMotion features={domAnimation}>
        <MemoryRouter>
          <Layout>
            <Hero />
            <Projects />
            <About />
            <Stack />
            <Log />
            <Resume />
            <Contact />
          </Layout>
        </MemoryRouter>
      </LazyMotion>
    );

    // axe-core audit
    // In jsdom color contrast cannot compute computed CSS layout, so we check landmark, heading, aria, structure rules
    const results = await axe.run(container, {
      rules: {
        // color-contrast requires a real browser renderer (verified via CDP)
        'color-contrast': { enabled: false },
      },
    });

    const seriousOrCritical = results.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact)
    );

    expect(seriousOrCritical).toEqual([]);
  });

  it('has zero critical or serious a11y violations on expanded Terminal component', async () => {
    const { container } = render(
      <LazyMotion features={domAnimation}>
        <MemoryRouter>
          <Terminal />
        </MemoryRouter>
      </LazyMotion>
    );

    // Expand terminal
    const trigger = container.querySelector('button');
    if (trigger) trigger.click();

    const results = await axe.run(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    });

    const seriousOrCritical = results.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact)
    );

    expect(seriousOrCritical).toEqual([]);
  });

  it('has zero critical or serious a11y violations on open CommandPalette', async () => {
    const { container } = render(
      <LazyMotion features={domAnimation}>
        <MemoryRouter>
          <CommandPalette />
        </MemoryRouter>
      </LazyMotion>
    );

    // Trigger open
    window.dispatchEvent(new CustomEvent('open-command-palette'));

    const results = await axe.run(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    });

    const seriousOrCritical = results.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact)
    );

    expect(seriousOrCritical).toEqual([]);
  });

  it('has zero critical or serious a11y violations on PrintAPM case study page', async () => {
    const { container } = render(
      <LazyMotion features={domAnimation}>
        <MemoryRouter>
          <PrintApmCaseStudy />
        </MemoryRouter>
      </LazyMotion>
    );

    const results = await axe.run(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    });

    const seriousOrCritical = results.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact)
    );

    expect(seriousOrCritical).toEqual([]);
  });

  it('verifies non-text UI token #706654 contrast is >= 3:1 against #16140F', () => {
    // Relative luminance calculation per WCAG 2.1
    const getLuminance = (r, g, b) => {
      const [rs, gs, bs] = [r, g, b].map((c) => {
        const val = c / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const bgLum = getLuminance(0x16, 0x14, 0x0f); // #16140F
    const borderLum = getLuminance(0x70, 0x66, 0x54); // #706654

    const contrast = (borderLum + 0.05) / (bgLum + 0.05);
    expect(contrast).toBeGreaterThanOrEqual(3.0);
    expect(contrast).toBeCloseTo(3.28, 1);
  });
});
