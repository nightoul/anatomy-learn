// Shuffles the questions and scatters them over the left and right columns.
// x and y are fractions (0–1) of the free space in the column.
export function randomLayout(questions) {
  const shuffled = [...questions]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  const rows = Math.ceil(shuffled.length / 2)
  return shuffled.map((question, i) => {
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
