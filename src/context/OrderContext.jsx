import { createContext, useContext, useState } from "react"

const OrderContext = createContext()

export function OrderProvider({ children }) {
  const [orden, setOrden] = useState([])
  const [puntos, setPuntos] = useState(0)

  const agregarItem = (item) => {
    setOrden((prev) => [...prev, item])
    setPuntos((prev) => prev + 10)
  }

  const vaciarOrden = () => {
    setOrden([])
    setPuntos(0)
  }

  const total = orden.reduce((acc, item) => acc + item.precio, 0)

  return (
    <OrderContext.Provider
      value={{
        orden,
        puntos,
        agregarItem,
        vaciarOrden,
        total
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export const useOrder = () => useContext(OrderContext)
