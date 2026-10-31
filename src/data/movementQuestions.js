// Questions asked about every movement in the movement quiz. `key` is the
// property name in movements.js. Remove a line to stop asking that question.

// One answer each, shown as chips (like the muscle quiz).
export const singleQuestions = [
  { key: 'contraction', label: 'Contraction' },
  { key: 'plane', label: 'Plane' },
  { key: 'chain', label: 'Chain' },
  { key: 'sides', label: 'Sides' },
  { key: 'gravity', label: 'Gravity' },
]

// The muscle roles. Each role is asked in one of two ways:
// - recall: type muscles from memory; `required` of them are enough, the rest
//   are then revealed
// - sort:   the muscles of all sort roles are shown shuffled, and each one is
//   placed into the right role
// `hint` is shown when a muscle of this role is typed into another box. A role
// with no muscles for a movement (e.g. no stabilizers) is left out.
export const roleQuestions = [
  { key: 'agonists', label: 'Agonists', hint: 'That one is an agonist here.', mode: 'recall', required: 1 },
  { key: 'synergists', label: 'Synergists', hint: 'That one is a synergist here.', mode: 'sort' },
  { key: 'antagonists', label: 'Antagonists', hint: 'That one is an antagonist here.', mode: 'sort' },
  { key: 'stabilizers', label: 'Stabilizers', hint: 'That one is a stabilizer here.', mode: 'sort' },
]

// Typed into a box one by one, all of them needed.
export const regionQuestions = [
  { key: 'mainRegions', label: 'Main region', hint: "That's the main region here." },
  { key: 'secondaryRegions', label: 'Secondary regions', hint: "That's a secondary region here." },
]
