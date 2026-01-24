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
      className="p-2 rounded-full text-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      title={enabled ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {enabled ? "☀️" : "🌙"}
    </button>
  )
}
