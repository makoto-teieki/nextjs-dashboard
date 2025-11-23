/**
 * Mock for postgres module
 */

const mockSql = jest.fn();

// Export a function that returns the mock sql function
export default jest.fn(() => mockSql);

// Also export mockSql for test access
export { mockSql };
