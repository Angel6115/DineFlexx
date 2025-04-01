// src/paginas/Dashboard.jsx
import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { useOrder } from "../context/OrderContext"
import DarkModeToggle from "../components/DarkModeToggle"
import { motion } from "framer-motion"

export default function Dashboard() {
  const { puntos } = useOrder()
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    const fetchUsuarios = async () => {
      const { data, error } = await supabase.from("autorizados").select("*").order("created_at", { ascending: false })
      if (data) setUsuarios(data)
    }
    fetchUsuarios()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto p-6 font-sans bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard DineFlexx</h1>
        <DarkModeToggle />
      </div>

      <p className="mb-4 text-sm text-gray-500 dark:text-gray-300">
        Puntos totales actuales: <span className="text-purple-600 font-semibold">{puntos}</span>
      </p>

      <h2 className="text-xl font-semibold mb-3">Autorizaciones Recientes</h2>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        {usuarios.length === 0 ? (
          <p className="text-sm text-gray-500">No hay autorizaciones registradas.</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            {usuarios.map((u, i) => (
              <li key={i} className="py-3 flex justify-between">
                <span>{u.created_at.slice(0, 10)} - {u.nombre}</span>
                <span className="text-blue-600 font-medium">${u.monto.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  )
}
