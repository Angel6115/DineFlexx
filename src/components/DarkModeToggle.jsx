// src/components/DarkModeToggle.jsx
import { useEffect, useState } from "react"

export default function DarkModeToggle() {
  const [enabled, setEnabled] = useState(() => {
    return localStorage.getItem("theme") === "dark"
  })

  useEffect(() => {
    const root = document.documentElement
    if (enabled) {
      root.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      root.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [enabled])

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className="ml-auto px-4 py-2 rounded-full text-sm font-medium border shadow dark:bg-gray-800 dark:text-white"
    >
      {enabled ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
    </button>
  )
}
