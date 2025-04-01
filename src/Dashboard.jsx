// src/Dashboard.jsx
import { useEffect, useState } from "react"
import { useOrder } from "./context/OrderContext"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"

export default function Dashboard() {
  const { puntos, credit, referido, puntosReferido } = useOrder()
  const [historial, setHistorial] = useState([])

  useEffect(() => {
    // Simulamos historial con datos mock
    setHistorial([
      { mes: "Ene", puntos: 60 },
      { mes: "Feb", puntos: 90 },
      { mes: "Mar", puntos: 120 },
      { mes: "Abr", puntos: puntos }
    ])
  }, [puntos])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto p-6 font-sans text-gray-800 dark:text-white"
    >
      <h1 className="text-3xl font-bold mb-6">📊 Resumen de Actividad</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 shadow rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-2">Crédito Disponible</h2>
          <p className="text-2xl font-bold text-green-600">${credit.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 shadow rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-2">Puntos Acumulados</h2>
          <p className="text-2xl font-bold text-blue-600">{puntos}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 shadow rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">📈 Puntos Generados (Mensual)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={historial}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="puntos" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {referido && (
        <div className="bg-white dark:bg-gray-900 shadow rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-2">🎉 Actividad de tu referido</h2>
          <p className="text-blue-500 font-medium">{referido}</p>
          <p className="text-sm text-gray-400 dark:text-gray-300">
            Puntos generados gracias a esta persona: <span className="font-semibold">{puntosReferido}</span>
          </p>
        </div>
      )}
    </motion.div>
  )
}
