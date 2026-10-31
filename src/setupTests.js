// jest-dom adds custom matchers for asserting on DOM nodes.
// Allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
import '@testing-library/jest-dom';

// Optional: silence noisy warnings during tests
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((msg) => {
    if (!msg.includes('act(')) console.warn(msg);
  });
});

afterAll(() => {
  console.error.mockRestore();
});