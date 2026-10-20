import { HashRouter, Route, Routes } from 'react-router'
import Home from './pages/Home.jsx'
import Quiz from './pages/Quiz.jsx'

// HashRouter keeps routes working on GitHub Pages, which has no SPA fallback.
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz/:quizId" element={<Quiz />} />
      </Routes>
    </HashRouter>
  )
}

export default App
