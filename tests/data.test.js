// Checks the content in src/data. Loading the data files already runs their
// own checks (unknown values, unknown muscles in a movement, …), which throw
// here and make the tests — and the deploy — fail.
import { describe, expect, it } from 'vitest'
import { regionQuestions, roleQuestions, singleQuestions } from '../src/data/movementQuestions.js'
import { ROLES, movements } from '../src/data/movements.js'
import { questions as muscleQuestions } from '../src/data/muscleQuestions.js'
import { muscles } from '../src/data/muscles.js'
import { acceptedAnswers, normalize } from '../src/lib/answers.js'

const isFilled = (value) => acceptedAnswers(value).length > 0 && acceptedAnswers(value).every((v) => v.trim() !== '')

describe('muscles', () => {
  it('have unique ids', () => {
    const ids = muscles.map((m) => m.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('have unique image file names', () => {
    const files = muscles.map((m) => m.imageFile)
    expect(files.filter((file, i) => files.indexOf(file) !== i)).toEqual([])
  })

  it.each(['latinName', 'czechName', 'shape', 'region', 'depth', 'palpable'])('all have a %s', (key) => {
    const missing = muscles.filter((m) => !isFilled(m[key])).map((m) => m.id)
    expect(missing).toEqual([])
  })

  it('have a property for every question of the muscle quiz', () => {
    for (const question of muscleQuestions) {
      const missing = muscles.filter((m) => !(question.key in m)).map((m) => m.id)
      expect(missing, question.key).toEqual([])
    }
  })

  it("don't share an accepted name — a typed name must point to exactly one muscle", () => {
    const owner = new Map()
    const clashes = []
    for (const m of muscles) {
      for (const name of [...acceptedAnswers(m.latinName), ...acceptedAnswers(m.czechName)]) {
        const key = normalize(name)
        if (owner.has(key) && owner.get(key) !== m.id) clashes.push(`"${name}": ${owner.get(key)} and ${m.id}`)
        owner.set(key, m.id)
      }
    }
    expect(clashes).toEqual([])
  })
})

describe('movements', () => {
  const muscleIds = new Set(muscles.map((m) => m.id))

  it('have unique ids', () => {
    const ids = movements.map((m) => m.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it.each(['name', 'czechName', 'position', 'movement', 'principle'])('all have a %s', (key) => {
    const missing = movements.filter((m) => !isFilled(m[key])).map((m) => m.id)
    expect(missing).toEqual([])
  })

  it('all have at least one agonist', () => {
    const missing = movements.filter((m) => m.agonists.length === 0).map((m) => m.id)
    expect(missing).toEqual([])
  })

  it('only reference existing muscles, each in one role', () => {
    for (const movement of movements) {
      const all = ROLES.flatMap((role) => movement[role])
      expect(all.filter((id) => !muscleIds.has(id)), movement.id).toEqual([])
      expect(new Set(all).size, `${movement.id}: a muscle in two roles`).toBe(all.length)
    }
  })

  it('get a main region from their agonists, separate from the secondary regions', () => {
    for (const movement of movements) {
      expect(movement.mainRegions.length, movement.id).toBeGreaterThan(0)
      expect(movement.secondaryRegions.filter((r) => movement.mainRegions.includes(r)), movement.id).toEqual([])
    }
  })

  it('have a value for every single-answer question of the movement quiz', () => {
    for (const question of singleQuestions) {
      const missing = movements.filter((m) => !isFilled(m[question.key])).map((m) => m.id)
      expect(missing, question.key).toEqual([])
    }
  })
})

describe('movement quiz questions', () => {
  it('ask about existing roles and regions', () => {
    for (const question of roleQuestions) expect(ROLES).toContain(question.key)
    for (const question of regionQuestions) expect(['mainRegions', 'secondaryRegions']).toContain(question.key)
  })

  it('ask each role in a known way', () => {
    for (const question of roleQuestions) {
      expect(['recall', 'sort'], question.key).toContain(question.mode)
      if (question.mode === 'recall') expect(question.required, question.key).toBeGreaterThan(0)
    }
  })
})
