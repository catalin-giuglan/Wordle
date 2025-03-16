"use client"

import type React from "react"

interface InputHandlerProps {
  onEnter: (word: string) => void
  currentWord: string
  setCurrentWord: (word: string) => void
}

const InputHandler: React.FC<InputHandlerProps> = ({ onEnter, currentWord, setCurrentWord }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 5) {
      setCurrentWord(e.target.value.toUpperCase())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentWord.length === 5) {
      onEnter(currentWord)
    }
  }

  return (
    <div></div>
  )
}

export default InputHandler