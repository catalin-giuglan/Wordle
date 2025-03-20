"use client"

import type React from "react"

interface KeyboardProps {
  letterStatuses: Record<string, string>
  onKeyPress: (key: string) => void
}

const Keyboard: React.FC<KeyboardProps> = ({ letterStatuses, onKeyPress }) => {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
  ]

  const getKeyStyle = (key: string) => {
    if (key === "ENTER" || key === "⌫") return {}

    const status = letterStatuses[key]
    if (status === "correct") {
      return { backgroundColor: "#6aaa64" } // Green
    } else if (status === "present") {
      return { backgroundColor: "#c9b458" } // Yellow
    } else if (status === "absent") {
      return { backgroundColor: "#3a3a3c" } // Darker gray for absent
    }
    return {}
  }

  return (
    <div className="keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              className={`keyboard-key ${key === "ENTER" || key === "⌫" ? "keyboard-key-wide" : ""}`}
              style={getKeyStyle(key)}
              onClick={() => onKeyPress(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Keyboard

