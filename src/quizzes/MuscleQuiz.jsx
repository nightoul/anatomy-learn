import { useState } from 'react'
import { muscles } from '../data/muscles.js'
import { questionsFor } from '../data/questions.js'
import { randomLayout } from './layout.js'
import QuestionChip from './QuestionChip.jsx'
import Results from './Results.jsx'
import { useQuizDialog } from './useQuizDialog.js'

// Only muscles with an image are quizzed; each gets the questions it has answers for.
const quizMuscles = muscles.filter((m) => m.image && questionsFor(m).length > 0)

function MuscleQuiz() {
  const { dialogRef, close, onClose } = useQuizDialog()
  const [index, setIndex] = useState(0)
  // Bumped on every new muscle so the question chips start fresh.
  const [round, setRound] = useState(0)
  const [layout, setLayout] = useState(() =>
    quizMuscles.length > 0 ? randomLayout(questionsFor(quizMuscles[0])) : [],
  )
  const [solved, setSolved] = useState({})
  const [openKey, setOpenKey] = useState(null)
  const [finished, setFinished] = useState(false)
  // Muscles with every question answered; skipped ones don't count.
  const [correctCount, setCorrectCount] = useState(0)

  const muscle = quizMuscles[index]
  const allSolved = Boolean(muscle) && questionsFor(muscle).every((q) => solved[q.key])
  const isLast = index === quizMuscles.length - 1

  function load(i) {
    setIndex(i)
    setRound((r) => r + 1)
    setLayout(randomLayout(questionsFor(quizMuscles[i])))
    setSolved({})
    setOpenKey(null)
    setFinished(false)
  }

  function restart() {
    setCorrectCount(0)
    load(0)
  }

  function advance() {
    if (isLast) setFinished(true)
    else load(index + 1)
  }

  function next() {
    setCorrectCount((c) => c + 1)
    advance()
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
    <dialog ref={dialogRef} className="quiz-modal" onCancel={handleCancel} onClose={onClose}>
      <button type="button" className="modal-close" aria-label="Close" onClick={close}>
        ×
      </button>
      {quizMuscles.length === 0 ? (
        <div className="congrats">
          <p className="subtitle">No muscles with images yet — add some to src/assets/muscles.</p>
        </div>
      ) : finished ? (
        <Results
          correct={correctCount}
          total={quizMuscles.length}
          unit="muscles"
          onRestart={restart}
          onClose={close}
        />
      ) : (
        <>
          <div className="modal-body">
            <div className="question-column left">{renderChips('left')}</div>
            <div className="image-cell">
              <img src={muscle.image} alt="Muscle to identify" className="muscle-image" />
            </div>
            <div className="question-column right">{renderChips('right')}</div>
          </div>
          <div className="modal-footer">
            {!allSolved && (
              <button type="button" className="secondary-button" onClick={advance}>
                SKIP
              </button>
            )}
            <button type="button" className="next-button" onClick={next} disabled={!allSolved}>
              {isLast ? 'FINISH' : 'NEXT →'}
            </button>
          </div>
        </>
      )}
    </dialog>
  )
}

export default MuscleQuiz
