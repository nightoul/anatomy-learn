// Questions asked about every muscle. `key` is the property name in muscles.js.
// A muscle with an empty value for a question simply isn't asked that question.
export const questions = [
  { key: 'latinName', label: 'Latin name' },
  { key: 'czechName', label: 'Czech name' },
  { key: 'shape', label: 'Shape' },
  { key: 'region', label: 'Region' },
  { key: 'depth', label: 'Depth' },
  { key: 'palpable', label: 'Palpable' },
  { key: 'jandaType', label: 'Janda type' },
]

function hasAnswer(value) {
  return Array.isArray(value) ? value.length > 0 : Boolean(value)
}

// The questions a given muscle has an answer for.
export function questionsFor(muscle) {
  return questions.filter((q) => hasAnswer(muscle[q.key]))
}
