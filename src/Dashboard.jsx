import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useOrder } from "./context/OrderContext"

export default function Dashboard() {
  const [nombre, setNombre] = useState("")
  const { credit, puntos } = useOrder()

  useEffect(() => {
    const fetchUserName = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()

      if (!error && user) {
        const fullName = user.user_metadata?.full_name || "Usuario"
        setNombre(fullName)
      }
    }

    fetchUserName()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="flex justify-center mb-4">
          <img src="/images/logo3.png" alt="DineFlexx" className="h-20 object-contain" />
        </div>

        <h1 className="text-4xl font-bold mb-2">Bienvenido, {nombre}</h1>
        <p className="text-gray-600 text-lg mb-6">
          Saborea hoy, paga a tu ritmo. Tecnología gastronómica avanzada para ti 🍽️
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 text-left">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">💳 Crédito Disponible</h2>
            <p className="text-2xl font-bold text-green-600">${credit.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 text-left">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">⭐ Puntos Acumulados</h2>
            <p className="text-2xl font-bold text-blue-600">{puntos}</p>
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
            to="/wallet"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-xl shadow text-lg"
          >
            💳 Wallet
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
