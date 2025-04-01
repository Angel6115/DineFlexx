import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function Checkout() {
  const [orden, setOrden] = useState([])
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const obtenerUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        const stored = sessionStorage.getItem("orden")
        if (stored) setOrden(JSON.parse(stored))
      }
    }
    obtenerUser()
  }, [])

  const total = orden.reduce((acc, item) => acc + item.precio, 0)
  const cuotaInicial = total * 0.2
  const mensualidad = ((total - cuotaInicial) / 6).toFixed(2)

  return (
    <div className="max-w-3xl mx-auto p-4 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🧾 Checkout</h1>

      {orden.length === 0 ? (
        <p className="text-gray-600">No hay productos agregados.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 mb-4">
            {orden.map((item, i) => (
              <li key={i} className="flex justify-between py-2 text-gray-700">
                <span>{item.nombre}</span>
                <span>${item.precio.toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="bg-white rounded-xl shadow p-4 mb-4">
            <h2 className="font-semibold text-gray-700 mb-2">💳 Detalles de Pago</h2>
            <p>Total: <strong>${total.toFixed(2)}</strong></p>
            <p>Cuota Inicial (20%): <strong>${cuotaInicial.toFixed(2)}</strong></p>
            <p>Mensualidad (6 meses): <strong>${mensualidad}</strong></p>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl shadow">
            Confirmar Pago
          </button>
        </>
      )}
    </div>
  )
}
