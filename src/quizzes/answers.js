export function acceptedAnswers(value) {
  return Array.isArray(value) ? value : [value]
}

// Words that are optional anywhere in an answer: "velký bederní" is as good as
// "velký bederní sval", and "psoas major" as "musculus psoas major".
const OPTIONAL_WORDS = new Set(['sval', 'svaly', 'musculus', 'musculi', 'm.', 'mm.'])

// Case, diacritics, extra whitespace and the optional words don't matter:
// "velky bederni" is as good as "velký bederní".
function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word && !OPTIONAL_WORDS.has(word))
    .join(' ')
}

export function isCorrect(input, value) {
  const answer = normalize(input)
  return answer !== '' && acceptedAnswers(value).some((v) => normalize(v) === answer)
}
