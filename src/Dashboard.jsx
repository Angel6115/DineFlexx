// src/Dashboard.jsx
import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import { useOrder } from "./context/OrderContext"
import { motion } from "framer-motion"

export default function Dashboard() {
  const { puntos } = useOrder()
  const [userId, setUserId] = useState(null)
  const [autorizaciones, setAutorizaciones] = useState([])
  const [reservas, setReservas] = useState([])

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) return
      setUserId(user.id)

      const { data: authData } = await supabase
        .from("autorizados")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      setAutorizaciones(authData || [])

      const { data: reservasData } = await supabase
        .from("reservas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      setReservas(reservasData || [])
    }

    fetchUserData()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto p-6 dark:text-white"
    >
      <h1 className="text-3xl font-bold mb-6">Resumen General</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold">⭐ Puntos</h2>
          <p className="text-3xl font-bold text-purple-600 mt-2">{puntos}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold">👥 Autorizaciones</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{autorizaciones.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold">📅 Reservas</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">{reservas.length}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-bold mb-3">Últimas Autorizaciones</h2>
        {autorizaciones.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay registros.</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            {autorizaciones.slice(0, 5).map((a, i) => (
              <li key={i} className="py-2 flex justify-between">
                <span>{a.created_at.slice(0, 10)} - {a.nombre}</span>
                <span className="text-blue-600 font-medium">${a.monto.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-3">Últimas Reservas</h2>
        {reservas.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay reservas registradas.</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            {reservas.slice(0, 5).map((r, i) => (
              <li key={i} className="py-2 flex justify-between">
                <span>{r.fecha} a las {r.hora}</span>
                <span className="text-green-600 font-medium">${r.total.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  )
}
