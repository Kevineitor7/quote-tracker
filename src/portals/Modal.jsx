import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

export function Modal({ isOpen, onClose, children }) {
  const [shouldRender, setShouldRender] = useState(isOpen)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional two-step mount:
      // shouldRender must flip before isVisible so the browser paints a "hidden" frame first
      setShouldRender(true)
      requestAnimationFrame(() => setIsVisible(true))
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- starts the fade-out
      // immediately; the actual unmount is deliberately delayed via the timeout below
      setIsVisible(false)
      const timeout = setTimeout(() => setShouldRender(false), 200)
      return () => clearTimeout(timeout)
    }
  }, [isOpen])

  if (!shouldRender) return null

  return createPortal(
    <div 
      className={`fixed inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200 
      ${isVisible ? 'opacity-100' : 'opacity-0'}`} 
      onClick={onClose}>
      <div 
        className={`bg-white rounded-lg p-6 text-center transition-all duration-200
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-15'}`} 
        onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  )
}