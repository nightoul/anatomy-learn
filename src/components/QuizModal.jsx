// The frame every quiz is shown in: a modal dialog with a close button.
// `dialogRef`, `close` and `onClose` come from useQuizDialog() (spread them in);
// `onCancel` lets the quiz handle Esc.
function QuizModal({ dialogRef, close, onClose, onCancel, children }) {
  return (
    <dialog ref={dialogRef} className="quiz-modal" onCancel={onCancel} onClose={onClose}>
      <button type="button" className="modal-close" aria-label="Close" onClick={close}>
        ×
      </button>
      {children}
    </dialog>
  )
}

// Shown instead of a quiz that has nothing to ask yet.
export function QuizEmpty({ children }) {
  return (
    <div className="quiz-empty">
      <p className="subtitle">{children}</p>
    </div>
  )
}

export default QuizModal
