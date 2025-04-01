// src/Dashboard.jsx
import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import { useOrder } from "./context/OrderContext"
import { motion } from "framer-motion"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const { credit, puntos } = useOrder()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user)
    })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto px-4 py-10 text-gray-800 dark:text-white"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold mb-6"
      >
        Bienvenido al Panel de Usuario
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15 }
          }
        }}
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          className="bg-blue-100 dark:bg-gray-700 rounded-xl p-6 shadow"
        >
          <h2 className="text-lg font-semibold mb-2">💰 Crédito Disponible</h2>
          <p className="text-2xl font-bold text-green-600">${credit.toFixed(2)}</p>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          className="bg-green-100 dark:bg-gray-700 rounded-xl p-6 shadow"
        >
          <h2 className="text-lg font-semibold mb-2">🎯 Puntos Acumulados</h2>
          <p className="text-2xl font-bold text-blue-600">{puntos}</p>
        </motion.div>
      </motion.div>

      <motion.div
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-xl font-bold mb-4">📊 Actividad Reciente</h2>
        <ul className="space-y-2 text-sm">
          <li>✅ Compra realizada en Restaurante X - $45.00</li>
          <li>🎁 Puntos redimidos: 150</li>
          <li>👥 Autorización de crédito a Ana R. - $25.00</li>
        </ul>
      </motion.div>
    </motion.div>
  )
}
