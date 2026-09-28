import '@testing-library/jest-dom';

// Suppress noisy MUI/i18next console warnings in tests
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  const msg = String(args[0] ?? '');
  if (msg.includes('Warning:') || msg.includes('i18next')) return;
  originalConsoleError(...args);
};
