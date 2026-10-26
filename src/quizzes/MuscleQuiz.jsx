import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { muscles } from '../data/muscles.js'
import { answerFor, questionsFor } from '../data/questions.js'
import { randomLayout } from './layout.js'
import QuestionChip from './QuestionChip.jsx'

// Only muscles with an image are quizzed; each gets the questions it has answers for.
const quizMuscles = muscles.filter((m) => m.image && questionsFor(m).length > 0)

// Results screen by score: over 90 % / 60–90 % / under 60 %.
function resultFor(correct, total) {
  const ratio = correct / total
  if (ratio > 0.9) {
    return { tier: 'great', icon: '✓', title: 'Well done!', message: 'You know your muscles.' }
  }
  if (ratio >= 0.6) {
    return {
      tier: 'good',
      icon: '★',
      title: 'Good job!',
      message: "Almost there. A few more rounds and you'll have them all.",
    }
  }
  return {
    tier: 'practice',
    icon: '↻',
    title: 'Keep practicing',
    message: 'Every round helps. Try again and the names will start to stick.',
  }
}

function MuscleQuiz() {
  const dialogRef = useRef(null)
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  // Bumped on every new muscle so the question chips start fresh.
  const [round, setRound] = useState(0)
  const [layout, setLayout] = useState([])
  const [solved, setSolved] = useState({})
  const [openKey, setOpenKey] = useState(null)
  const [finished, setFinished] = useState(false)
  // Muscles with every question answered; skipped ones don't count.
  const [correctCount, setCorrectCount] = useState(0)

  const muscle = quizMuscles[index]
  const allSolved = Boolean(muscle) && questionsFor(muscle).every((q) => solved[q.key])
  const isLast = index === quizMuscles.length - 1
  const result = resultFor(correctCount, quizMuscles.length)

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

  function start() {
    restart()
    dialogRef.current.showModal()
  }

  function advance() {
    if (isLast) setFinished(true)
    else load(index + 1)
  }

  function next() {
    setCorrectCount((c) => c + 1)
    advance()
  }

  function backToQuizzes() {
    dialogRef.current.close()
    navigate('/')
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
          value={answerFor(muscle, question)}
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

  if (quizMuscles.length === 0) {
    return <p className="subtitle">No muscles with images yet — add some to src/assets/muscles.</p>
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
        {finished ? (
          <div className={`congrats ${result.tier}`}>
            <span className="congrats-check" aria-hidden="true">
              {result.icon}
            </span>
            <h2>{result.title}</h2>
            <p className="score">
              <strong>{correctCount}</strong> / {quizMuscles.length}
            </p>
            <p className="subtitle">
              You got {correctCount} of {quizMuscles.length} muscles right. {result.message}
            </p>
            <div className="congrats-actions">
              <button type="button" className="next-button" onClick={restart}>
                Play again
              </button>
              <button type="button" className="secondary-button" onClick={backToQuizzes}>
                Back to quizzes
              </button>
            </div>
          </div>
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
    </>
  )
}

export default MuscleQuiz
