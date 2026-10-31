import { Link } from 'react-router'
import { quizzes } from '../quizzes/index.js'

function Home() {
  return (
    <main>
      <header>
        <h1>The Body</h1>
      </header>

      <ul className="quiz-list">
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <Link to={`/quiz/${quiz.id}`} className="quiz-card">
              <span className="quiz-title">{quiz.title}</span>
              <span className="quiz-description">{quiz.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default Home
