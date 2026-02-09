import { server } from './mocks/server.node';

// Mock the native ScreenSecurity module for Jest
jest.mock('screen-security', () => ({
  getDeviceId: jest.fn(() => 'mock-device-id-test'),
}));

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset any request handlers that are declared as a part of our tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());
