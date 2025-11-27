import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import App from "../components/App";

// Mock fetch for testing
beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (options?.method === "DELETE") {
      return Promise.resolve({ ok: true });
    }
    if (options?.method === "POST") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 3, prompt: "New Question Prompt", answers: ["A","B","C","D"], correctAnswer: 0 }),
      });
    }
    if (options?.method === "PATCH") {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    }
    // Default GET /questions
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, prompt: "lorem testum 1", answers: ["A","B","C","D"], correctAnswer: 0 },
          { id: 2, prompt: "lorem testum 2", answers: ["A","B","C","D"], correctAnswer: 0 },
        ]),
    });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test("displays question prompts after fetching", async () => {
  await act(async () => {
    render(<App />);
  });

  await waitFor(() => {
    expect(screen.getByText("lorem testum 1")).toBeInTheDocument();
    expect(screen.getByText("lorem testum 2")).toBeInTheDocument();
  });
});

test("opens new question form and adds a question", async () => {
  await act(async () => {
    render(<App />);
  });

  const newQuestionButton = screen.getByText("New Question");

  await act(async () => {
    fireEvent.click(newQuestionButton);
  });

  const questionInput = await screen.findByLabelText("Prompt");
  const addButton = screen.getByText("Add Question");

  await act(async () => {
    fireEvent.change(questionInput, { target: { value: "New Question Prompt" } });
    fireEvent.click(addButton);
  });

  await waitFor(() => {
    expect(screen.getByText("New Question Prompt")).toBeInTheDocument();
  });
});

test("deletes a question when the delete button is clicked", async () => {
  await act(async () => {
    render(<App />);
  });

  await waitFor(() => screen.getByText("lorem testum 1"));
  const deleteButtons = screen.getAllByText("Delete Question");

  await act(async () => {
    fireEvent.click(deleteButtons[0]);
  });

  await waitFor(() => {
    expect(screen.queryByText("lorem testum 1")).not.toBeInTheDocument();
  });
});

test("updates the answer when the dropdown is changed", async () => {
  await act(async () => {
    render(<App />);
  });

  const firstSelect = await screen.findAllByLabelText("Correct Answer");
  await act(async () => {
    fireEvent.change(firstSelect[0], { target: { value: "2" } });
  });

  await waitFor(() => {
    expect(firstSelect[0].value).toBe("2"); // option "C"
  });
});
