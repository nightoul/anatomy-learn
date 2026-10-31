import { describe, expect, it } from 'vitest'
import { randomLayout } from '../src/lib/randomLayout.js'
import { shuffled } from '../src/lib/shuffle.js'

describe('shuffled', () => {
  it('returns the same items in some order, without changing the original', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8]
    const result = shuffled(items)
    expect([...result].sort((a, b) => a - b)).toEqual(items)
    expect(items).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })
})

describe('randomLayout', () => {
  const questions = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((key) => ({ key }))

  it('places every question exactly once, alternating left and right', () => {
    const layout = randomLayout(questions)
    expect(layout.map((item) => item.question.key).sort()).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g'])
    expect(layout.filter((item) => item.side === 'left')).toHaveLength(4)
    expect(layout.filter((item) => item.side === 'right')).toHaveLength(3)
  })

  it('keeps positions inside the column and each question in its own band', () => {
    // Repeat, since the positions are random.
    for (let run = 0; run < 50; run++) {
      const layout = randomLayout(questions)
      const rows = Math.ceil(questions.length / 2)
      layout.forEach((item, i) => {
        const row = Math.floor(i / 2)
        expect(item.x).toBeGreaterThanOrEqual(0)
        expect(item.x).toBeLessThan(1)
        // Inside the upper 70 % of its band, leaving room before the next band.
        expect(item.y).toBeGreaterThanOrEqual(row / rows)
        expect(item.y).toBeLessThan((row + 0.7) / rows)
      })
    }
  })
})
