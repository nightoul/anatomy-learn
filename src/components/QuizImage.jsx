// The picture of a quiz item, scaled to fit its cell. Without an image yet, a
// placeholder shows where the file is expected (`missingPath`).
function QuizImage({ src, alt, missingPath }) {
  return (
    <div className="image-cell">
      {src ? (
        <img src={src} alt={alt} className="quiz-image" />
      ) : (
        <div className="image-placeholder">
          Image coming
          <code>{missingPath}</code>
        </div>
      )}
    </div>
  )
}

export default QuizImage
