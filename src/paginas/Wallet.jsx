// src/paginas/Wallet.jsx
import { useState, useEffect } from "react"
import { useOrder } from "../context/OrderContext"
import { supabase } from "../supabaseClient"
import DarkModeToggle from "../components/DarkModeToggle"
import toast, { Toaster } from "react-hot-toast"
import { motion } from "framer-motion"

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto p-6 font-sans bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen"
    >
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

      {/* El resto del contenido como antes (resumen, cuotas, tarjetas, botones, historial...) */}
      {/* Ya presente en tu código anterior, puedes seguir desde aquí si deseas añadir más */}
    </motion.div>
  )
}
