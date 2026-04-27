import { server } from '@/mocks/server';
import { afterAll, afterEach, beforeAll } from '@jest/globals';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
