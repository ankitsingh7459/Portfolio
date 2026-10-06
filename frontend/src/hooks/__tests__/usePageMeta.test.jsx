import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { usePageMeta } from '../usePageMeta';

const MetaTestComponent = ({ title, description, canonicalPath, noindex }) => {
  usePageMeta({ title, description, canonicalPath, noindex });
  return <div>Meta Test Component</div>;
};

const renderWithMeta = (props, route = '/') => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <MetaTestComponent {...props} />
    </MemoryRouter>
  );
};

describe('usePageMeta hook', () => {
  let metaDesc;
  let linkCanonical;

  beforeEach(() => {
    // Setup head elements
    document.title = 'Default Title';

    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    metaDesc.setAttribute('content', 'Default description');
    document.head.appendChild(metaDesc);

    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    linkCanonical.setAttribute('href', 'https://initial.example.com/');
    document.head.appendChild(linkCanonical);
  });

  afterEach(() => {
    document.title = '';
    metaDesc?.remove();
    linkCanonical?.remove();
    document.querySelector('meta[name="robots"]')?.remove();
  });

  it('updates document title and meta description per route', () => {
    const { unmount } = renderWithMeta({
      title: 'Custom Page Title',
      description: 'Custom page description for search engines.',
    });

    expect(document.title).toBe('Custom Page Title');
    expect(metaDesc.getAttribute('content')).toBe('Custom page description for search engines.');

    unmount();
    expect(document.title).toBe('Default Title');
    expect(metaDesc.getAttribute('content')).toBe('Default description');
  });

  it('updates canonical link based on route and canonicalPath', () => {
    renderWithMeta(
      { canonicalPath: '/projects/printapm' },
      '/projects/printapm'
    );

    const href = linkCanonical.getAttribute('href');
    expect(href).toContain('/projects/printapm');
  });

  it('sets robots noindex meta tag for error/private routes and cleans up on unmount', () => {
    expect(document.querySelector('meta[name="robots"]')).toBeNull();

    const { unmount } = renderWithMeta({
      title: '404: Not Found',
      noindex: true,
    });

    const robotsMeta = document.querySelector('meta[name="robots"]');
    expect(robotsMeta).toBeInTheDocument();
    expect(robotsMeta.getAttribute('content')).toBe('noindex, nofollow');

    unmount();
    expect(document.querySelector('meta[name="robots"]')).toBeNull();
  });
});
