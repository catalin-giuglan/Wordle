"use client"

import { useState, useEffect } from "react"
import "./App.css"
import words from "./words.json"
import InputHandler from "./InputHandler"

function App() {
  const [solution, setSolution] = useState("")
  const [guesses, setGuesses] = useState<string[]>(Array(6).fill(""))
  const [currentRow, setCurrentRow] = useState(0)
  const [invalidWord, setInvalidWord] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [winMessage, setWinMessage] = useState("")
  const [gameOverMessage, setGameOverMessage] = useState("")
  const [currentWord, setCurrentWord] = useState("")
  const [letterStatuses, setLetterStatuses] = useState<Array<Array<string>>>(
    Array(6)
      .fill([])
      .map(() => Array(5).fill("")),
  )

  useEffect(() => {
    const fetchWord = () => {
      const randomWord = words[Math.floor(Math.random() * words.length)]
      setSolution(randomWord.toUpperCase())
      console.log("Solution:", randomWord.toUpperCase()) // For debugging
    }

    fetchWord()
  }, [])

  const checkWord = (word: string) => {
    if (currentRow >= 6) return

    if (!words.includes(word.toLowerCase())) {
      setInvalidWord(true)
      setErrorMessage("Cuvântul nu există în dicționar!")
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

    const newGuesses = [...guesses]
    newGuesses[currentRow] = word
    setGuesses(newGuesses)

    if (word === solution) {
      setWinMessage("Felicitări! Ai ghicit cuvântul! 🎉")
      setCurrentRow(6) // End the game
    } else {
      if (currentRow === 5) {
        // Last row (0-indexed)
        setGameOverMessage(`Game over! The word was ${solution}`)
      }
      setCurrentRow(currentRow + 1)
    }

    setCurrentWord("") // Reset current word for next guess
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

  const handleEnter = (word: string) => {
    if (word.length === 5) {
      checkWord(word)
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
      {/* <div className="answer">
        {solution}
      </div> */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {winMessage && <div className="win-message">{winMessage}</div>}
      {gameOverMessage && <div className="game-over-message">{gameOverMessage}</div>}

      <InputHandler onEnter={handleEnter} currentWord={currentWord} setCurrentWord={setCurrentWord} />
    </div>
  )
}

export default App

