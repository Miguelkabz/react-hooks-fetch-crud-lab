import React from "react";
import "whatwg-fetch";
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { rest } from "msw";
import { setupServer } from "msw/node";

import App from "../components/App";

// Initial test data
let questions = [
  { id: 1, prompt: "lorem testum 1", answers: ["A", "B", "C", "D"], correctIndex: 0 },
  { id: 2, prompt: "lorem testum 2", answers: ["A", "B", "C", "D"], correctIndex: 1 },
];

// Support both "/questions" and "http://localhost:4000/questions"
const bases = ["/questions", "http://localhost:4000/questions"];

// MSW handlers
export const handlers = bases.flatMap((base) => [
  rest.get(base, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(questions));
  }),

  rest.post(base, async (req, res, ctx) => {
    const body = await req.json();
    const newQ = { ...body, id: Date.now() };
    questions.push(newQ);
    return res(ctx.status(201), ctx.json(newQ));
  }),

  rest.delete(`${base}/:id`, (req, res, ctx) => {
    const id = Number(req.params.id);
    questions = questions.filter((q) => q.id !== id);
    return res(ctx.status(204));
  }),

  rest.patch(`${base}/:id`, async (req, res, ctx) => {
    const id = Number(req.params.id);
    const body = await req.json();
    questions = questions.map((q) => (q.id === id ? { ...q, ...body } : q));
    return res(ctx.status(200), ctx.json(questions.find((q) => q.id === id)));
  }),
]);

// Setup server
const server = setupServer(...handlers);

// Test lifecycle
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());


// -------------------------
//        TESTS
// -------------------------

test("displays question prompts after fetching", async () => {
  render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/i));

  expect(await screen.findByText(/lorem testum 1/i)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 2/i)).toBeInTheDocument();
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);

  // Wait for initial fetch
  await screen.findByText(/lorem testum 1/i);

  // Go to form
  fireEvent.click(screen.queryByText(/New Question/i));

  // Fill inputs
  fireEvent.change(screen.queryByLabelText(/Prompt/i), {
    target: { value: "Test Prompt" },
  });
  fireEvent.change(screen.queryByLabelText(/Answer 1/i), {
    target: { value: "Test Answer 1" },
  });
  fireEvent.change(screen.queryByLabelText(/Answer 2/i), {
    target: { value: "Test Answer 2" },
  });
  fireEvent.change(screen.queryByLabelText(/Correct Answer/i), {
    target: { value: "1" },
  });

  // Submit
  fireEvent.submit(screen.queryByText(/Add Question/i));

  // View list again
  fireEvent.click(screen.queryByText(/View Questions/i));

  expect(await screen.findByText(/Test Prompt/i)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 1/i)).toBeInTheDocument();
});

test("deletes the question when the delete button is clicked", async () => {
  const { rerender } = render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/i));

  await screen.findByText(/lorem testum 1/i);

  fireEvent.click(screen.queryAllByText(/Delete Question/i)[0]);

  await waitForElementToBeRemoved(() =>
    screen.queryByText(/lorem testum 1/i)
  );

  rerender(<App />);

  expect(screen.queryByText(/lorem testum 1/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/lorem testum 2/i)).toBeInTheDocument();
});

test("updates the answer when the dropdown is changed", async () => {
  const { rerender } = render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/i));

  await screen.findByText(/lorem testum 2/i);

  fireEvent.change(screen.queryAllByLabelText(/Correct Answer/i)[0], {
    target: { value: "3" },
  });

  expect(screen.queryAllByLabelText(/Correct Answer/i)[0].value).toBe("3");

  rerender(<App />);

  expect(screen.queryAllByLabelText(/Correct Answer/i)[0].value).toBe("3");
});
