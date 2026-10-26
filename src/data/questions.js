// Questions asked about every muscle. `key` is the property name in muscles.js.
// A muscle with an empty value for a question simply isn't asked that question,
// unless the question has a `placeholder` answer to use instead.
export const questions = [
  { key: 'latinName', label: 'Latin name' },
  { key: 'czechName', label: 'Czech name' },
  { key: 'shape', label: 'Shape' },
  { key: 'region', label: 'Region' },
  { key: 'depth', label: 'Depth' },
  { key: 'palpable', label: 'Palpable' },
  { key: 'jandaType', label: 'Janda type' },
  // TEMPORARY: exercise groups aren't filled in yet, so "x" is accepted for now.
  { key: 'exerciseGroup', label: 'Exercise group', placeholder: 'x' },
]

export function hasAnswer(value) {
  return Array.isArray(value) ? value.length > 0 : Boolean(value)
}

// The answer to a question for a given muscle, falling back to the placeholder.
export function answerFor(muscle, question) {
  const value = muscle[question.key]
  return hasAnswer(value) ? value : (question.placeholder ?? '')
}

// The questions a given muscle has an answer for.
export function questionsFor(muscle) {
  return questions.filter((q) => hasAnswer(answerFor(muscle, q)))
}
