import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const [tickets, setTickets] = useState([])
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchUserAndTickets = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data?.user) {
        console.error("❌ No se pudo obtener el usuario:", error?.message)
        setLoading(false)
        return
      }

      const user = data.user
      setUserId(user.id)

      const { data: supportData, error: supportError } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (supportError) {
        console.error("❌ Error al obtener tickets:", supportError.message)
      } else {
        setTickets(supportData)
      }

      setLoading(false)
    }

    fetchUserAndTickets()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message || !userId) return

    setSubmitting(true)

    const { error } = await supabase.from("support_tickets").insert([
      {
        user_id: userId,
        message: message,
      },
    ])

    if (error) {
      console.error("❌ Error al enviar ticket:", error.message)
      alert("Hubo un error al enviar tu solicitud.")
    } else {
      alert("✅ Mensaje enviado correctamente")
      setMessage("")
      // refrescar tickets
      const { data: updatedTickets } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
      setTickets(updatedTickets)
    }

    setSubmitting(false)
  }

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Cargando soporte...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 font-sans">
      <h1 className="text-3xl font-bold mb-6">🛠️ Centro de Soporte</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-8 space-y-4">
        <label className="block text-lg font-medium text-gray-700">
          ¿En qué podemos ayudarte?
        </label>
        <textarea
          className="w-full p-3 border rounded-xl"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe tu situación..."
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          {submitting ? "Enviando..." : "📨 Enviar soporte"}
        </button>
      </form>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">📝 Historial de Tickets</h2>
        {tickets.length === 0 ? (
          <p className="text-gray-500">Aún no has enviado solicitudes.</p>
        ) : (
          <ul className="space-y-3">
            {tickets.map((ticket, index) => (
              <li key={index} className="border-b pb-2 text-sm">
                <span className="block text-gray-800">{ticket.message}</span>
                <span className="text-gray-500 text-xs">{new Date(ticket.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
