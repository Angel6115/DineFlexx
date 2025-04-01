import { useState, useEffect } from "react"
import { useOrder } from "../context/OrderContext"
import DarkModeToggle from "../components/DarkModeToggle"

const tarjetas = [
  { id: 1, tipo: "Débito", banco: "Banco Nacional", numero: "**** 1234" },
  { id: 2, tipo: "Cuenta de Cheques", banco: "Interbank", numero: "**** 5678" },
  { id: 3, tipo: "ATH Móvil", banco: "ATH PR", numero: "ath@cliente" }
]

const historialTransacciones = [
  { id: 1, fecha: "2025-03-28", tipo: "Pago semanal", monto: 18.75 },
  { id: 2, fecha: "2025-03-22", tipo: "Wallet Digital", monto: 102.50 },
  { id: 3, fecha: "2025-03-15", tipo: "Autorizado a otro", monto: 45.00 },
]

export default function Wallet() {
  const {
    total: initialTotal = 0,
    credit: initialCredit = 1500,
    puntos = 0,
    referido = null,
    puntosReferido = 0
  } = useOrder()

  const [total, setTotal] = useState(initialTotal)
  const [credit, setCredit] = useState(initialCredit)
  const [tipoPago, setTipoPago] = useState("mensual")
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null)
  const [autorizado, setAutorizado] = useState(false)
  const [walletGenerada, setWalletGenerada] = useState(false)
  const [ordenExitosa, setOrdenExitosa] = useState(false)
  const [propina, setPropina] = useState(0.18)

  useEffect(() => {
    if (ordenExitosa) {
      setTotal(0)
      setWalletGenerada(false)
    }
  }, [ordenExitosa])

  const fee = total * 0.2
  const propinaTotal = total * propina
  const totalConFee = total + fee + propinaTotal
  const puntosGenerados = Math.floor(total / 2)

  const cuotas = tipoPago === "mensual"
    ? Array.from({ length: 6 }, () => totalConFee / 6)
    : Array.from({ length: 8 }, () => totalConFee / 8)

  const pagarOrden = () => {
    setCredit((prev) => prev - totalConFee)
    setOrdenExitosa(true)
  }

  const generarWalletDigital = () => {
    setWalletGenerada(true)
    setOrdenExitosa(true)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <img src="/images/logo3.jpg" alt="DineFlexx" className="h-16 w-16 object-contain" />
          <h1 className="text-3xl font-bold">Wallet DineFlexx</h1>
        </div>
        <DarkModeToggle />
      </div>

      {!ordenExitosa && <>
        <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-2xl mb-6">
          <h2 className="text-xl font-semibold mb-2">Resumen de Pago</h2>
          <p>Total de la orden: <span className="font-medium">${total.toFixed(2)}</span></p>
          <p>Fee DineFlexx (20%): <span className="font-medium">${fee.toFixed(2)}</span></p>
          <p>Propina ({(propina * 100).toFixed(0)}%): <span className="font-medium">${propinaTotal.toFixed(2)}</span></p>
          <p>Total a pagar: <span className="font-bold text-blue-600">${totalConFee.toFixed(2)}</span></p>
          <p>Crédito disponible: <span className="text-green-600 font-semibold">${credit.toFixed(2)}</span></p>
          <p>Puntos por esta compra: <span className="text-purple-600 font-semibold">+{puntosGenerados}</span></p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-2xl mb-6">
          <h2 className="text-lg font-semibold mb-2">Selecciona tipo de pago</h2>
          <div className="flex gap-4 mb-4">
            <button className={`px-4 py-2 rounded-full border ${tipoPago === "mensual" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`} onClick={() => setTipoPago("mensual")}>Mensual (6 cuotas)</button>
            <button className={`px-4 py-2 rounded-full border ${tipoPago === "semanal" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`} onClick={() => setTipoPago("semanal")}>Semanal (8 cuotas)</button>
          </div>
          <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside">
            {cuotas.map((c, i) => (<li key={i}>Cuota {i + 1}: ${c.toFixed(2)}</li>))}
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-2xl mb-6">
          <h2 className="text-lg font-semibold mb-4">Selecciona propina</h2>
          <div className="flex gap-3 flex-wrap">
            {[0.18, 0.2, 0.25, 0.3].map(p => (
              <button
                key={p}
                onClick={() => setPropina(p)}
                className={`px-4 py-2 rounded-full border ${propina === p ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}
              >{(p * 100).toFixed(0)}%</button>
            ))}
            <input
              type="number"
              step="0.01"
              min="0"
              max="0.5"
              placeholder="Otro %"
              className="px-3 py-2 border rounded-xl text-sm w-24 dark:bg-gray-700 dark:text-white"
              onChange={(e) => setPropina(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-2xl mb-6">
          <h2 className="text-lg font-semibold mb-4">Selecciona método de pago</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tarjetas.map(t => (
              <div
                key={t.id}
                onClick={() => setTarjetaSeleccionada(t.id)}
                className={`border rounded-xl p-4 cursor-pointer transition shadow-sm ${tarjetaSeleccionada === t.id ? "border-blue-600 bg-blue-50 dark:bg-blue-900" : "hover:shadow-md"}`}
              >
                <p className="font-semibold">{t.tipo}</p>
                <p>{t.banco}</p>
                <p className="text-sm text-gray-500">{t.numero}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-2xl mb-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={autorizado} onChange={() => setAutorizado(!autorizado)} />
            <span className="text-sm">Autorizo a otra persona a usar mi crédito disponible</span>
          </label>
          {autorizado && <p className="mt-2 text-sm text-gray-400">Se reflejará el uso en tu historial de crédito.</p>}
        </div>

        {referido && (
          <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-2xl mb-6">
            <h2 className="text-lg font-semibold">Tu referido: <span className="text-blue-600">{referido}</span></h2>
            <p className="text-sm text-gray-400">Puntos acumulados por esta persona: {puntosReferido}</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <button
            onClick={pagarOrden}
            disabled={!tarjetaSeleccionada}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-2xl shadow disabled:opacity-50"
          >
            Pagar Orden
          </button>

          <button
            onClick={generarWalletDigital}
            className="bg-black hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-2xl shadow"
          >
            Paga con Apple Pay
          </button>
        </div>
      </>}

      {ordenExitosa && (
        <div className="mt-6 bg-green-100 border border-green-300 text-green-800 p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold">✅ Orden procesada con éxito</h2>
          <p>Gracias por tu compra. Los pagos se realizarán según tu plan seleccionado.</p>
          {walletGenerada && <p>Tu tarjeta fue agregada a Wallet Digital exitosamente. Puedes pagar desde la mesa sin levantarte 🧾</p>}
        </div>
      )}

      <div className="mt-10 bg-white dark:bg-gray-800 shadow p-6 rounded-2xl">
        <h2 className="text-lg font-semibold mb-4">📜 Historial de Transacciones</h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          {historialTransacciones.map((h) => (
            <li key={h.id} className="py-3 flex justify-between">
              <span>{h.fecha} - {h.tipo}</span>
              <span className="text-blue-600 font-medium">${h.monto.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
