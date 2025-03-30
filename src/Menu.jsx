import { useState } from "react"
import { supabase } from "./supabaseClient"

export default function Menu() {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [restaurant, setRestaurant] = useState("Dine Restaurant")
  const [status, setStatus] = useState(null)

  const handleReserve = async () => {
    setStatus("loading")

    const {
      data: { user },
      error
    } = await supabase.auth.getUser()

    if (error || !user) {
      setStatus("no-user")
      return
    }

    const { error: insertError } = await supabase.from("reservations").insert({
      user_id: user.id,
      restaurant,
      date,
      time
    })

    if (insertError) {
      console.error(insertError)
      setStatus("error")
    } else {
      setStatus("success")
      setDate("")
      setTime("")
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">🍽️ DineFlexx - Menú</h1>

      <div className="bg-white shadow rounded-2xl p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Reservar en {restaurant}</h2>

        <div className="space-y-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2 rounded-xl"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border p-2 rounded-xl"
          />

          <button
            onClick={handleReserve}
            disabled={status === "loading"}
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl shadow hover:bg-blue-700"
          >
            {status === "loading" ? "Reservando..." : "Reservar aquí"}
          </button>

          {status === "success" && <p className="text-green-600">✅ Reserva confirmada</p>}
          {status === "error" && <p className="text-red-600">❌ Error al hacer la reserva</p>}
          {status === "no-user" && <p className="text-yellow-600">⚠️ Debes iniciar sesión para reservar</p>}
        </div>
      </div>
    </div>
  )
}
