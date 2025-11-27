import { rest } from 'msw';

// Initial test data
let questions = [
  { id: 1, prompt: 'lorem testum 1', answers: ['A', 'B', 'C', 'D'], correctIndex: 0 },
  { id: 2, prompt: 'lorem testum 2', answers: ['A', 'B', 'C', 'D'], correctIndex: 1 },
];

const bases = ['/questions', 'http://localhost:3001/questions'];

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
