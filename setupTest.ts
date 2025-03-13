import "@testing-library/jest-dom/vitest";
const originalFetch = window.fetch;
window.fetch = (input, init) => {
  if (typeof input === "string" && input.startsWith("/")) {
    input = new URL(input, window.location.href).toString();
  }
  return originalFetch(input, init);
};

global.fetch = window.fetch;
global.URL = window.URL;
