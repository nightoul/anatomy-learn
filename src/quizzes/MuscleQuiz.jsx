import { useRef, useState } from 'react'
import { muscles } from '../data/muscles.js'
import { questions } from '../data/questions.js'
import { randomLayout } from './layout.js'
import QuestionChip from './QuestionChip.jsx'

// Only muscles with an image and an answer to every question are quizzed.
const quizMuscles = muscles.filter((m) => m.image && questions.every((q) => m[q.key]))

function MuscleQuiz() {
  const dialogRef = useRef(null)
  const [index, setIndex] = useState(0)
  // Bumped on every new muscle so the question chips start fresh.
  const [round, setRound] = useState(0)
  const [layout, setLayout] = useState([])
  const [solved, setSolved] = useState({})
  const [openKey, setOpenKey] = useState(null)

  const muscle = quizMuscles[index]
  const allSolved = questions.every((q) => solved[q.key])

  function load(i) {
    setIndex(i)
    setRound((r) => r + 1)
    setLayout(randomLayout(questions))
    setSolved({})
    setOpenKey(null)
  }

  function start() {
    load(0)
    dialogRef.current.showModal()
  }

  function next() {
    load((index + 1) % quizMuscles.length)
  }

  function handleCancel(event) {
    // Esc closes an open question first, and only then the whole modal.
    if (openKey) {
      event.preventDefault()
      setOpenKey(null)
    }
  }

  function renderChips(side) {
    return layout
      .filter((item) => item.side === side)
      .map(({ question, x, y }) => (
        <QuestionChip
          key={`${round}-${question.key}`}
          question={question}
          value={muscle[question.key]}
          solved={Boolean(solved[question.key])}
          open={openKey === question.key}
          onOpen={() => setOpenKey(question.key)}
          onClose={() => setOpenKey((k) => (k === question.key ? null : k))}
          onSolved={() => {
            setSolved((s) => ({ ...s, [question.key]: true }))
            setOpenKey(null)
          }}
          style={{ '--x': x, '--y': y }}
        />
      ))
  }

  return (
    <>
      <div className="start-wrapper">
        <button type="button" className="start-button" onClick={start}>
          START
        </button>
      </div>

      <dialog ref={dialogRef} className="quiz-modal" onCancel={handleCancel}>
        <button
          type="button"
          className="modal-close"
          aria-label="Close"
          onClick={() => dialogRef.current.close()}
        >
          ×
        </button>
        <div className="modal-body">
          <div className="question-column left">{renderChips('left')}</div>
          <div className="image-cell">
            <img src={muscle.image} alt="Muscle to identify" className="muscle-image" />
          </div>
          <div className="question-column right">{renderChips('right')}</div>
        </div>
        <div className="modal-footer">
          <button type="button" className="next-button" onClick={next} disabled={!allSolved}>
            NEXT →
          </button>
        </div>
      </dialog>
    </>
  )
}

export default MuscleQuiz
