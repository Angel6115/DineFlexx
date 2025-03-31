import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function HistorialReservas() {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReservas = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()
      if (error || !user) return setLoading(false)

      const { data, error: resError } = await supabase
        .from("reservas")
        .select("id, fecha, personas, total, estado")
        .eq("user_id", user.id)
        .order("fecha", { ascending: false })

      if (!resError && data) setReservas(data)
      setLoading(false)
    }
    fetchReservas()
  }, [])

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">📆 Historial de Reservas</h1>

      {loading ? (
        <p className="text-center text-gray-500">Cargando reservas...</p>
      ) : reservas.length === 0 ? (
        <p className="text-center text-gray-500">No tienes reservas aún.</p>
      ) : (
        <div className="space-y-4">
          {reservas.map((r) => (
            <div
              key={r.id}
              className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold">🍽️ DineFlexx Restaurant</p>
                <p className="text-sm text-gray-500">{new Date(r.fecha).toLocaleString()}</p>
                <p className="text-sm">Personas: {r.personas}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">${r.total}</p>
                <span className={`text-sm px-2 py-1 rounded-full ${r.estado === 'Confirmada' ? 'bg-green-100 text-green-700' : r.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                  {r.estado}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
