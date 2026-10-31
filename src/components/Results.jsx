// Results screen by score: over 90 % / 60–90 % / under 60 %.
function resultFor(correct, total) {
  const ratio = correct / total
  if (ratio > 0.9) {
    return { tier: 'great', icon: '✓', title: 'Well done!', message: 'You know them well.' }
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
    message: 'Every round helps. Try again and it will start to stick.',
  }
}

// `unit` is the plural noun being counted, e.g. "muscles" or "movements".
function Results({ correct, total, unit, onRestart, onClose }) {
  const result = resultFor(correct, total)
  return (
    <div className={`congrats ${result.tier}`}>
      <span className="congrats-check" aria-hidden="true">
        {result.icon}
      </span>
      <h2>{result.title}</h2>
      <p className="score">
        <strong>{correct}</strong> / {total}
      </p>
      <p className="subtitle">
        You got {correct} of {total} {unit} right. {result.message}
      </p>
      <div className="congrats-actions">
        <button type="button" className="next-button" onClick={onRestart}>
          Play again
        </button>
        <button type="button" className="secondary-button" onClick={onClose}>
          Back to quizzes
        </button>
      </div>
    </div>
  )
}

export default Results
