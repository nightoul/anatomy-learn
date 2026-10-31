import MovementQuiz from './MovementQuiz.jsx'
import MuscleQuiz from './MuscleQuiz.jsx'

// All quizzes, in the order shown on the homepage. `id` is the quiz's address
// (#/quiz/<id>); a quiz without a `component` shows a "coming soon" page.
export const quizzes = [
  {
    id: 'muscles',
    title: 'Muscle properties',
    description: 'See a muscle and name it, its shape, region, depth and more.',
    component: MuscleQuiz,
  },
  {
    id: 'movements',
    title: 'Movements',
    description: 'See a movement and name the muscles behind it and how they work.',
    component: MovementQuiz,
  },
  { id: 'quiz-3', title: 'Quiz 3', description: 'Placeholder description' },
  { id: 'quiz-4', title: 'Quiz 4', description: 'Placeholder description' },
  { id: 'quiz-5', title: 'Quiz 5', description: 'Placeholder description' },
]
