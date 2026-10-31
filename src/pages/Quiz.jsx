import { Link, useParams } from 'react-router'
import { quizzes } from '../quizzes/index.js'
import Home from './Home.jsx'

function Quiz() {
  const { quizId } = useParams()
  const quiz = quizzes.find((q) => q.id === quizId)

  // An implemented quiz opens straight away as a modal over the homepage.
  if (quiz?.component) {
    const QuizComponent = quiz.component
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
