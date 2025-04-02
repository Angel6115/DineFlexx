// src/Dashboard.jsx
import { useEffect, useState } from "react"
import { useOrder } from "./context/OrderContext"
import { supabase } from "./supabaseClient"
import { motion } from "framer-motion"

export default function Dashboard() {
  const { puntos, referido, puntosReferido } = useOrder()
  const [autorizaciones, setAutorizaciones] = useState([])
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()
      if (error || !user) return

      const { data: auths } = await supabase
        .from("autorizados")
        .select("nombre, monto, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      const { data: reservasData } = await supabase
        .from("reservas")
        .select("fecha, hora, total")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (auths) setAutorizaciones(auths)
      if (reservasData) setReservas(reservasData)
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto p-6 font-sans text-gray-800 dark:text-white"
    >
      <h1 className="text-3xl font-bold mb-6">Resumen de Cuenta</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center">
          <h2 className="text-lg font-semibold">⭐ Puntos</h2>
          <p className="text-2xl text-purple-600 font-bold mt-2">{puntos}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center">
          <h2 className="text-lg font-semibold">👥 Autorizaciones</h2>
          <p className="text-2xl text-blue-600 font-bold mt-2">{autorizaciones.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center">
          <h2 className="text-lg font-semibold">📅 Reservas</h2>
          <p className="text-2xl text-green-600 font-bold mt-2">{reservas.length}</p>
        </div>
      </div>

      {referido && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold">🎉 Referido</h2>
          <p className="text-blue-500 font-medium">{referido}</p>
          <p className="text-sm text-gray-500 dark:text-gray-300">Puntos generados por esta persona: <strong>{puntosReferido}</strong></p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Últimas Autorizaciones</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Cargando...</p>
        ) : autorizaciones.length === 0 ? (
          <p className="text-sm text-gray-500">No hay registros aún.</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            {autorizaciones.slice(0, 5).map((a, i) => (
              <li key={i} className="py-3 flex justify-between">
                <span>{a.created_at.slice(0, 10)} - {a.nombre}</span>
                <span className="text-blue-600 font-medium">${a.monto.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Últimas Reservas</h2>
        {reservas.length === 0 ? (
          <p className="text-sm text-gray-500">No hay reservas registradas.</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            {reservas.slice(0, 5).map((r, i) => (
              <li key={i} className="py-3 flex justify-between">
                <span>{r.fecha} - {r.hora}</span>
                <span className="text-green-600 font-medium">${r.total.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  )
}
