import { useState } from 'react'
import QuestionChip from '../components/QuestionChip.jsx'
import QuizFooter from '../components/QuizFooter.jsx'
import QuizImage from '../components/QuizImage.jsx'
import QuizModal, { QuizEmpty } from '../components/QuizModal.jsx'
import Results from '../components/Results.jsx'
import { questionsFor } from '../data/muscleQuestions.js'
import { muscles } from '../data/muscles.js'
import { useQuizDialog } from '../hooks/useQuizDialog.js'
import { useQuizProgress } from '../hooks/useQuizProgress.js'
import { randomLayout } from '../lib/randomLayout.js'

// Only muscles with an image are quizzed; each gets the questions it has answers for.
const quizMuscles = muscles.filter((m) => m.image && questionsFor(m).length > 0)

// A muscle picture with its questions scattered around it.
function MuscleQuiz() {
  const dialog = useQuizDialog()
  const [layout, setLayout] = useState(() =>
    quizMuscles.length > 0 ? randomLayout(questionsFor(quizMuscles[0])) : [],
  )
  const [solved, setSolved] = useState({})
  const quiz = useQuizProgress(quizMuscles.length, (i) => {
    setLayout(randomLayout(questionsFor(quizMuscles[i])))
    setSolved({})
  })

  const muscle = quizMuscles[quiz.index]
  const allSolved = Boolean(muscle) && questionsFor(muscle).every((q) => solved[q.key])

  function renderChips(side) {
    return layout
      .filter((item) => item.side === side)
      .map(({ question, x, y }) => (
        <QuestionChip
          key={`${quiz.round}-${question.key}`}
          question={question}
          value={muscle[question.key]}
          solved={Boolean(solved[question.key])}
          open={quiz.openKey === question.key}
          onOpen={() => quiz.setOpenKey(question.key)}
          onClose={() => quiz.setOpenKey((k) => (k === question.key ? null : k))}
          onSolved={() => {
            setSolved((s) => ({ ...s, [question.key]: true }))
            quiz.setOpenKey(null)
          }}
          style={{ '--x': x, '--y': y }}
        />
      ))
  }

  return (
    <QuizModal {...dialog} onCancel={quiz.handleCancel}>
      {quizMuscles.length === 0 ? (
        <QuizEmpty>No muscles with images yet — add some to src/assets/muscles.</QuizEmpty>
      ) : quiz.finished ? (
        <Results
          correct={quiz.correctCount}
          total={quizMuscles.length}
          unit="muscles"
          onRestart={quiz.restart}
          onClose={dialog.close}
        />
      ) : (
        <>
          <div className="muscle-body">
            <div className="question-column left">{renderChips('left')}</div>
            <QuizImage src={muscle.image} alt="Muscle to identify" />
            <div className="question-column right">{renderChips('right')}</div>
          </div>
          <QuizFooter quiz={quiz} allSolved={allSolved} />
        </>
      )}
    </QuizModal>
  )
}

export default MuscleQuiz
