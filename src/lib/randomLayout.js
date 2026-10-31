import { shuffled } from './shuffle.js'

// Shuffles the questions and scatters them over the left and right columns.
// x and y are fractions (0–1) of the free space in the column.
export function randomLayout(questions) {
  const order = shuffled(questions)
  const rows = Math.ceil(order.length / 2)
  return order.map((question, i) => {
    const row = Math.floor(i / 2)
    return {
      question,
      side: i % 2 === 0 ? 'left' : 'right',
      // One question per row band per side, placed randomly in the upper 70 % of
      // its band, so the questions spread over the whole column while leaving
      // room for a chip's height before the next band.
      x: Math.random(),
      y: rows === 1 ? Math.random() : (row + Math.random() * 0.7) / rows,
    }
  })
}
