/* eslint-disable @typescript-eslint/no-empty-function */
if (typeof global !== 'undefined') {
  // 1. Fix for chart/visualization libraries that expect ResizeObserver on the server
  if (!global.ResizeObserver) {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }

  // 🧠 THE CUSTOM ELEMENTS SHIELD: Prevents ReferenceError: customElements is not defined
  if (!(global as any).customElements) {
    (global as any).customElements = {
      get: () => undefined,
      define: () => {},
      whenDefined: () => Promise.resolve(), // Resolves instantly so async hooks don't hang!
    };
  }

  // 🧠 Define a clean object structure that perfectly satisfies tracking scripts
  const mockLocation = {
    hostname: 'localhost',
    pathname: '/pdbe/pdbe-kb/complexes/PDB-CPX-154652',
    href: 'http://localhost:4000/pdbe/pdbe-kb/complexes/PDB-CPX-154652',
    search: '',
    hash: '',
  };

  // 2. Comprehensive DOM mock to safeguard style, classList, and attribute leaks
  if (!global.document) {
    const createDummyElement = () => ({
      style: {},
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false,
        toggle: () => {},
      },
      setAttribute: () => {},
      getAttribute: () => null,
      appendChild: () => {},
      removeChild: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    });

    (global as any).document = {
      documentElement: createDummyElement(),

      // 🧠 ADD THIS: Prevents the createTreeWalker fatal crash
      createTreeWalker: () => ({
        nextNode: () => null,
        currentNode: null,
      }),

      querySelector: () => createDummyElement(),
      querySelectorAll: () => [],
      getElementById: () => createDummyElement(),
      getElementsByClassName: () => [],
      getElementsByTagName: () => [],
      createElement: () => createDummyElement(),
      location: { hostname: 'localhost', pathname: '/' },
      body: { appendChild: () => {} },
    };
  }

  // 3. Fix for libraries calling window.addEventListener during evaluation
  if (!(global as any).window) {
    const windowMock = {
      ...global,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    };
    // Bind them bidirectionally so both window and global are perfectly safe
    (global as any).window = windowMock;
    (windowMock as any).global = windowMock;
  } else if (!(global as any).window.addEventListener) {
    // If window already exists but doesn't have listeners, patch them directly
    (global as any).window.addEventListener = () => {};
    (global as any).window.removeEventListener = () => {};
  }

  // 🧠 FORCE definitions onto the global execution scope so window.location works
  if (!(global as any).location) {
    (global as any).location = mockLocation;
  }
}
