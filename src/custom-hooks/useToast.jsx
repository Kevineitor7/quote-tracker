import { useState } from "react"

export function useToast() {
  const [toasts, setToasts] = useState([])

  function add(type) {
    const toastId = crypto.randomUUID()
    setToasts(prev => [...prev, { 
      id: toastId,
      type: type,
      message: type === 'quote-addition' ? "Quote added successfully" :
        type === 'quote-removal' ? "Quote removed successfully" :
        type === 'quote-edit' ? "Quote edited successfully" :
        type === 'request-quote-form' ? "Quote requested successfully" :
        "Fill the form dude"
    }])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId))
    }, 4000)
  }

  function remove(id) {
      setToasts(prev => prev.filter(t => t.id !== id))
  }

  return { toasts, add, remove }
}