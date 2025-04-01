import { useState } from "react"
import { useOrder } from "../context/OrderContext"

const tarjetas = [
  { id: 1, tipo: "Débito", banco: "Banco Nacional", numero: "**** 1234" },
  { id: 2, tipo: "Cuenta de Cheques", banco: "Interbank", numero: "**** 5678" }
]

export default function Wallet() {
  const { total = 0, credit = 0, puntos = 0, referido = null, puntosReferido = 0 } = useOrder()
  const [tipoPago, setTipoPago] = useState("mensual")
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null)
  const [autorizado, setAutorizado] = useState(false)
  const [walletGenerada, setWalletGenerada] = useState(false)

  const fee = typeof total === "number" ? total * 0.2 : 0
  const totalConFee = typeof total === "number" ? total + fee : 0
  const puntosGenerados = typeof total === "number" ? Math.floor(total / 2) : 0

  const cuotas = tipoPago === "mensual"
    ? Array.from({ length: 6 }, (_, i) => totalConFee / 6)
    : Array.from({ length: 8 }, (_, i) => totalConFee / 8)

  const generarWalletDigital = () => {
    setWalletGenerada(true)
    alert("Tarjeta generada exitosamente en Wallet Digital ✅")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <div className="flex items-center gap-4 mb-6">
        <img src="/images/logo4.jpg" alt="DineFlexx" className="h-12 w-12 object-contain" />
        <h1 className="text-3xl font-bold text-gray-800">Wallet DineFlexx</h1>
      </div>

      <div className="bg-white shadow p-6 rounded-2xl mb-6">
        <h2 className="text-xl font-semibold mb-2">Resumen de Pago</h2>
        <p>Total de la orden: <span className="font-medium">${typeof total === "number" ? total.toFixed(2) : "Cargando..."}</span></p>
        <p>Fee DineFlexx (20%): <span className="font-medium">${typeof fee === "number" ? fee.toFixed(2) : "Cargando..."}</span></p>
        <p>Total a pagar: <span className="font-bold text-blue-600">${typeof totalConFee === "number" ? totalConFee.toFixed(2) : "Cargando..."}</span></p>
        <p>Crédito disponible: <span className="text-green-600 font-semibold">${typeof credit === "number" ? credit.toFixed(2) : "Cargando..."}</span></p>
        <p>Puntos por esta compra: <span className="text-purple-600 font-semibold">+{puntosGenerados}</span></p>
      </div>

      <div className="bg-white shadow p-6 rounded-2xl mb-6">
        <h2 className="text-lg font-semibold mb-2">Selecciona tipo de pago</h2>
        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-full border ${tipoPago === "mensual" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}
            onClick={() => setTipoPago("mensual")}
          >Mensual (6 cuotas)</button>
          <button
            className={`px-4 py-2 rounded-full border ${tipoPago === "semanal" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}
            onClick={() => setTipoPago("semanal")}
          >Semanal (8 cuotas)</button>
        </div>
        <ul className="text-sm text-gray-700 list-disc list-inside">
          {cuotas.map((c, i) => (
            <li key={i}>Cuota {i + 1}: ${typeof c === "number" ? c.toFixed(2) : "-"}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white shadow p-6 rounded-2xl mb-6">
        <h2 className="text-lg font-semibold mb-4">Selecciona tarjeta de pago</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tarjetas.map(t => (
            <div
              key={t.id}
              onClick={() => setTarjetaSeleccionada(t.id)}
              className={`border rounded-xl p-4 cursor-pointer transition shadow-sm ${tarjetaSeleccionada === t.id ? "border-blue-600 bg-blue-50" : "hover:shadow-md"}`}
            >
              <p className="font-semibold">{t.tipo}</p>
              <p>{t.banco}</p>
              <p className="text-sm text-gray-500">{t.numero}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow p-6 rounded-2xl mb-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={autorizado}
            onChange={() => setAutorizado(!autorizado)}
          />
          <span className="text-sm">Autorizo a otra persona a usar mi crédito disponible</span>
        </label>
        {autorizado && (
          <p className="mt-2 text-sm text-gray-600">Se reflejará el uso en tu historial de crédito.</p>
        )}
      </div>

      {referido && (
        <div className="bg-white shadow p-6 rounded-2xl mb-6">
          <h2 className="text-lg font-semibold">Tu referido: <span className="text-blue-600">{referido}</span></h2>
          <p className="text-sm text-gray-600">Puntos acumulados por esta persona: {puntosReferido}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <button
          onClick={() => alert("Orden procesada con éxito ✅")}
          disabled={!tarjetaSeleccionada}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-2xl shadow disabled:opacity-50"
        >
          Pagar Orden
        </button>

        <button
          onClick={generarWalletDigital}
          className="bg-black hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-2xl shadow"
        >
          Agregar a Wallet Digital (Apple Pay)
        </button>
      </div>

      {walletGenerada && (
        <div className="mt-6 bg-green-100 border border-green-300 text-green-800 p-4 rounded-xl shadow">
          Tu tarjeta ha sido agregada exitosamente a tu Wallet Digital. 🎉
        </div>
      )}
    </div>
  )
}
