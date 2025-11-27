import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../components/App";

// Sample data to mock existing questions
const mockQuestions = [
  { id: 1, prompt: "lorem testum 1", answer: "A" },
  { id: 2, prompt: "lorem testum 2", answer: "B" },
];

beforeEach(() => {
  // Mock global fetch
  global.fetch = jest.fn((url, options) => {
    if (url.endsWith("/questions") && (!options || options.method === "GET")) {
      // GET request to fetch questions
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockQuestions),
      });
    } else if (url.endsWith("/questions") && options.method === "POST") {
      // POST request to create a new question
      const newQuestion = { id: 3, prompt: "Test Prompt", answer: "A" };
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(newQuestion),
      });
    } else if (url.match(/\/questions\/\d+/) && options.method === "DELETE") {
      // DELETE request
      return Promise.resolve({ ok: true });
    }
    return Promise.reject(new Error("Unhandled fetch request"));
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test("displays question prompts after fetching", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/View Questions/i));

  await waitFor(() => {
    expect(screen.getByText(/lorem testum 1/i)).toBeInTheDocument();
    expect(screen.getByText(/lorem testum 2/i)).toBeInTheDocument();
  });
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);

  fireEvent.click(screen.getByText(/New Question/i));

  fireEvent.change(screen.getByLabelText(/Prompt/i), {
    target: { value: "Test Prompt" },
  });

  fireEvent.change(screen.getByLabelText(/Correct Answer/i), {
    target: { value: "0" },
  });

  fireEvent.click(screen.getByText(/Add Question/i));

  expect(await screen.findByText(/Test Prompt/i)).toBeInTheDocument();
});

test("deletes the question when the delete button is clicked", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/View Questions/i));

  const deleteButtons = await screen.findAllByText(/Delete Question/i);
  fireEvent.click(deleteButtons[0]);

  // Check that fetch was called with DELETE
  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringContaining("/questions/1"),
    expect.objectContaining({ method: "DELETE" })
  );
});

test("updates the answer when the dropdown is changed", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/View Questions/i));

  const select = await screen.findAllByLabelText(/Correct Answer/i);
  fireEvent.change(select[0], { target: { value: "2" } });

  expect(select[0].value).toBe("2");
});
