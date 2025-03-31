import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [credit, setCredit] = useState(0)
  const [points, setPoints] = useState(0)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()
      if (!error && user) {
        setUser(user)

        const { data: creditData } = await supabase
          .from("credit")
          .select("amount")
          .eq("user_id", user.id)
          .single()
        if (creditData) setCredit(creditData.amount)

        const { data: pointsData } = await supabase
          .from("points")
          .select("total")
          .eq("user_id", user.id)
          .single()
        if (pointsData) setPoints(pointsData.total)
      }
    }

    fetchUser()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-4xl font-bold mb-2">Bienvenido a DineFlexx</h1>
        <p className="text-gray-600 text-lg mb-6">
          Saborea hoy, paga a tu ritmo. Tecnología gastronómica avanzada para ti 🍽️
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 text-left">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">💳 Crédito Disponible</h2>
            <p className="text-2xl font-bold text-green-600">${credit}</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 text-left">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">⭐ Puntos Acumulados</h2>
            <p className="text-2xl font-bold text-blue-600">{points}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/menu"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow text-lg"
          >
            🍔 Menú
          </Link>
          <Link
            to="/perfil"
            className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-xl shadow text-lg"
          >
            👤 Perfil
          </Link>
          <Link
            to="/soporte"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-xl shadow text-lg"
          >
            🛠️ Soporte
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
