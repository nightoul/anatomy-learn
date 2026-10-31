import { useState } from 'react'
import MultiAnswerBox from '../components/MultiAnswerBox.jsx'
import QuestionChip from '../components/QuestionChip.jsx'
import QuizFooter from '../components/QuizFooter.jsx'
import QuizImage from '../components/QuizImage.jsx'
import QuizModal, { QuizEmpty } from '../components/QuizModal.jsx'
import Results from '../components/Results.jsx'
import { SortBox, SortPool } from '../components/SortingTask.jsx'
import { regionQuestions, roleQuestions, singleQuestions } from '../data/movementQuestions.js'
import { movements } from '../data/movements.js'
import { muscles } from '../data/muscles.js'
import { useQuizDialog } from '../hooks/useQuizDialog.js'
import { useQuizProgress } from '../hooks/useQuizProgress.js'
import { acceptedAnswers, isCorrect } from '../lib/answers.js'
import { shuffled } from '../lib/shuffle.js'

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

// The boxes of a movement (from movementQuestions.js), each with its answers;
// boxes without answers are left out. Roles are split into the ones recalled
// from memory and the ones sorted.
function boxesFor(movement) {
  const withAnswers = (question, toAnswer) => ({ ...question, answers: movement[question.key].map(toAnswer) })
  const hasAnswers = (box) => box.answers.length > 0
  const roleBoxes = roleQuestions.map((q) => withAnswers(q, muscleAnswer)).filter(hasAnswers)
  return {
    recallBoxes: roleBoxes.filter((box) => box.mode === 'recall'),
    sortBoxes: roleBoxes.filter((box) => box.mode === 'sort'),
    regionBoxes: regionQuestions.map((q) => withAnswers(q, regionAnswer)).filter(hasAnswers),
  }
}

const NO_BOXES = { recallBoxes: [], sortBoxes: [], regionBoxes: [] }

// The muscles of a movement's sort boxes, shuffled, each knowing its box.
function sortPoolFor(movement) {
  if (!movement) return []
  return shuffled(
    boxesFor(movement).sortBoxes.flatMap((box) =>
      box.answers.map((a) => ({ key: a.key, display: a.display, boxKey: box.key })),
    ),
  )
}

// A movement situation: name an agonist, sort the other muscles into their
// roles, and answer how the movement works.
function MovementQuiz() {
  const dialog = useQuizDialog()
  // Answers typed into the recall and region boxes, and muscles sorted into
  // the sort boxes — both keyed by box.
  const [found, setFound] = useState({})
  const [placed, setPlaced] = useState({})
  const [solved, setSolved] = useState({})
  // The sorting task: the shuffled muscles, the one tapped, and feedback.
  const [sortPool, setSortPool] = useState(() => sortPoolFor(movements[0]))
  const [selected, setSelected] = useState(null)
  const [wrongBox, setWrongBox] = useState(null)
  const [sortMessage, setSortMessage] = useState('')
  const quiz = useQuizProgress(movements.length, (i) => {
    setFound({})
    setPlaced({})
    setSolved({})
    setSortPool(sortPoolFor(movements[i]))
    setSelected(null)
    setSortMessage('')
  })

  const movement = movements[quiz.index]
  const { recallBoxes, sortBoxes, regionBoxes } = movement ? boxesFor(movement) : NO_BOXES
  const typedBoxes = [...recallBoxes, ...regionBoxes]
  const countIn = (state, box) => (state[box.key] ?? []).length
  const allSolved =
    Boolean(movement) &&
    singleQuestions.every((q) => solved[q.key]) &&
    typedBoxes.every((box) => countIn(found, box) >= Math.min(box.required ?? Infinity, box.answers.length)) &&
    sortBoxes.every((box) => countIn(placed, box) === box.answers.length)

  // An answer typed into the wrong box: the hint of the role or region it belongs to.
  function hintFor(boxKey, text) {
    const other = [...recallBoxes, ...sortBoxes, ...regionBoxes].find(
      (box) => box.key !== boxKey && box.answers.some((a) => isCorrect(text, a.accepted)),
    )
    return other?.hint ?? ''
  }

  const unsorted = sortPool.filter((item) => !(placed[item.boxKey] ?? []).includes(item.key))

  // A muscle tapped onto or dropped on a sort box: place it, or shake if it's wrong.
  function place(item, box) {
    if (!item) return
    if (item.boxKey === box.key) {
      setPlaced((p) => ({ ...p, [box.key]: [...(p[box.key] ?? []), item.key] }))
      setSelected(null)
      setSortMessage('')
    } else {
      setSelected(item)
      setWrongBox(box.key)
      setSortMessage(`${item.display} isn't one of the ${box.label.toLowerCase()} here.`)
    }
  }

  function renderTypedBox(box) {
    return (
      <MultiAnswerBox
        key={`${quiz.round}-${box.key}`}
        label={box.label}
        answers={box.answers}
        required={box.required}
        found={found[box.key] ?? []}
        onFound={(key) => setFound((f) => ({ ...f, [box.key]: [...(f[box.key] ?? []), key] }))}
        hintFor={(text) => hintFor(box.key, text)}
      />
    )
  }

  return (
    <QuizModal {...dialog} onCancel={quiz.handleCancel}>
      {movements.length === 0 ? (
        <QuizEmpty>No movements yet — add some to src/data/movements.js.</QuizEmpty>
      ) : quiz.finished ? (
        <Results
          correct={quiz.correctCount}
          total={movements.length}
          unit="movements"
          onRestart={quiz.restart}
          onClose={dialog.close}
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

            <div className="movement-column">
              {recallBoxes.map(renderTypedBox)}
              {sortBoxes.map((box) => (
                <SortBox
                  key={box.key}
                  box={box}
                  placed={placed[box.key] ?? []}
                  armed={Boolean(selected)}
                  wrong={wrongBox === box.key}
                  onTap={() => place(selected, box)}
                  onDrop={(key) => place(unsorted.find((item) => item.key === key), box)}
                  onShakeEnd={() => setWrongBox(null)}
                />
              ))}
            </div>

            <div className="movement-center">
              <SortPool
                items={unsorted}
                selected={selected}
                onSelect={(item) => {
                  setSelected(item)
                  setSortMessage('')
                }}
                message={sortMessage}
              />
              <QuizImage
                src={movement.image}
                alt="Movement"
                missingPath={`src/assets/movements/${movement.imageFile}`}
              />
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
                {singleQuestions.map((question) => (
                  <QuestionChip
                    key={`${quiz.round}-${question.key}`}
                    question={question}
                    value={movement[question.key]}
                    solved={Boolean(solved[question.key])}
                    open={quiz.openKey === question.key}
                    onOpen={() => quiz.setOpenKey(question.key)}
                    onClose={() => quiz.setOpenKey((k) => (k === question.key ? null : k))}
                    onSolved={() => {
                      setSolved((s) => ({ ...s, [question.key]: true }))
                      quiz.setOpenKey(null)
                    }}
                  />
                ))}
              </div>
              {regionBoxes.map(renderTypedBox)}
            </div>
          </div>
          <QuizFooter quiz={quiz} allSolved={allSolved} />
        </>
      )}
    </QuizModal>
  )
}

export default MovementQuiz
