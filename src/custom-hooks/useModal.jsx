import { useState } from "react"

export function useModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState(null)

  function open(payload = null) {
    setData(payload)
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  return { isOpen, data, open, close }
}