import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'

// A quiz modal that opens as soon as its page is shown; closing it (×, Esc or a
// button calling `close`) goes back to the homepage.
export function useQuizDialog() {
  const dialogRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
  }, [])

  return {
    dialogRef,
    close: () => dialogRef.current.close(),
    onClose: () => navigate('/'),
  }
}
