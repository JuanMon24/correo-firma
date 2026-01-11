import React, { useState, useEffect } from 'react'

const Typewriter = ({ config }) => {
  const {
    textArray,
    speed= 100,
    scrollAt= 20,
    style,
    ...props
  } = config
  const [displayText, setDisplayText] = useState([])
  const [iIndex, setIIndex] = useState(0)
  const [iTextPos, setITextPos] = useState(0)
  const [iArrLength, setIArrLength] = useState(textArray[0].length)
  const [isTypingComplete, setIsTypingComplete] = useState(false)

  useEffect(() => {
    const typewriter = () => {
      let sContents = [...displayText] // Copia el contenido actual
      let currentText = textArray[iIndex].substring(0, iTextPos)

      // Si la escritura no está completa, añade el cursor solo a la palabra actual
      if (!isTypingComplete && iTextPos < iArrLength) {
        currentText += '_'
      }

      sContents[iIndex] = currentText

      setDisplayText(sContents)

      if (iTextPos === iArrLength) {
        if (iIndex === textArray.length - 1) {
          setIsTypingComplete(true) // Escritura completa
        } else {
          setITextPos(0)
          setIIndex((prevIndex) => {
            const newIndex = prevIndex + 1
            if (newIndex !== textArray.length) {
              setIArrLength(textArray[newIndex].length)
              return newIndex
            } else {
              return prevIndex
            }
          })
        }
      } else {
        setITextPos((prevTextPos) => prevTextPos + 1)
      }
    }

    if (!isTypingComplete) {
      const timer = setTimeout(typewriter, iTextPos === iArrLength ? 500 : speed)
      return () => clearTimeout(timer)
    }
  }, [iTextPos, iIndex, textArray, speed, scrollAt, iArrLength, isTypingComplete, displayText])

  return (
    <h2 className={style} {...props}>
      {displayText.map((text, index) => (
        <span key={index}>{text}</span>
      ))}
    </h2>
  )
}

export default Typewriter