import { Link, useParams } from 'react-router'
import { quizzes } from '../quizzes.js'
import MuscleQuiz from '../quizzes/MuscleQuiz.jsx'

// Quizzes that have been implemented; the rest show a "coming soon" placeholder.
const quizComponents = {
  'quiz-1': MuscleQuiz,
}

function Quiz() {
  const { quizId } = useParams()
  const quiz = quizzes.find((q) => q.id === quizId)
  const QuizComponent = quizComponents[quizId]

  return (
    <main>
      <Link to="/" className="back-link">
        ← All quizzes
      </Link>
      <h1>{quiz ? quiz.title : 'Quiz not found'}</h1>
      {QuizComponent ? (
        <QuizComponent />
      ) : (
        <p className="subtitle">{quiz ? 'Coming soon.' : 'This quiz does not exist.'}</p>
      )}
    </main>
  )
}

export default Quiz
