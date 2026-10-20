import { useRef, useState } from 'react'
import { muscles } from '../data/muscles.js'

function MuscleQuiz() {
  const dialogRef = useRef(null)
  const [index, setIndex] = useState(0)
  const muscle = muscles[index]

  function start() {
    setIndex(0)
    dialogRef.current.showModal()
  }

  function next() {
    setIndex((i) => (i + 1) % muscles.length)
  }

  return (
    <>
      <div className="start-wrapper">
        <button type="button" className="start-button" onClick={start}>
          START
        </button>
      </div>

      <dialog ref={dialogRef} className="quiz-modal">
        <button
          type="button"
          className="modal-close"
          aria-label="Close"
          onClick={() => dialogRef.current.close()}
        >
          ×
        </button>
        <div className="modal-body">
          <img src={muscle.image} alt="Muscle" className="muscle-image" />
        </div>
        <div className="modal-footer">
          <span className="progress">
            {index + 1} / {muscles.length}
          </span>
          <button type="button" className="next-button" onClick={next}>
            NEXT →
          </button>
        </div>
      </dialog>
    </>
  )
}

export default MuscleQuiz
