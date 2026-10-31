// SKIP (until everything is answered) and NEXT / FINISH, bottom right of the modal.
// `quiz` comes from useQuizProgress().
function QuizFooter({ quiz, allSolved }) {
  return (
    <div className="modal-footer">
      {!allSolved && (
        <button type="button" className="secondary-button" onClick={quiz.skip}>
          SKIP
        </button>
      )}
      <button type="button" className="next-button" onClick={quiz.next} disabled={!allSolved}>
        {quiz.isLast ? 'FINISH' : 'NEXT →'}
      </button>
    </div>
  )
}

export default QuizFooter
