# anatomy-learn

A quiz app for learning muscles and how they work together in movement.
Built with React + Vite and deployed to GitHub Pages by the workflow in
`.github/workflows/deploy.yml` on every push to `master`.

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```

Unit tests ([Vitest](https://vitest.dev)) live in `tests/`:

| File | Checks |
|---|---|
| `data.test.js` | the content: valid values, every muscle and movement complete, no muscle referenced that doesn't exist, no name shared by two muscles |
| `answers.test.js` | answer matching: case, diacritics, optional words, short forms |
| `dataHelpers.test.js` | the data checks themselves |
| `random.test.js` | shuffling and the scattered chip layout |

The deploy workflow runs the tests before building, so a mistake in the data
stops the deploy instead of reaching the live site.

## Quizzes

- **Muscle properties** (`src/quizzes/MuscleQuiz.jsx`, `#/quiz/muscles`) — a
  muscle image with questions scattered around it: Latin and Czech name, shape,
  region, depth, palpability and Janda type.
- **Movements** (`src/quizzes/MovementQuiz.jsx`, `#/quiz/movements`) — a
  movement situation: name an agonist, sort the synergists, antagonists and
  stabilizers into their roles, and answer the contraction type, plane, chain,
  sides, gravity and the main and secondary regions.

The list of quizzes shown on the homepage is `src/quizzes/index.js`.

## Project structure

| Folder | Contents |
|---|---|
| `src/pages/` | the two routes: the homepage and a quiz page |
| `src/quizzes/` | the quizzes themselves, plus `index.js` listing them |
| `src/components/` | building blocks shared by the quizzes (modal, footer, picture, question chip, answer boxes, sorting task, results) |
| `src/hooks/` | `useQuizDialog` (opening and closing the modal) and `useQuizProgress` (moving through the items, score) |
| `src/lib/` | plain helpers: answer matching, shuffling, the scattered chip layout |
| `src/styles/` | all CSS: one file per component, page and quiz, plus `base.css` for the colours, base styles, buttons and animations used everywhere |
| `src/data/` | all content (see below) |

`src/styles/index.css` imports every style file in the order they apply and is
the only CSS imported by the app (from `src/main.jsx`).

## Data

All content lives in `src/data/`:

| File | Contents |
|---|---|
| `muscles.js` | every muscle and its properties |
| `movements.js` | movement situations; muscles are referenced by their `id` from `muscles.js` |
| `muscleShapes.js`, `answerValues.js` | the fixed answer values (shape, region, depth, …) with their accepted short forms |
| `muscleQuestions.js`, `movementQuestions.js` | which questions each quiz asks |

The data is checked when the app loads: an unknown value or a reference to a
muscle that doesn't exist stops the app in development (and is only logged on
the live site).

Answers ignore case, diacritics and the words *musculus* / *sval*.

## Images

Put images into `src/assets/muscles/` or `src/assets/movements/`, named exactly
as the entry's `image` field (e.g. `PsoasMajor.png`). They're picked up
automatically. The muscle quiz shows only muscles that have an image; the
movement quiz shows a placeholder until one is added. A file that no entry uses
produces a warning in the browser console.
