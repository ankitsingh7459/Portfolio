import '@testing-library/jest-dom';

if (typeof window !== 'undefined') {
  // Polyfill window.matchMedia for JSDOM
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  }

  // Polyfill scrollTo
  window.scrollTo = () => {};

  // Polyfill IntersectionObserver for JSDOM
  class MockIntersectionObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe(element) {
      this.callback([{ isIntersecting: true, target: element }]);
    }
    unobserve() {}
    disconnect() {}
  }

  window.IntersectionObserver = MockIntersectionObserver;
  globalThis.IntersectionObserver = MockIntersectionObserver;
}
