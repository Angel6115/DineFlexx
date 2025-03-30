import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function Soporte() {
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState(null)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()

      if (error || !user) {
        console.error("❌ Error al obtener usuario:", error?.message)
        setStatus("no-user")
      } else {
        setUserId(user.id)
      }
    }
    getUser()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("loading")

    if (!userId) return setStatus("no-user")

    const { error } = await supabase.from("support_tickets").insert({
      user_id: userId,
      message
    })

    if (error) {
      console.error("❌ Error al enviar soporte:", error.message)
      setStatus("error")
    } else {
      setStatus("success")
      setMessage("")
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">🛠️ Centro de Soporte</h1>

      <div className="bg-white shadow-lg rounded-2xl p-6">
        <p className="text-gray-700 mb-4">
          ¿Tienes preguntas o necesitas ayuda? Envía tu mensaje al equipo de DineFlexx y te contactaremos pronto.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            rows="5"
            className="w-full p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Escribe tu mensaje aquí..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>

          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow"
          >
            {status === "loading" ? "Enviando..." : "Enviar Soporte"}
          </button>

          {status === "success" && (
            <p className="text-green-600 mt-2">✅ Mensaje enviado correctamente</p>
          )}
          {status === "error" && (
            <p className="text-red-600 mt-2">❌ Error al enviar el mensaje. Intenta nuevamente.</p>
          )}
          {status === "no-user" && (
            <p className="text-yellow-600 mt-2">⚠️ Debes iniciar sesión para enviar un mensaje.</p>
          )}
        </form>
      </div>
    </div>
  )
}
