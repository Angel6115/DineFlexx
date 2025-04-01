// src/context/OrderContext.jsx
import { createContext, useContext, useState } from "react"

const OrderContext = createContext()

export function OrderProvider({ children }) {
  const [orden, setOrden] = useState([])
  const [puntos, setPuntos] = useState(0)
  const [credit, setCredit] = useState(1500)
  const [referido, setReferido] = useState(null)
  const [puntosReferido, setPuntosReferido] = useState(0)

  const agregarItem = (item) => {
    setOrden((prev) => [...prev, item])
    setPuntos((prev) => prev + 10)
  }

  const vaciarOrden = () => {
    setOrden([])
    setPuntos(0)
  }

  const total = orden.reduce((acc, item) => acc + (item.precio || 0), 0)

  return (
    <OrderContext.Provider
      value={{
        orden,
        puntos,
        credit,
        setCredit,
        agregarItem,
        vaciarOrden,
        total,
        referido,
        setReferido,
        puntosReferido,
        setPuntosReferido
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export const useOrder = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrder debe usarse dentro de un OrderProvider")
  }
  return context
}
