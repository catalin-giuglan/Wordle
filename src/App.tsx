"use client"

import { useState, useEffect } from "react"
import "./App.css"
import words from "./words.json"
import Keyboard from "./Keyboard"

function App() {
  const [solution, setSolution] = useState("")
  const [guesses, setGuesses] = useState<string[]>(Array(6).fill(""))
  const [currentRow, setCurrentRow] = useState(0)
  const [invalidWord, setInvalidWord] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [winMessage, setWinMessage] = useState("")
  const [gameOverMessage, setGameOverMessage] = useState("")
  const [letterStatuses, setLetterStatuses] = useState<Array<Array<string>>>(
    Array(6)
      .fill([])
      .map(() => Array(5).fill("")),
  )
  const [keyboardLetterStatuses, setKeyboardLetterStatuses] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchWord = () => {
      const randomWord = words[Math.floor(Math.random() * words.length)]
      setSolution(randomWord.toUpperCase())
      console.log("Solution:", randomWord.toUpperCase())
      console.log("Words:", words)
    }

    fetchWord()
  }, [])

  const updateKeyboardStatuses = (word: string, rowStatuses: string[]) => {
    const newKeyboardStatuses = { ...keyboardLetterStatuses }

    for (let i = 0; i < word.length; i++) {
      const letter = word[i]
      const status = rowStatuses[i]

      // Only update if the new status is better than the existing one
      // Priority: correct > present > absent
      if (
        !newKeyboardStatuses[letter] ||
        (newKeyboardStatuses[letter] === "absent" && status !== "absent") ||
        (newKeyboardStatuses[letter] === "present" && status === "correct")
      ) {
        newKeyboardStatuses[letter] = status
      }
    }

    setKeyboardLetterStatuses(newKeyboardStatuses)
  }

  const checkWord = (word: string) => {
    if (currentRow >= 6) return

    if (!words.includes(word.toLowerCase())) {
      setInvalidWord(true)
      setErrorMessage("The word is not in the dictionary!")
      setTimeout(() => {
        setInvalidWord(false)
        setErrorMessage("")
      }, 1000)
      return
    }

    // Create a copy of the solution to track which letters have been matched
    const solutionArray = solution.split("")
    const newStatuses = [...letterStatuses]

    // First pass: check for exact matches (green)
    for (let i = 0; i < 5; i++) {
      if (word[i] === solution[i]) {
        newStatuses[currentRow][i] = "correct"
        solutionArray[i] = "#" // Mark this position as used
      }
    }

    // Second pass: check for letters in wrong position (yellow)
    for (let i = 0; i < 5; i++) {
      if (newStatuses[currentRow][i] === "") {
        // Skip already matched letters
        const letterIndex = solutionArray.indexOf(word[i])
        if (letterIndex !== -1) {
          newStatuses[currentRow][i] = "present"
          solutionArray[letterIndex] = "#" // Mark this letter as used
        } else {
          newStatuses[currentRow][i] = "absent"
        }
      }
    }

    setLetterStatuses(newStatuses)
    updateKeyboardStatuses(word, newStatuses[currentRow])

    const newGuesses = [...guesses]
    newGuesses[currentRow] = word
    setGuesses(newGuesses)

    if (word === solution) {
      setWinMessage("Congratulations! You won! 🎉")
      setCurrentRow(6) // End the game
    } else {
      if (currentRow === 5) {
        // Last row (0-indexed)
        setGameOverMessage(`Game over! The word was ${solution}`)
      }
      setCurrentRow(currentRow + 1)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (currentRow >= 6) return

    const newGuesses = [...guesses]
    const word = newGuesses[currentRow]

    if (e.key === "Enter" && word.length === 5) {
      checkWord(word)
    } else if (e.key === "Backspace") {
      newGuesses[currentRow] = word.slice(0, -1)
      setGuesses(newGuesses)
    } else if (/^[a-z]$/i.test(e.key) && word.length < 5) {
      newGuesses[currentRow] = word + e.key.toUpperCase()
      setGuesses(newGuesses)
    }
  }

  const handleKeyPress = (key: string) => {
    if (currentRow >= 6) return

    const newGuesses = [...guesses]
    const word = newGuesses[currentRow]

    if (key === "ENTER" && word.length === 5) {
      checkWord(word)
    } else if (key === "⌫") {
      newGuesses[currentRow] = word.slice(0, -1)
      setGuesses(newGuesses)
    } else if (/^[A-Z]$/.test(key) && word.length < 5) {
      newGuesses[currentRow] = word + key
      setGuesses(newGuesses)
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentRow, guesses, solution])

  const getCellStyle = (rowIndex: number, colIndex: number) => {
    if (rowIndex < currentRow) {
      const status = letterStatuses[rowIndex][colIndex]
      if (status === "correct") {
        return { backgroundColor: "#6aaa64" } // Green
      } else if (status === "present") {
        return { backgroundColor: "#c9b458" } // Yellow
      } else if (status === "absent") {
        return { backgroundColor: "#787c7e" } // Gray/Red
      }
    }
    return {}
  }

  return (
    <div className="App">
      <h1 className="title">Wordle</h1>
      <div className="grid">
        {guesses.map((word, rowIndex) => (
          <div key={rowIndex} className={`row ${invalidWord && rowIndex === currentRow ? "shake" : ""}`}>
            {Array.from({ length: 5 }).map((_, colIndex) => (
              <div key={colIndex} className="cell" style={getCellStyle(rowIndex, colIndex)}>
                <span className="letter">{word[colIndex] || ""}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {winMessage && <div className="win-message">{winMessage}</div>}
      {gameOverMessage && <div className="game-over-message">{gameOverMessage}</div>}

      <div>
      <Keyboard letterStatuses={keyboardLetterStatuses} onKeyPress={handleKeyPress} />
      </div>
    </div>
  )
}

export default App

