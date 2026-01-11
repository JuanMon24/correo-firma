import { useState } from 'react'

const useClipboard = () => {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = async (content) => {
    try {
      const blob = new Blob([content], { type: 'text/html' })
      const clipboardItem = new ClipboardItem({ 'text/html': blob })
      await navigator.clipboard.write([clipboardItem])
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000) // Reset the state after 2 seconds
    } catch (err) {
      console.error('Error al copiar el contenido: ', err)
      setIsCopied(false)
    }
  }

  return { isCopied, copyToClipboard }
}

export default useClipboard