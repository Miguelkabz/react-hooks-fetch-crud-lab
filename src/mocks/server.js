import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Export a pre-configured server
export const server = setupServer(...handlers);
