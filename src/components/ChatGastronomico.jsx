// src/components/AsistenteGastronomico.jsx
import { useState } from "react"
import { motion } from "framer-motion"
import { BotIcon, SendHorizonal } from "lucide-react"

export default function AsistenteGastronomico() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hola 👋 ¿En qué puedo ayudarte con gastronomía o DineFlexx?" }
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    setMessages([...messages, { sender: "user", text: input }])
    // Simulación respuesta
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "🍽️ Esa es una excelente pregunta. Prueba buscar restaurantes cercanos usando tu ubicación. 😋" }
      ])
    }, 800)
    setInput("")
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-xl hover:scale-105 transition"
        >
          <BotIcon className="w-5 h-5" />
        </button>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-900 border dark:border-gray-700 shadow-2xl rounded-2xl w-80 sm:w-96 p-4 flex flex-col"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-gray-800 dark:text-white">Asistente Gastronómico</h3>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-red-500">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto max-h-64 space-y-2 text-sm pr-1">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-xl max-w-xs ${
                  msg.sender === "bot"
                    ? "bg-gray-200 dark:bg-gray-700 text-left"
                    : "bg-blue-600 text-white ml-auto text-right"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Hazme una pregunta..."
              className="flex-1 text-sm px-3 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            <button onClick={handleSend} className="text-blue-600 hover:text-blue-800">
              <SendHorizonal className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
