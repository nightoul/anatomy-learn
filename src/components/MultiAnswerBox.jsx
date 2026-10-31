import { useEffect, useState } from 'react'
import { isCorrect, normalize } from '../lib/answers.js'

// Waiting time before accepting an answer that could still grow into a longer
// accepted one (e.g. "obliquus externus" → "obliquus externus abdominis").
const ACCEPT_DELAY_MS = 700

// A question with several correct answers (e.g. the agonists of a movement).
// Each answer is { key, accepted, display }. A correct answer is accepted as it
// is typed, like in the muscle quiz; Enter on a wrong one shakes the box and
// shows `hintFor(text)` (e.g. "that one is an antagonist").
// With `required` set, that many answers complete the box and the rest are revealed.
function MultiAnswerBox({ label, answers, found, onFound, hintFor, required = answers.length }) {
  const [draft, setDraft] = useState('')
  const [shake, setShake] = useState(false)
  const [hint, setHint] = useState('')

  const needed = Math.min(required, answers.length)
  const complete = found.length >= needed
  const partial = needed < answers.length

  // The not-yet-found answer the text matches, and whether the text could still
  // grow into a longer accepted answer.
  function check(text) {
    const remaining = answers.filter((a) => !found.includes(a.key))
    const typed = normalize(text)
    return {
      match: remaining.find((a) => isCorrect(text, a.accepted)),
      couldGrow:
        typed !== '' && remaining.some((a) => a.accepted.some((v) => normalize(v).startsWith(`${typed} `))),
    }
  }
  const { match, couldGrow } = check(draft)

  function accept(answer) {
    onFound(answer.key)
    setDraft('')
    setHint('')
  }

  // Accept a match right away, or after a short pause if it could still grow.
  useEffect(() => {
    if (!match || !couldGrow) return
    const timer = setTimeout(() => accept(match), ACCEPT_DELAY_MS)
    return () => clearTimeout(timer)
  })

  function handleChange(event) {
    const text = event.target.value
    setDraft(text)
    const now = check(text)
    if (now.match && !now.couldGrow) accept(now.match)
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!draft.trim()) return
    if (match) {
      accept(match)
      return
    }
    const alreadyFound = answers.some((a) => found.includes(a.key) && isCorrect(draft, a.accepted))
    setHint(alreadyFound ? 'Already found.' : (hintFor?.(draft) ?? ''))
    setShake(true)
  }

  // Found answers first; once complete, the ones not named are shown as revealed.
  const shown = complete
    ? [...answers.filter((a) => found.includes(a.key)), ...answers.filter((a) => !found.includes(a.key))]
    : answers.filter((a) => found.includes(a.key))

  return (
    <section className={`answer-box${complete ? ' complete' : ''}`}>
      <header className="answer-box-header">
        <span className="answer-box-label">
          {label}
          {partial && !complete && <span className="answer-box-note"> · name {needed}</span>}
        </span>
        <span className="answer-box-count">
          {complete && <span aria-hidden="true">✓ </span>}
          {partial ? `${Math.min(found.length, needed)} / ${needed}` : `${found.length} / ${answers.length}`}
        </span>
      </header>
      {shown.length > 0 && (
        <ul className="answer-box-found">
          {shown.map((a) => (
            <li key={a.key} className={found.includes(a.key) ? undefined : 'revealed'}>
              {a.display}
            </li>
          ))}
        </ul>
      )}
      {!complete && (
        <form
          className={shake ? 'shake' : undefined}
          onSubmit={handleSubmit}
          onAnimationEnd={() => setShake(false)}
        >
          <input
            className="text-input"
            aria-label={label}
            value={draft}
            onChange={handleChange}
            placeholder="Type here"
            autoComplete="off"
            spellCheck="false"
          />
          {hint && <p className="answer-box-hint">{hint}</p>}
        </form>
      )}
    </section>
  )
}

export default MultiAnswerBox
