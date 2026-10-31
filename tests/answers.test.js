import { describe, expect, it } from 'vitest'
import {
  DEEP,
  INTERMEDIATE,
  NOT_PALPABLE,
  PALPABLE,
  SUPERFICIAL,
  TIGHTNESS_PRONE,
  WEAKNESS_PRONE,
} from '../src/data/answerValues.js'
import { acceptedAnswers, isCorrect, normalize } from '../src/lib/answers.js'

describe('acceptedAnswers', () => {
  it('wraps a single answer in a list', () => {
    expect(acceptedAnswers('bránice')).toEqual(['bránice'])
  })

  it('keeps a list of answers as it is', () => {
    expect(acceptedAnswers(['a', 'b'])).toEqual(['a', 'b'])
  })
})

describe('normalize', () => {
  it('ignores case, diacritics and extra whitespace', () => {
    expect(normalize('  Velký   BEDERNÍ ')).toBe('velky bederni')
  })

  it('drops the optional words anywhere in the answer', () => {
    expect(normalize('musculus psoas major')).toBe('psoas major')
    expect(normalize('m. psoas major')).toBe('psoas major')
    expect(normalize('musculi intercostales')).toBe('intercostales')
    expect(normalize('sval bederní velký')).toBe('bederni velky')
    expect(normalize('mezižeberní svaly')).toBe('mezizeberni')
  })
})

describe('isCorrect', () => {
  const psoasCzech = ['velký bederní sval', 'sval bederní velký']

  it('accepts any accepted form', () => {
    expect(isCorrect('velký bederní sval', psoasCzech)).toBe(true)
    expect(isCorrect('sval bederní velký', psoasCzech)).toBe(true)
  })

  it('accepts answers without diacritics, optional words or with odd case and spacing', () => {
    expect(isCorrect('velky bederni', psoasCzech)).toBe(true)
    expect(isCorrect('VELKÝ BEDERNÍ SVAL', psoasCzech)).toBe(true)
    expect(isCorrect('M. Psoas  Major', 'musculus psoas major')).toBe(true)
    expect(isCorrect('psoas major', 'musculus psoas major')).toBe(true)
  })

  it('rejects incomplete or wrong answers', () => {
    expect(isCorrect('velky', psoasCzech)).toBe(false)
    expect(isCorrect('psoas', 'musculus psoas major')).toBe(false)
    expect(isCorrect('psoas minor', 'musculus psoas major')).toBe(false)
  })

  it('rejects empty answers and answers made only of optional words', () => {
    expect(isCorrect('', psoasCzech)).toBe(false)
    expect(isCorrect('   ', psoasCzech)).toBe(false)
    expect(isCorrect('sval', psoasCzech)).toBe(false)
    expect(isCorrect('musculus', 'musculus psoas major')).toBe(false)
  })

  it('accepts the short forms of fixed values', () => {
    expect(isCorrect('s', SUPERFICIAL)).toBe(true)
    expect(isCorrect('im', INTERMEDIATE)).toBe(true)
    expect(isCorrect('d', DEEP)).toBe(true)
    expect(isCorrect('y', PALPABLE)).toBe(true)
    expect(isCorrect('n', NOT_PALPABLE)).toBe(true)
    expect(isCorrect('tight', TIGHTNESS_PRONE)).toBe(true)
    expect(isCorrect('weak', WEAKNESS_PRONE)).toBe(true)
  })

  it("doesn't mix up the short forms", () => {
    expect(isCorrect('i', INTERMEDIATE)).toBe(false)
    expect(isCorrect('d', INTERMEDIATE)).toBe(false)
    expect(isCorrect('s', DEEP)).toBe(false)
    expect(isCorrect('n', PALPABLE)).toBe(false)
    expect(isCorrect('weak', TIGHTNESS_PRONE)).toBe(false)
  })
})
