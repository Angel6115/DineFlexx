import { useState } from "react"
import { supabase } from "../supabaseClient"
import { useOrder } from "../context/OrderContext"

export default function Wallet() {
  const {
    orden = [],
    total = 0,
    puntos = 0,
    credit = 0,
    cuotaInicial = 0,
    pagosMensuales = 0
  } = useOrder()

  const [fecha, setFecha] = useState("")
  const [hora, setHora] = useState("")
  const [status, setStatus] = useState(null)

  const handleReserva = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    const { error } = await supabase.from("reservas").insert([
      {
        user_id: user?.id,
        fecha,
        hora,
        items: orden,
        propina: 0,
        total
      }
    ])

    if (!error) {
      setStatus("success")
    } else {
      console.error("Error al reservar:", error.message)
      setStatus("error")
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto font-sans">
      <div className="flex items-center gap-4 mb-6">
        <img
          src="/images/foto4.jpg"
          alt="DineFlexx"
          className="h-12 w-auto object-contain shadow"
        />
        <h1 className="text-3xl font-bold tracking-tight text-gray-800">
          Wallet DineFlexx
        </h1>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl mb-6">
        <h2 className="text-2xl font-semibold mb-4">🧾 Resumen del Pedido</h2>

        {orden.length === 0 ? (
          <p className="text-gray-500">No hay productos agregados.</p>
        ) : (
          <div className="space-y-4">
            {orden.map((item, i) => (
              <div key={i} className="flex justify-between items-center border-b pb-2">
                <span>{item.nombre}</span>
                <span className="font-semibold text-blue-600">
                  ${Number(item.precio ?? 0).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="pt-4 border-t mt-2">
              <p className="text-lg font-semibold text-gray-800">
                Total: ${Number(total ?? 0).toFixed(2)}
              </p>
              <p className="text-green-700">
                Crédito Disponible: ${Number(credit ?? 0).toFixed(2)}
              </p>
              <p className="text-purple-600">Puntos Acumulados: {puntos}</p>
              <p className="text-yellow-600 mt-2">
                💳 Pago inicial: ${Number(cuotaInicial ?? 0).toFixed(2)}
              </p>
              <p className="text-yellow-600">
                📅 6 pagos mensuales: ${Number(pagosMensuales ?? 0).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>

      {orden.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-6">
          <h2 className="text-xl font-semibold mb-4">📅 Reservar</h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="p-3 border rounded-xl shadow-sm"
            />
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="p-3 border rounded-xl shadow-sm"
            />
          </div>
          <button
            onClick={handleReserva}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
          >
            Confirmar Reserva y Pagar
          </button>
          {status === "success" && (
            <p className="text-green-600 mt-2">✅ Reserva exitosa</p>
          )}
          {status === "error" && (
            <p className="text-red-600 mt-2">❌ Error al reservar</p>
          )}
        </div>
      )}
    </div>
  )
}
