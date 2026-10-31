import { afterEach, describe, expect, it, vi } from 'vitest'
import { byFileName, checkEntries } from '../src/data/dataHelpers.js'

describe('byFileName', () => {
  it('keys image URLs by their file name', () => {
    const glob = { '../assets/muscles/PsoasMajor.png': '/assets/PsoasMajor-abc.png' }
    expect(byFileName(glob)).toEqual({ 'PsoasMajor.png': '/assets/PsoasMajor-abc.png' })
  })
})

describe('checkEntries', () => {
  const RED = ['red']
  const BLUE = ['blue']
  const check = (entries, imageUrls = {}) =>
    checkEntries({ file: 'test.js', entries, allowed: { colour: [RED, BLUE] }, imageUrls, folder: 'img' })

  afterEach(() => vi.restoreAllMocks())

  it('accepts valid entries', () => {
    expect(() => check([{ id: 'a', colour: RED }, { id: 'b', colour: BLUE }])).not.toThrow()
  })

  it('reports a duplicate id', () => {
    expect(() => check([{ id: 'a', colour: RED }, { id: 'a', colour: BLUE }])).toThrow('duplicate id "a"')
  })

  it('reports a value that is not one of the allowed ones', () => {
    // A look-alike list with the same text is still a typo: values must be the shared constants.
    expect(() => check([{ id: 'a', colour: ['red'] }])).toThrow('"a" has an unknown colour')
  })

  it('warns about image files no entry uses', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    check([{ id: 'a', colour: RED, image: 'A.png' }], { 'A.png': '/a.png', 'Typo.png': '/t.png' })
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toContain('img/Typo.png')
  })
})
