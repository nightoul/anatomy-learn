import { useState } from 'react'

// Moving through a quiz of `count` items: the current item, NEXT / SKIP /
// FINISH, the score and "Play again". `onLoad(index)` runs whenever an item is
// shown, so the quiz can reset its own per-item state (answers, layout, …).
// Also tracks which single-answer question is open, so Esc can close it first.
export function useQuizProgress(count, onLoad) {
  const [index, setIndex] = useState(0)
  // Bumped on every new item so its question components start fresh.
  const [round, setRound] = useState(0)
  const [finished, setFinished] = useState(false)
  // Items with every question answered; skipped ones don't count.
  const [correctCount, setCorrectCount] = useState(0)
  const [openKey, setOpenKey] = useState(null)

  const isLast = index === count - 1

  function load(i) {
    setIndex(i)
    setRound((r) => r + 1)
    setOpenKey(null)
    setFinished(false)
    onLoad?.(i)
  }

  function advance() {
    if (isLast) setFinished(true)
    else load(index + 1)
  }

  return {
    index,
    round,
    finished,
    correctCount,
    isLast,
    openKey,
    setOpenKey,
    restart() {
      setCorrectCount(0)
      load(0)
    },
    skip: advance,
    next() {
      setCorrectCount((c) => c + 1)
      advance()
    },
    // For the dialog's onCancel: Esc closes an open question first, and only
    // then the whole modal.
    handleCancel(event) {
      if (openKey) {
        event.preventDefault()
        setOpenKey(null)
      }
    },
  }
}
