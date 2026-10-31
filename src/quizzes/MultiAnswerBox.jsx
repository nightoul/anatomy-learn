import { useState } from 'react'
import { isCorrect } from './answers.js'

// A question with several correct answers (e.g. the agonists of a movement).
// Each answer is { key, accepted, display }. Typing one and pressing Enter adds
// it; `hintFor(text)` can explain a wrong answer (e.g. "that one is an antagonist").
function MultiAnswerBox({ label, answers, found, onFound, hintFor }) {
  const [draft, setDraft] = useState('')
  const [shake, setShake] = useState(false)
  const [hint, setHint] = useState('')

  const complete = answers.every((a) => found.includes(a.key))

  function handleSubmit(event) {
    event.preventDefault()
    if (!draft.trim()) return
    const match = answers.find((a) => !found.includes(a.key) && isCorrect(draft, a.accepted))
    if (match) {
      onFound(match.key)
      setDraft('')
      setHint('')
      return
    }
    const alreadyFound = answers.some((a) => found.includes(a.key) && isCorrect(draft, a.accepted))
    setHint(alreadyFound ? 'Already found.' : (hintFor?.(draft) ?? ''))
    setShake(true)
  }

  return (
    <section className={`answer-box${complete ? ' complete' : ''}`}>
      <header className="answer-box-header">
        <span className="answer-box-label">{label}</span>
        <span className="answer-box-count">
          {complete && <span aria-hidden="true">✓ </span>}
          {found.length} / {answers.length}
        </span>
      </header>
      {found.length > 0 && (
        <ul className="answer-box-found">
          {answers
            .filter((a) => found.includes(a.key))
            .map((a) => (
              <li key={a.key}>{a.display}</li>
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
            className="chip-input"
            aria-label={label}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type and press Enter"
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
