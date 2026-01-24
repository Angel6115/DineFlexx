// src/context/OrderContext.jsx
import { createContext, useContext, useState, useEffect } from "react"
import supabase from "../supabaseClient"

const OrderContext = createContext()

export function OrderProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('dineflexx_cart')
    return saved ? JSON.parse(saved) : []
  })
  
  const [puntos, setPuntos] = useState(0)
  const [credit, setCredit] = useState(0)
  const [referido, setReferido] = useState(null)
  const [puntosReferido, setPuntosReferido] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    loadCreditFromSupabase()
  }, [])

  const loadCreditFromSupabase = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.log('No hay usuario autenticado')
        setLoading(false)
        return
      }

      setUserId(user.id)

      // ✅ NOMBRE CORRECTO: digital_wallet (CON guión bajo)
      const { data, error } = await supabase
        .from('digital_wallet') // ✅ Cambiado aquí
        .select('balance')
        .eq('user_id', user.id) // ✅ También con guión bajo
        .maybeSingle()

      if (error) {
        console.error('Error al cargar crédito:', error)
        setLoading(false)
        return
      }

      if (data?.balance != null) {
        setCredit(data.balance)
        console.log('✅ Crédito cargado:', data.balance)
      } else {
        console.log('⚠️ No se encontró wallet, creando...')
        const { error: insertError } = await supabase
          .from('digital_wallet') // ✅ Cambiado aquí
          .insert({ user_id: user.id, balance: 0 }) // ✅ También con guión bajo
        
        if (!insertError) {
          setCredit(0)
        }
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error inesperado al cargar crédito:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    localStorage.setItem('dineflexx_cart', JSON.stringify(items))
  }, [items])

  const agregarItem = (item) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(i => i.id === item.id)
      
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex].quantity += item.quantity
        return updated
      } else {
        return [...prev, item]
      }
    })
    
    const puntosGanados = Math.floor((item.price * item.quantity) / 2)
    setPuntos((prev) => prev + puntosGanados)
  }

  const actualizarCantidad = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      eliminarItem(itemId)
      return
    }
    
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const eliminarItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const limpiarCarrito = () => {
    setItems([])
    localStorage.removeItem('dineflexx_cart')
  }

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  return (
    <OrderContext.Provider
      value={{
        items,
        agregarItem,
        actualizarCantidad,
        eliminarItem,
        limpiarCarrito,
        puntos,
        setPuntos,
        credit,
        setCredit,
        total,
        referido,
        setReferido,
        puntosReferido,
        setPuntosReferido,
        loading,
        userId,
        refreshCredit: loadCreditFromSupabase
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
