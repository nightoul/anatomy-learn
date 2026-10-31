import { useState } from 'react'
import { acceptedAnswers, isCorrect } from '../lib/answers.js'

function QuestionChip({ question, value, solved, open, onOpen, onClose, onSolved, style }) {
  const [draft, setDraft] = useState('')
  const [shake, setShake] = useState(false)

  if (solved) {
    return (
      <div className="question-chip solved" style={style}>
        <span className="check" aria-hidden="true">
          ✓
        </span>
        <span>
          <span className="chip-label">{question.label}</span>
          <span className="chip-answer">{acceptedAnswers(value)[0]}</span>
        </span>
      </div>
    )
  }

  if (!open) {
    return (
      <button type="button" className="question-chip" style={style} onClick={onOpen}>
        {question.label}
      </button>
    )
  }

  function handleChange(event) {
    const text = event.target.value
    setDraft(text)
    if (isCorrect(text, value)) onSolved()
  }

  function handleSubmit(event) {
    event.preventDefault()
    setShake(true)
  }

  return (
    <form
      className={`question-chip open${shake ? ' shake' : ''}`}
      style={style}
      onSubmit={handleSubmit}
      onAnimationEnd={() => setShake(false)}
    >
      <label className="chip-label" htmlFor={`answer-${question.key}`}>
        {question.label}
      </label>
      <input
        id={`answer-${question.key}`}
        className="text-input"
        value={draft}
        onChange={handleChange}
        onBlur={onClose}
        autoFocus
        autoComplete="off"
        spellCheck="false"
      />
    </form>
  )
}

export default QuestionChip
