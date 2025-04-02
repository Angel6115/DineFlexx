// src/paginas/Menu.jsx
import { useState } from "react"
import { useOrder } from "../context/OrderContext"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { useNavigate } from "react-router-dom"

const PLATOS = [
  { id: 1, nombre: "Pizza Margarita", precio: 12 },
  { id: 2, nombre: "Sushi Roll", precio: 18 },
  { id: 3, nombre: "Tacos al Pastor", precio: 10 },
  { id: 4, nombre: "Hamburguesa Doble", precio: 14 },
  { id: 5, nombre: "Ensalada César", precio: 9 }
]

export default function Menu() {
  const { agregarItem, orden } = useOrder()
  const [cantidades, setCantidades] = useState({})
  const navigate = useNavigate()

  const incrementar = (plato) => {
    setCantidades((prev) => {
      const nueva = { ...prev, [plato.id]: (prev[plato.id] || 0) + 1 }
      agregarItem({ ...plato, cantidad: nueva[plato.id] })
      return nueva
    })
  }

  const decrementar = (plato) => {
    setCantidades((prev) => {
      if ((prev[plato.id] || 0) > 0) {
        const nueva = { ...prev, [plato.id]: prev[plato.id] - 1 }
        agregarItem({ ...plato, cantidad: nueva[plato.id] })
        return nueva
      }
      return prev
    })
  }

  const total = orden.reduce((acc, p) => acc + (p.precio * (p.cantidad || 1)), 0)

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 font-sans text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Menú DineFlexx</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {PLATOS.map((plato) => (
          <motion.div
            key={plato.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold">{plato.nombre}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Precio: ${plato.precio}</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decrementar(plato)}
                  className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <Minus size={18} />
                </button>
                <span>{cantidades[plato.id] || 0}</span>
                <button
                  onClick={() => incrementar(plato)}
                  className="p-1 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Plus size={18} />
                </button>
              </div>
              <p className="text-sm font-bold">${(cantidades[plato.id] || 0) * plato.precio}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              onClick={() => navigate("/wallet")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Ver Orden (${total.toFixed(2)})
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
