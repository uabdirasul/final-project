/**
 * Jest Setup File
 * Provides global test configuration and ensures proper isolation between tests
 */

// Create a robust localStorage mock
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    if (typeof key !== "string") {
      throw new TypeError("key must be a string");
    }
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }

  get length() {
    return Object.keys(this.store).length;
  }

  key(index) {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

// Create a robust sessionStorage mock
class SessionStorageMock {
  constructor() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    if (typeof key !== "string") {
      throw new TypeError("key must be a string");
    }
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }

  get length() {
    return Object.keys(this.store).length;
  }

  key(index) {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

// Set up global mocks BEFORE any tests run
const localStorageMock = new LocalStorageMock();
const sessionStorageMock = new SessionStorageMock();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true,
  configurable: true
});

Object.defineProperty(global, "sessionStorage", {
  value: sessionStorageMock,
  writable: true,
  configurable: true
});

// Ensure proper DOM and window setup
if (typeof window !== "undefined") {
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    writable: true,
    configurable: true
  });
  Object.defineProperty(window, "sessionStorage", {
    value: sessionStorageMock,
    writable: true,
    configurable: true
  });
}

// Global test hooks for clean state between tests
beforeEach(() => {
  // Clear all storage before each test
  localStorage.clear();
  sessionStorage.clear();
  // Clear all mocks
  jest.clearAllMocks();
});

afterEach(() => {
  // Final cleanup after each test
  localStorage.clear();
  sessionStorage.clear();
  jest.restoreAllMocks();
});

// Suppress JSDOM navigation errors that tests expect to handle
if (typeof window !== "undefined" && window.console) {
  const originalError = console.error;
  console.error = function (...args) {
    // Suppress JSDOM navigation errors when tests intentionally redirect
    if (
      args[0] &&
      typeof args[0].message === "string" &&
      args[0].message.includes("Not implemented: navigation")
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}
