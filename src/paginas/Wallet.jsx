// src/paginas/Wallet.jsx
import { useState, useEffect } from "react"
import { useOrder } from "../context/OrderContext"
import { supabase } from "../supabaseClient"
import DarkModeToggle from "../components/DarkModeToggle"
import toast, { Toaster } from "react-hot-toast"

const tarjetas = [
  { id: 1, tipo: "Débito", banco: "Banco Nacional", numero: "**** 1234" },
  { id: 2, tipo: "Cuenta de Cheques", banco: "Interbank", numero: "**** 5678" },
  { id: 3, tipo: "ATH Móvil", banco: "ATH PR", numero: "ath@cliente" }
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
  const [confirmarAutorizado, setConfirmarAutorizado] = useState(false)
  const [walletGenerada, setWalletGenerada] = useState(false)
  const [ordenExitosa, setOrdenExitosa] = useState(false)
  const [propina, setPropina] = useState(0.18)
  const [nombreAutorizado, setNombreAutorizado] = useState("")
  const [userId, setUserId] = useState(null)
  const [autorizaciones, setAutorizaciones] = useState([])

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        setUserId(data.user.id)
        fetchAutorizaciones(data.user.id)
      }
    }
    fetchUser()
  }, [])

  const fetchAutorizaciones = async (uid) => {
    const { data } = await supabase
      .from("autorizados")
      .select("nombre, monto, created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
    if (data) setAutorizaciones(data)
  }

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
    toast.success("Orden pagada correctamente ✅")
  }

  const generarWalletDigital = () => {
    setWalletGenerada(true)
    setOrdenExitosa(true)
    toast.success("Tarjeta digital agregada a Wallet ✅")
  }

  const confirmarAutorizacion = async () => {
    setConfirmarAutorizado(false)
    if (!userId || !nombreAutorizado || totalConFee === 0) return
    const { error } = await supabase.from("autorizados").insert({
      user_id: userId,
      nombre: nombreAutorizado,
      monto: totalConFee
    })
    if (!error) {
      toast.success(`Crédito autorizado a ${nombreAutorizado}`)
      fetchAutorizaciones(userId)
    } else {
      toast.error("Error al autorizar crédito")
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <img src="/images/logo3.jpg" alt="DineFlexx" className="h-16 w-16 object-contain" />
          <h1 className="text-3xl font-bold">Wallet DineFlexx</h1>
        </div>
        <DarkModeToggle />
      </div>

      {confirmarAutorizado && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-4">Confirmar Autorización</h2>
            <p className="mb-2 text-sm">Estás autorizando a otra persona a usar tu crédito. Por favor confirma:</p>
            <input
              type="text"
              value={nombreAutorizado}
              onChange={(e) => setNombreAutorizado(e.target.value)}
              placeholder="Nombre de la persona autorizada"
              className="w-full mb-4 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            <p className="text-sm mb-2">Monto total autorizado: <strong>${totalConFee.toFixed(2)}</strong></p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmarAutorizado(false)} className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-sm">Cancelar</button>
              <button onClick={confirmarAutorizacion} className="px-4 py-2 rounded-md bg-green-600 text-white text-sm">Confirmar</button>
            </div>
          </div>
        </div>
      )}

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
          <input type="checkbox" checked={autorizado} onChange={() => {
            setAutorizado(!autorizado)
            if (!autorizado) setConfirmarAutorizado(true)
          }} />
          <span className="text-sm">Autorizo a otra persona a usar mi crédito disponible</span>
        </label>
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

      <div className="mt-10 bg-white dark:bg-gray-800 shadow p-6 rounded-2xl">
        <h2 className="text-lg font-semibold mb-4">📜 Historial de Autorizaciones</h2>
        {autorizaciones.length === 0 ? (
          <p className="text-sm text-gray-500">No hay registros aún.</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            {autorizaciones.map((a, i) => (
              <li key={i} className="py-3 flex justify-between">
                <span>{a.created_at?.slice(0, 10)} - Autorizado a: {a.nombre}</span>
                <span className="text-blue-600 font-medium">${typeof a.monto === "number" ? a.monto.toFixed(2) : "0.00"}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
