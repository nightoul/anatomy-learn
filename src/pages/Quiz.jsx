import { Link, useParams } from 'react-router'
import { quizzes } from '../quizzes.js'
import MovementQuiz from '../quizzes/MovementQuiz.jsx'
import MuscleQuiz from '../quizzes/MuscleQuiz.jsx'
import Home from './Home.jsx'

// Quizzes that have been implemented; the rest show a "coming soon" placeholder.
const quizComponents = {
  'quiz-1': MuscleQuiz,
  'quiz-2': MovementQuiz,
}

function Quiz() {
  const { quizId } = useParams()
  const quiz = quizzes.find((q) => q.id === quizId)
  const QuizComponent = quizComponents[quizId]

  // An implemented quiz opens straight away as a modal over the homepage.
  if (QuizComponent) {
    return (
      <>
        <Home />
        <QuizComponent />
      </>
    )
  }

  return (
    <main>
      <Link to="/" className="back-link">
        ← All quizzes
      </Link>
      <h1>{quiz ? quiz.title : 'Quiz not found'}</h1>
      <p className="subtitle">{quiz ? 'Coming soon.' : 'This quiz does not exist.'}</p>
    </main>
  )
}

export default Quiz
