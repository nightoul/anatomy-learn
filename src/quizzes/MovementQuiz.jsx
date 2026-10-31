import { useState } from 'react'
import { ROLES, movements } from '../data/movements.js'
import { muscles } from '../data/muscles.js'
import { acceptedAnswers, isCorrect } from './answers.js'
import MultiAnswerBox from './MultiAnswerBox.jsx'
import QuestionChip from './QuestionChip.jsx'
import Results from './Results.jsx'
import { useQuizDialog } from './useQuizDialog.js'

const ROLE_LABELS = {
  agonists: 'Agonists',
  synergists: 'Synergists',
  antagonists: 'Antagonists',
  stabilizers: 'Stabilizers',
}
const ROLE_SINGULAR = {
  agonists: 'an agonist',
  synergists: 'a synergist',
  antagonists: 'an antagonist',
  stabilizers: 'a stabilizer',
}

// Questions with one answer, shown as chips like in the muscle quiz.
const SINGLE_QUESTIONS = [
  { key: 'contraction', label: 'Contraction' },
  { key: 'plane', label: 'Plane' },
  { key: 'chain', label: 'Chain' },
  { key: 'sides', label: 'Sides' },
  { key: 'gravity', label: 'Gravity' },
]

// A muscle as an answer: any of its Latin or Czech names, shown without "musculus".
const muscleById = Object.fromEntries(muscles.map((m) => [m.id, m]))
function muscleAnswer(id) {
  const m = muscleById[id]
  const latin = acceptedAnswers(m.latinName)
  return {
    key: id,
    accepted: [...latin, ...acceptedAnswers(m.czechName)],
    display: latin[0].replace(/^(musculus|musculi) /, ''),
  }
}

function regionAnswer(region) {
  return { key: region[0], accepted: region, display: region[0] }
}

// The multi-answer boxes of a movement: the four roles (empty ones left out)
// and the main and secondary regions.
function boxesFor(movement) {
  const roleBoxes = ROLES.filter((role) => movement[role].length > 0).map((role) => ({
    key: role,
    label: ROLE_LABELS[role],
    answers: movement[role].map(muscleAnswer),
  }))
  const regionBoxes = [
    { key: 'mainRegions', label: 'Main region', answers: movement.mainRegions.map(regionAnswer) },
    { key: 'secondaryRegions', label: 'Secondary regions', answers: movement.secondaryRegions.map(regionAnswer) },
  ].filter((box) => box.answers.length > 0)
  return { roleBoxes, regionBoxes }
}

function MovementQuiz() {
  const { dialogRef, close, onClose } = useQuizDialog()
  const [index, setIndex] = useState(0)
  // Bumped on every new movement so the boxes and chips start fresh.
  const [round, setRound] = useState(0)
  const [found, setFound] = useState({})
  const [solved, setSolved] = useState({})
  const [openKey, setOpenKey] = useState(null)
  const [finished, setFinished] = useState(false)
  // Movements with every question answered; skipped ones don't count.
  const [correctCount, setCorrectCount] = useState(0)

  const movement = movements[index]
  const { roleBoxes, regionBoxes } = movement ? boxesFor(movement) : { roleBoxes: [], regionBoxes: [] }
  const allBoxes = [...roleBoxes, ...regionBoxes]
  const allSolved =
    Boolean(movement) &&
    SINGLE_QUESTIONS.every((q) => solved[q.key]) &&
    allBoxes.every((box) => box.answers.every((a) => (found[box.key] ?? []).includes(a.key)))
  const isLast = index === movements.length - 1

  function load(i) {
    setIndex(i)
    setRound((r) => r + 1)
    setFound({})
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

  // Explains a muscle typed into the wrong role box.
  function roleHint(boxKey, text) {
    const otherRole = ROLES.find(
      (role) => role !== boxKey && movement[role].some((id) => isCorrect(text, muscleAnswer(id).accepted)),
    )
    return otherRole ? `That one is ${ROLE_SINGULAR[otherRole]} here.` : ''
  }

  // Explains a region typed into the other region box.
  function regionHint(boxKey, text) {
    const other = boxKey === 'mainRegions' ? movement.secondaryRegions : movement.mainRegions
    if (!other.some((region) => isCorrect(text, region))) return ''
    return boxKey === 'mainRegions' ? "That's a secondary region here." : "That's the main region here."
  }

  function renderBox(box, hintFor) {
    return (
      <MultiAnswerBox
        key={`${round}-${box.key}`}
        label={box.label}
        answers={box.answers}
        found={found[box.key] ?? []}
        onFound={(key) => setFound((f) => ({ ...f, [box.key]: [...(f[box.key] ?? []), key] }))}
        hintFor={(text) => hintFor(box.key, text)}
      />
    )
  }

  return (
    <dialog ref={dialogRef} className="quiz-modal" onCancel={handleCancel} onClose={onClose}>
      <button type="button" className="modal-close" aria-label="Close" onClick={close}>
        ×
      </button>
      {movements.length === 0 ? (
        <div className="congrats">
          <p className="subtitle">No movements yet — add some to src/data/movements.js.</p>
        </div>
      ) : finished ? (
        <Results
          correct={correctCount}
          total={movements.length}
          unit="movements"
          onRestart={restart}
          onClose={close}
        />
      ) : (
        <>
          <div className="movement-body">
            <header className="movement-title">
              <h2>
                {acceptedAnswers(movement.name)[0]}
                <span className="movement-czech"> · {acceptedAnswers(movement.czechName)[0]}</span>
              </h2>
              <p className="subtitle">{movement.position}</p>
            </header>

            <div className="movement-column">{roleBoxes.map((box) => renderBox(box, roleHint))}</div>

            <div className="movement-center">
              <div className="image-cell">
                {movement.image ? (
                  <img src={movement.image} alt="Movement" className="muscle-image" />
                ) : (
                  <div className="image-placeholder">
                    Image coming
                    <code>src/assets/movements/{movement.imageFile}</code>
                  </div>
                )}
              </div>
              {allSolved && (
                <div className="movement-explanation">
                  <p>
                    <strong>Principle:</strong> {movement.principle}
                  </p>
                  {movement.notes && <p>{movement.notes}</p>}
                </div>
              )}
            </div>

            <div className="movement-column">
              <div className="single-questions">
                {SINGLE_QUESTIONS.map((question) => (
                  <QuestionChip
                    key={`${round}-${question.key}`}
                    question={question}
                    value={movement[question.key]}
                    solved={Boolean(solved[question.key])}
                    open={openKey === question.key}
                    onOpen={() => setOpenKey(question.key)}
                    onClose={() => setOpenKey((k) => (k === question.key ? null : k))}
                    onSolved={() => {
                      setSolved((s) => ({ ...s, [question.key]: true }))
                      setOpenKey(null)
                    }}
                  />
                ))}
              </div>
              {regionBoxes.map((box) => renderBox(box, regionHint))}
            </div>
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

export default MovementQuiz
