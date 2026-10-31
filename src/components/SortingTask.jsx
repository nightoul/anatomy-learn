import { useState } from 'react'

// Sorting muscles into boxes: drag a muscle onto its box, or tap the muscle and
// then the box (drag and drop doesn't work on most touch screens). The pool and
// the boxes are separate components so they can sit in different places on the
// screen; the quiz keeps the shared state.

const DRAG_TYPE = 'text/plain'

// `items` are { key, display, boxKey } still to be sorted; `selected` is one of them.
export function SortPool({ items, selected, onSelect, message }) {
  if (items.length === 0) return null
  return (
    <div className="sort-pool">
      <p className="sort-instructions">
        {selected
          ? 'Now drop it on (or tap) the box it belongs to.'
          : 'Sort these: drag each muscle onto its box, or tap it and then the box.'}
      </p>
      <div className="sort-chips">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            draggable
            className={`sort-chip${selected?.key === item.key ? ' selected' : ''}`}
            aria-pressed={selected?.key === item.key}
            onClick={() => onSelect(selected?.key === item.key ? null : item)}
            onDragStart={(event) => {
              event.dataTransfer.setData(DRAG_TYPE, item.key)
              event.dataTransfer.effectAllowed = 'move'
              onSelect(item)
            }}
          >
            {item.display}
          </button>
        ))}
      </div>
      {message && <p className="answer-box-hint">{message}</p>}
    </div>
  )
}

// One target box. `placed` are the answer keys already sorted into it; `armed`
// means a muscle is selected or being dragged; `wrong` makes it shake.
// `onDrop` gets the key of the muscle dropped on it.
export function SortBox({ box, placed, armed, wrong, onTap, onDrop, onShakeEnd }) {
  const [dragOver, setDragOver] = useState(false)
  const done = placed.length
  const complete = done === box.answers.length
  return (
    <button
      type="button"
      className={`answer-box sort-target${complete ? ' complete' : ''}${armed ? ' armed' : ''}${
        wrong ? ' shake' : ''
      }${dragOver ? ' drag-over' : ''}`}
      aria-disabled={!armed}
      onClick={() => armed && onTap()}
      onDragOver={(event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(event) => {
        event.preventDefault()
        setDragOver(false)
        onDrop(event.dataTransfer.getData(DRAG_TYPE))
      }}
      onAnimationEnd={onShakeEnd}
    >
      <span className="answer-box-header">
        <span className="answer-box-label">{box.label}</span>
        <span className="answer-box-count">
          {complete && <span aria-hidden="true">✓ </span>}
          {done} / {box.answers.length}
        </span>
      </span>
      {done > 0 && (
        <span className="answer-box-found">
          {box.answers
            .filter((a) => placed.includes(a.key))
            .map((a) => (
              <span key={a.key} className="found-chip">
                {a.display}
              </span>
            ))}
        </span>
      )}
    </button>
  )
}
