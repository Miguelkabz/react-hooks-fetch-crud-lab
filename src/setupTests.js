import "@testing-library/jest-dom";
import { server } from "./mocks/server";

// start msw before tests and clean up after
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());