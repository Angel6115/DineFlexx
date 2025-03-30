import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

export default function Dashboard() {
  const [userId, setUserId] = useState(null)
  const [reservations, setReservations] = useState([])

  useEffect(() => {
    const fetchUserAndReservations = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()

      if (error || !user) {
        console.error("No se pudo obtener el usuario")
        return
      }

      setUserId(user.id)

      const { data, error: fetchError } = await supabase
        .from("reservations")
        .select("restaurant, date, time")
        .eq("user_id", user.id)

      if (fetchError) {
        console.error("Error al obtener reservas", fetchError.message)
      } else {
        setReservations(data)
      }
    }

    fetchUserAndReservations()
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">📅 Mis Reservas</h1>

      {reservations.length === 0 ? (
        <p className="text-gray-600 text-center">No tienes reservas activas.</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((r, idx) => (
            <li key={idx} className="bg-white shadow rounded-xl p-4">
              <p className="text-lg font-semibold">{r.restaurant}</p>
              <p className="text-gray-600">{r.date} a las {r.time}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
