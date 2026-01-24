// src/paginas/Wallet.jsx
import { useState, useEffect } from "react"
import { useOrder } from "../context/OrderContext"
import supabase from "../supabaseClient"
import toast, { Toaster } from "react-hot-toast"
import { motion } from "framer-motion"
import {
  Wallet as WalletIcon,
  TrendingUp,
  TrendingDown,
  Clock,
  CreditCard,
  ShoppingCart,
  Calendar,
  DollarSign,
  Plus,
  Copy,
  X,
  QrCode,
  Share2,
  CheckCircle,
  XCircle,
} from "lucide-react"
import QRCode from "qrcode"
import { crearNotificacion } from '../utils/notifications'

const tarjetas = [
  { id: 1, tipo: "Débito", banco: "Banco Nacional", numero: "**** 1234" },
  { id: 2, tipo: "Cuenta de Cheques", banco: "Interbank", numero: "**** 5678" },
  { id: 3, tipo: "ATH Móvil", banco: "ATH PR", numero: "ath@cliente" }
]

export default function Wallet() {
  const { 
    orden, 
    total: initialTotal, 
    credit: initialCredit, 
    puntos, 
    referido, 
    puntosReferido 
  } = useOrder()

  // Tab state
  const [activeTab, setActiveTab] = useState("pagar")

  // Estado original "Pagar Orden"
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

  // Estado nuevo "Historial"
  const [wallet, setWallet] = useState({ balance: 0 })
  const [transactions, setTransactions] = useState([])
  const [upcomingPayments, setUpcomingPayments] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [loading, setLoading] = useState(true)

  // Estado para tarjetas virtuales
  const [virtualCards, setVirtualCards] = useState([])
  const [showCreateCardModal, setShowCreateCardModal] = useState(false)
  const [newCardAmount, setNewCardAmount] = useState(100)
  const [newCardName, setNewCardName] = useState("")
  const [creatingCard, setCreatingCard] = useState(false)

  // Estado para compartir crédito QR
  const [sharedCredits, setSharedCredits] = useState([])
  const [showCreateQRModal, setShowCreateQRModal] = useState(false)
  const [qrAmount, setQrAmount] = useState(50)
  const [qrAssignedTo, setQrAssignedTo] = useState("")
  const [qrExpiration, setQrExpiration] = useState(7)
  const [creatingQR, setCreatingQR] = useState(false)
  const [generatedQR, setGeneratedQR] = useState(null)

  useEffect(() => {
    setTotal(initialTotal)
    setCredit(initialCredit)
  }, [initialTotal, initialCredit])

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        setUserId(data.user.id)
        fetchAutorizaciones(data.user.id)
        loadWalletData(data.user.id)
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

  // Cargar datos del wallet
  const loadWalletData = async (uid) => {
    await Promise.all([
      loadWallet(uid),
      loadTransactions(uid),
      loadUpcomingPayments(uid),
      loadPaymentMethods(uid),
      loadVirtualCards(uid),
      loadSharedCredits(uid),
    ])
    setLoading(false)
  }

  const loadWallet = async (uid) => {
    const { data } = await supabase
      .from("digital_wallet")
      .select("balance")
      .eq("user_id", uid)
      .maybeSingle()
    if (data) setWallet({ balance: data.balance })
  }

  const loadTransactions = async (uid) => {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(10)
    setTransactions(data || [])
  }

  const loadUpcomingPayments = async (uid) => {
    const { data } = await supabase
      .from("installments")
      .select("*")
      .eq("status", "pending")
      .gte("due_date", new Date().toISOString().split("T")[0])
      .order("due_date", { ascending: true })
      .limit(5)
    setUpcomingPayments(data || [])
  }

  const loadPaymentMethods = async (uid) => {
    const { data } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("user_id", uid)
      .order("is_default", { ascending: false })
    setPaymentMethods(data || [])
  }

  const loadVirtualCards = async (uid) => {
    const { data } = await supabase
      .from("virtual_cards")
      .select("*")
      .eq("user_id", uid)
      .eq("status", "active")
      .order("created_at", { ascending: false })
    setVirtualCards(data || [])
  }

  const loadSharedCredits = async (uid) => {
    const { data } = await supabase
      .from("shared_credits")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
    setSharedCredits(data || [])
  }

  // 👇 FUNCIÓN CORREGIDA
  const pagarCuota = async (payment) => {
    if (wallet.balance < payment.amount) {
      toast.error('Balance insuficiente para pagar esta cuota')
      return
    }

    const toastId = toast.loading('Procesando pago...')

    try {
      // 1. Marcar installment como pagado
      const { error: installmentError } = await supabase
        .from('installments')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', payment.id)

      if (installmentError) throw installmentError

      // 2. Actualizar balance
      const newBalance = wallet.balance - payment.amount

      const { error: walletError } = await supabase
        .from('digital_wallet')
        .update({ balance: newBalance })
        .eq('user_id', userId)

      if (walletError) throw walletError

      // 3. Buscar order_id del plan
      const { data: planData } = await supabase
        .from('financing_plans')
        .select('order_id')
        .eq('id', payment.plan_id)
        .single()

      // 4. Crear transacción ✅ CORREGIDO
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'payment',  // ✅ CORRECTO (sin "_received")
          amount: payment.amount,
          description: `Cuota ${payment.sequence} pagada`,
          status: 'completed',
          order_id: planData?.order_id || null
        })

      if (txError) throw txError

      setWallet({ balance: newBalance })
      setUpcomingPayments(prev => prev.filter(p => p.id !== payment.id))
      setCredit(newBalance)
      await loadTransactions(userId)
      toast.success('Cuota pagada exitosamente!', { id: toastId })

    } catch (error) {
      console.error('Error al pagar cuota:', error)
      toast.error('Error al procesar el pago', { id: toastId })
    }
  }

  const crearTarjetaVirtual = async () => {
    if (newCardAmount <= 0) {
      toast.error("El monto debe ser mayor a 0")
      return
    }
    if (newCardAmount > wallet.balance) {
      toast.error("Monto supera el balance disponible")
      return
    }

    setCreatingCard(true)
    const toastId = toast.loading("Creando tarjeta virtual...")

    try {
      const cardNumber = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join("")
      const cvv = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join("")
      const expDate = new Date()
      expDate.setFullYear(expDate.getFullYear() + 2)
      const expirationDate = `${(expDate.getMonth() + 1).toString().padStart(2, "0")}/${expDate.getFullYear().toString().slice(-2)}`

      const { data, error } = await supabase
        .from("virtual_cards")
        .insert({
          user_id: userId,
          card_number: cardNumber,
          cvv: cvv,
          expiration_date: expirationDate,
          credit_amount: newCardAmount,
          used_amount: 0,
          status: "active",
          assigned_to: newCardName || null
        })
        .select()
        .single()

      if (error) throw error

      const newBalance = wallet.balance - newCardAmount

      const { error: walletError } = await supabase
        .from("digital_wallet")
        .update({ balance: newBalance })
        .eq("user_id", userId)

      if (walletError) throw walletError

      await supabase
        .from("transactions")
        .insert({
          user_id: userId,
          type: 'purchase',
          amount: newCardAmount,
          description: `Tarjeta virtual creada${newCardName ? ` para ${newCardName}` : ''}`,
          status: 'completed'
        })

      setWallet({ balance: newBalance })
      setCredit(newBalance)
      await loadVirtualCards(userId)
      await loadTransactions(userId)
      setShowCreateCardModal(false)
      setNewCardAmount(100)
      setNewCardName("")
      toast.success("Tarjeta virtual creada exitosamente!", { id: toastId })

    } catch (error) {
      console.error("Error creando tarjeta:", error)
      toast.error("Error al crear tarjeta virtual", { id: toastId })
    } finally {
      setCreatingCard(false)
    }
  }

  const crearQRCredito = async () => {
    if (qrAmount <= 0) {
      toast.error("El monto debe ser mayor a 0")
      return
    }
    if (qrAmount > wallet.balance) {
      toast.error("Monto supera el balance disponible")
      return
    }

    setCreatingQR(true)
    const toastId = toast.loading("Generando QR...")

    try {
      const code = `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      const expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + qrExpiration)

      const { data, error } = await supabase
        .from("shared_credits")
        .insert({
          user_id: userId,
          code: code,
          amount: qrAmount,
          assigned_to: qrAssignedTo || null,
          expiration_date: expirationDate.toISOString().split("T")[0],
          status: "active"
        })
        .select()
        .single()

      if (error) throw error

      const newBalance = wallet.balance - qrAmount

      const { error: walletError } = await supabase
        .from("digital_wallet")
        .update({ balance: newBalance })
        .eq("user_id", userId)

      if (walletError) throw walletError

      await supabase
        .from("transactions")
        .insert({
          user_id: userId,
          type: 'purchase',
          amount: qrAmount,
          description: `Crédito compartido${qrAssignedTo ? ` para ${qrAssignedTo}` : ''}`,
          status: 'completed'
        })

      const qrDataURL = await QRCode.toDataURL(code, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })

      setWallet({ balance: newBalance })
      setCredit(newBalance)
      await loadSharedCredits(userId)
      await loadTransactions(userId)
      setGeneratedQR({ ...data, qrImage: qrDataURL })
      setQrAmount(50)
      setQrAssignedTo("")
      setQrExpiration(7)
      toast.success("QR generado exitosamente!", { id: toastId })

    } catch (error) {
      console.error("Error creando QR:", error)
      toast.error("Error al generar QR", { id: toastId })
    } finally {
      setCreatingQR(false)
    }
  }

  const copiarAlPortapapeles = (texto, tipo) => {
    navigator.clipboard.writeText(texto)
    toast.success(`${tipo} copiado al portapapeles`)
  }

  const compartirQR = async (qr) => {
    try {
      const qrDataURL = await QRCode.toDataURL(qr.code, {
        width: 600,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })

      const blob = await (await fetch(qrDataURL)).blob()
      const file = new File([blob], `dineflexx-qr-${qr.code}.png`, { type: 'image/png' })

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'DineFlexx - Crédito Compartido',
          text: `Te comparto ${formatCurrency(qr.amount)} en crédito DineFlexx`,
          files: [file]
        })
        toast.success('QR compartido exitosamente')
      } else {
        const link = document.createElement('a')
        link.href = qrDataURL
        link.download = `dineflexx-qr-${qr.code}.png`
        link.click()
        toast.success('QR descargado. Compártelo manualmente')
      }
    } catch (error) {
      console.error("Error compartiendo QR:", error)
      copiarAlPortapapeles(qr.code, 'Código QR')
    }
  }

  const cancelarQR = async (qrId) => {
    const toastId = toast.loading("Cancelando QR...")

    try {
      const qr = sharedCredits.find(q => q.id === qrId)

      const { error } = await supabase
        .from("shared_credits")
        .update({ status: "cancelled" })
        .eq("id", qrId)

      if (error) throw error

      const newBalance = wallet.balance + qr.amount

      await supabase
        .from("digital_wallet")
        .update({ balance: newBalance })
        .eq("user_id", userId)

      setWallet({ balance: newBalance })
      setCredit(newBalance)
      await loadSharedCredits(userId)
      toast.success("QR cancelado y crédito devuelto", { id: toastId })

    } catch (error) {
      console.error("Error cancelando QR:", error)
      toast.error("Error al cancelar QR", { id: toastId })
    }
  }

  const usarQREnRestaurante = async (qrId) => {
    const toastId = toast.loading("Procesando QR...")

    try {
      const qr = sharedCredits.find(q => q.id === qrId)
      if (!qr) {
        toast.error("QR no encontrado", { id: toastId })
        return
      }

      const { error: updateError } = await supabase
        .from("shared_credits")
        .update({ status: "used", used_at: new Date().toISOString() })
        .eq("id", qrId)

      if (updateError) throw updateError

      await crearNotificacion({
        userId: qr.user_id,
        type: 'qr_used',
        title: '✅ QR Usado',
        message: `Tu QR de ${formatCurrency(qr.amount)} fue usado exitosamente`,
        relatedId: qrId
      })

      await loadSharedCredits(userId)
      toast.success("QR usado correctamente", { id: toastId })

    } catch (error) {
      console.error("Error usando QR:", error)
      toast.error("Error al procesar QR", { id: toastId })
    }
  }

  const fee = total * 0.2
  const propinaTotal = total * propina
  const totalConFee = total + fee + propinaTotal
  const puntosGenerados = Math.floor(total / 2)

  const cuotas = tipoPago === "mensual"
    ? Array.from({ length: 6 }, () => totalConFee / 6)
    : Array.from({ length: 8 }, () => totalConFee / 8)

  const pagarOrden = () => {
    setCredit(prev => prev - totalConFee)
    setOrdenExitosa(true)
    toast.success("Orden pagada correctamente")
  }

  const generarWalletDigital = () => {
    setWalletGenerada(true)
    setOrdenExitosa(true)
    toast.success("Tarjeta digital agregada a Wallet")
  }

  const confirmarAutorizacion = async () => {
    setConfirmarAutorizado(false)
    if (!userId || !nombreAutorizado || totalConFee <= 0) return

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

  const formatCurrency = (v) =>
    new Intl.NumberFormat("es-PR", { style: "currency", currency: "USD" }).format(v)

  const getTransactionIcon = (type) => {
    switch (type) {
      case "purchase": return <TrendingDown className="text-red-500" size={20} />
      case "payment": return <TrendingDown className="text-orange-500" size={20} />
      case "credit":
      case "refund": return <TrendingUp className="text-green-500" size={20} />
      default: return <DollarSign size={20} />
    }
  }

  const getTransactionColor = (type) =>
    ["credit", "refund"].includes(type) ? "text-green-600" : "text-red-600"

  const getTransactionSign = (type) =>
    ["credit", "refund"].includes(type) ? "+" : "-"

  const formatCardNumber = (number) => number.match(/.{1,4}/g).join(" ")

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700"
      case "used": return "bg-blue-100 text-blue-700"
      case "expired": return "bg-gray-100 text-gray-700"
      case "cancelled": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "active": return "Activo"
      case "used": return "Usado"
      case "expired": return "Expirado"
      case "cancelled": return "Cancelado"
      default: return status
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto p-6 font-sans bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen"
    >
      <Toaster position="top-center" reverseOrder={false} />

      {/* Modal Confirmación Autorización */}
      {confirmarAutorizado && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-4">Confirmar Autorización</h2>
            <p className="mb-2 text-sm">
              Estás autorizando a otra persona a usar tu crédito. Por favor confirma:
            </p>
            <input
              type="text"
              value={nombreAutorizado}
              onChange={(e) => setNombreAutorizado(e.target.value)}
              placeholder="Nombre de la persona autorizada"
              className="w-full mb-4 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
            <p className="text-sm mb-2">
              Monto total autorizado: <strong>${totalConFee.toFixed(2)}</strong>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmarAutorizado(false)}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarAutorizacion}
                className="px-4 py-2 rounded-md bg-green-600 text-white text-sm"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Tarjeta Virtual */}
      {showCreateCardModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-xl relative"
          >
            <button
              onClick={() => setShowCreateCardModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-4">Crear Tarjeta Virtual</h2>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Monto de la tarjeta
              </label>
              <input
                type="number"
                value={newCardAmount}
                onChange={(e) => setNewCardAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="100.00"
                min="1"
                max={wallet.balance}
              />
              <p className="text-xs text-gray-500 mt-1">
                Balance disponible: {formatCurrency(wallet.balance)}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Asignar a (opcional)
              </label>
              <input
                type="text"
                value={newCardName}
                onChange={(e) => setNewCardName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Nombre de la persona"
              />
              <p className="text-xs text-gray-500 mt-1">
                Deja vacío si es para tu uso personal
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateCardModal(false)}
                className="flex-1 px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={crearTarjetaVirtual}
                disabled={creatingCard || newCardAmount <= 0 || newCardAmount > wallet.balance}
                className="flex-1 px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold"
              >
                {creatingCard ? "Creando..." : "Crear Tarjeta"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Crear QR */}
      {showCreateQRModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-xl relative"
          >
            <button
              onClick={() => setShowCreateQRModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-4">Compartir Crédito con QR</h2>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Monto a compartir
              </label>
              <input
                type="number"
                value={qrAmount}
                onChange={(e) => setQrAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="50.00"
                min="1"
                max={wallet.balance}
              />
              <p className="text-xs text-gray-500 mt-1">
                Balance disponible: {formatCurrency(wallet.balance)}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Para quién (opcional)
              </label>
              <input
                type="text"
                value={qrAssignedTo}
                onChange={(e) => setQrAssignedTo(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Nombre de la persona"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Vigencia (días)
              </label>
              <select
                value={qrExpiration}
                onChange={(e) => setQrExpiration(parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="1">1 día</option>
                <option value="3">3 días</option>
                <option value="7">1 semana</option>
                <option value="14">2 semanas</option>
                <option value="30">1 mes</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateQRModal(false)}
                className="flex-1 px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={crearQRCredito}
                disabled={creatingQR || qrAmount <= 0 || qrAmount > wallet.balance}
                className="flex-1 px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold"
              >
                {creatingQR ? "Generando..." : "Generar QR"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal QR Generado */}
      {generatedQR && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-xl relative"
          >
            <button
              onClick={() => setGeneratedQR(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">¡QR Generado!</h2>

            <div className="bg-white p-4 rounded-lg mb-4 flex justify-center">
              <img src={generatedQR.qrImage} alt="QR Code" className="w-64 h-64" />
            </div>

            <div className="mb-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Código</p>
              <p className="font-mono font-bold text-lg">{generatedQR.code}</p>
            </div>

            <div className="mb-4 text-center">
              <p className="text-2xl font-bold text-green-600">{formatCurrency(generatedQR.amount)}</p>
              {generatedQR.assigned_to && (
                <p className="text-sm text-gray-600">Para {generatedQR.assigned_to}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => compartirQR(generatedQR)}
                className="flex-1 px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2"
              >
                <Share2 size={20} />
                Compartir
              </button>
              <button
                onClick={() => setGeneratedQR(null)}
                className="flex-1 px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <button
          onClick={() => setActiveTab("pagar")}
          className={`px-6 py-3 font-semibold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === "pagar"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <ShoppingCart size={20} />
          Pagar Orden
        </button>
        <button
          onClick={() => setActiveTab("historial")}
          className={`px-6 py-3 font-semibold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === "historial"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <WalletIcon size={20} />
          Historial
        </button>
        <button
          onClick={() => setActiveTab("tarjetas")}
          className={`px-6 py-3 font-semibold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === "tarjetas"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <CreditCard size={20} />
          Tarjetas Virtuales
        </button>
        <button
          onClick={() => setActiveTab("compartir")}
          className={`px-6 py-3 font-semibold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === "compartir"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <QrCode size={20} />
          Compartir Crédito
        </button>
        <button
          onClick={() => setActiveTab("metodos")}
          className={`px-6 py-3 font-semibold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === "metodos"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <CreditCard size={20} />
          Métodos de Pago
        </button>
      </div>

      {/* TAB: PAGAR ORDEN */}
      {activeTab === "pagar" && (
        !orden || orden.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold">Tu orden está vacía</h2>
            <p className="text-gray-500">Agrega productos desde el menú</p>
          </div>
        ) : (
          <div>
            <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-2xl mb-6">
              <h2 className="text-xl font-semibold mb-2">Resumen de Pago</h2>
              <p>Total de la orden: <span className="font-medium">${total.toFixed(2)}</span></p>
              <p>Fee DineFlexx (20%): <span className="font-medium">${fee.toFixed(2)}</span></p>
              <p>Propina ({(propina * 100).toFixed(0)}%): <span className="font-medium">${propinaTotal.toFixed(2)}</span></p>
              <p>Total a pagar: <span className="font-bold text-blue-600">${totalConFee.toFixed(2)}</span></p>
              <p>Crédito disponible: <span className="text-green-600 font-semibold">${credit.toFixed(2)}</span></p>
              <p>Puntos por esta compra: <span className="text-purple-600 font-semibold">{puntosGenerados}</span></p>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-2xl mb-6">
              <h2 className="text-lg font-semibold mb-2">Selecciona tipo de pago</h2>
              <div className="flex gap-4 mb-4">
                <button
                  className={`px-4 py-2 rounded-full border ${
                    tipoPago === "mensual" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700"
                  }`}
                  onClick={() => setTipoPago("mensual")}
                >
                  Mensual (6 cuotas)
                </button>
                <button
                  className={`px-4 py-2 rounded-full border ${
                    tipoPago === "semanal" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700"
                  }`}
                  onClick={() => setTipoPago("semanal")}
                >
                  Semanal (8 cuotas)
                </button>
              </div>
              <ul className="text-sm list-disc list-inside">
                {cuotas.map((c, i) => (
                  <li key={i}>Cuota {i + 1}: ${c.toFixed(2)}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-2xl mb-6">
              <h2 className="text-lg font-semibold mb-4">Selecciona método de pago</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tarjetas.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setTarjetaSeleccionada(t.id)}
                    className={`border rounded-xl p-4 cursor-pointer transition shadow-sm ${
                      tarjetaSeleccionada === t.id
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900"
                        : "hover:shadow-md"
                    }`}
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
                <input
                  type="checkbox"
                  checked={autorizado}
                  onChange={() => {
                    setAutorizado(!autorizado)
                    if (!autorizado) setConfirmarAutorizado(true)
                  }}
                />
                <span className="text-sm">Autorizo a otra persona a usar mi crédito disponible</span>
              </label>
            </div>

            {referido && (
              <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-2xl mb-6">
                <h2 className="text-lg font-semibold">
                  Tu referido: <span className="text-blue-600">{referido}</span>
                </h2>
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
              <h2 className="text-lg font-semibold mb-4"> Historial de Autorizaciones</h2>
              {autorizaciones.length === 0 ? (
                <p className="text-sm text-gray-500">No hay registros aún.</p>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                  {autorizaciones.map((a, i) => (
                    <li key={i} className="py-3 flex justify-between">
                      <span>{a.created_at.slice(0, 10)} - Autorizado a {a.nombre}</span>
                      <span className="text-blue-600 font-medium">${a.monto.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )
      )}

      {/* TAB: HISTORIAL */}
      {activeTab === "historial" && (
        <div>
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-8 rounded-2xl shadow-xl mb-8">
            <p className="text-sm opacity-90 mb-2">Balance Disponible</p>
            <h2 className="text-5xl font-bold mb-4">{formatCurrency(wallet.balance)}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Clock size={24} className="text-orange-500" />
                Próximos Pagos
              </h2>

              {upcomingPayments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No tienes pagos pendientes
                </p>
              ) : (
                <ul className="space-y-3">
                  {upcomingPayments.map((payment) => (
                    <motion.li
                      key={payment.id}
                      whileHover={{ scale: 1.02 }}
                      className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">Cuota {payment.sequence}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(payment.due_date).toLocaleDateString("es-PR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <p className="font-bold text-lg">{formatCurrency(payment.amount)}</p>
                          {wallet.balance >= payment.amount ? (
                            <p className="text-xs text-green-600">Balance suficiente</p>
                          ) : (
                            <p className="text-xs text-red-600">Balance insuficiente</p>
                          )}
                        </div>
                        <button
                          onClick={() => pagarCuota(payment)}
                          disabled={wallet.balance < payment.amount}
                          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1"
                        >
                          Pagar
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </section>

            <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Transacciones Recientes</h2>

              {transactions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No tienes transacciones aún</p>
              ) : (
                <div className="space-y-2">
                  {transactions.slice(0, 5).map((tx) => (
                    <div
                      key={tx.id}
                      className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(tx.type)}
                        <div>
                          <p className="font-semibold text-sm">{tx.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(tx.created_at).toLocaleDateString("es-PR")}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className={`font-bold ${getTransactionColor(tx.type)}`}>
                          {getTransactionSign(tx.type)}{formatCurrency(tx.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {/* TAB: TARJETAS VIRTUALES */}
      {activeTab === "tarjetas" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Mis Tarjetas Virtuales</h2>
            <button
              onClick={() => setShowCreateCardModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              Crear Tarjeta
            </button>
          </div>

          {virtualCards.length === 0 ? (
            <div className="text-center py-20">
              <CreditCard size={64} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No tienes tarjetas virtuales</h3>
              <p className="text-gray-500 mb-6">
                Crea una tarjeta virtual para compartir crédito o usar en cualquier lugar
              </p>
              <button
                onClick={() => setShowCreateCardModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Crear Mi Primera Tarjeta
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {virtualCards.map((card) => (
                <motion.div
                  key={card.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 rounded-xl shadow-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>

                  <div className="mb-8">
                    <p className="text-xs opacity-70 mb-1">DINEFLEXX VIRTUAL</p>
                    {card.assigned_to && (
                      <p className="text-sm font-semibold">Para {card.assigned_to}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <p className="text-2xl font-mono tracking-wider mb-2">
                      {formatCardNumber(card.card_number)}
                    </p>
                    <button
                      onClick={() => copiarAlPortapapeles(card.card_number, 'Número de tarjeta')}
                      className="text-xs opacity-70 hover:opacity-100 flex items-center gap-1"
                    >
                      <Copy size={12} />
                      Copiar número
                    </button>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-70">VENCE</p>
                      <p className="font-semibold">{card.expiration_date}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-70">CVV</p>
                      <p className="font-semibold">{card.cvv}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-70">BALANCE</p>
                      <p className="text-lg font-bold">{formatCurrency(card.remaining_amount)}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white border-opacity-20">
                    <div className="flex gap-2">
                      <button className="flex-1 bg-white bg-opacity-10 hover:bg-opacity-20 py-2 rounded-lg text-sm font-semibold transition">
                        Apple Pay
                      </button>
                      <button className="flex-1 bg-white bg-opacity-10 hover:bg-opacity-20 py-2 rounded-lg text-sm font-semibold transition">
                        Google Pay
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: COMPARTIR CRÉDITO */}
      {activeTab === "compartir" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Compartir Crédito con QR</h2>
            <button
              onClick={() => setShowCreateQRModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              Generar QR
            </button>
          </div>

          {sharedCredits.length === 0 ? (
            <div className="text-center py-20">
              <QrCode size={64} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No has compartido crédito aún</h3>
              <p className="text-gray-500 mb-6">
                Genera un QR para compartir crédito con amigos o familiares
              </p>
              <button
                onClick={() => setShowCreateQRModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Generar Mi Primer QR
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sharedCredits.map((qr) => (
                <motion.div
                  key={qr.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(qr.amount)}</p>
                      {qr.assigned_to && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">Para {qr.assigned_to}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(qr.status)}`}>
                      {getStatusText(qr.status)}
                    </span>
                  </div>

                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Código</p>
                    <p className="font-mono font-semibold text-sm">{qr.code}</p>
                  </div>

                  <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <p className="flex items-center gap-2">
                      <Calendar size={14} />
                      Vence: {new Date(qr.expiration_date).toLocaleDateString("es-PR")}
                    </p>
                    <p className="flex items-center gap-2 mt-1">
                      <Clock size={14} />
                      Creado: {new Date(qr.created_at).toLocaleDateString("es-PR")}
                    </p>
                  </div>

                  {qr.status === "active" && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => compartirQR(qr)}
                          className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1"
                        >
                          <QrCode size={16} />
                          QR
                        </button>
                        <button
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: 'DineFlexx - Crédito',
                                text: `Código: ${qr.code} - ${formatCurrency(qr.amount)}`
                              })
                            } else {
                              copiarAlPortapapeles(qr.code, 'Código')
                            }
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1"
                        >
                          <Share2 size={16} />
                          Código
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => cancelarQR(qr.id)}
                          className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1"
                        >
                          <XCircle size={16} />
                          Cancelar
                        </button>
                        <button
                          onClick={() => usarQREnRestaurante(qr.id)}
                          className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1"
                        >
                          <CheckCircle size={16} />
                          Usar (Test)
                        </button>
                      </div>
                    </div>
                  )}

                  {qr.status === "used" && qr.used_at && (
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900 rounded text-xs text-blue-700 dark:text-blue-300">
                      <CheckCircle size={14} className="inline mr-1" />
                      Usado el {new Date(qr.used_at).toLocaleDateString("es-PR")}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: MÉTODOS DE PAGO */}
      {activeTab === "metodos" && (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <CreditCard size={24} className="text-blue-500" />
            Métodos de Pago
          </h2>

          {paymentMethods.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tienes métodos de pago guardados</p>
          ) : (
            <ul className="space-y-3">
              {paymentMethods.map((method) => (
                <li
                  key={method.id}
                  className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard size={24} className="text-gray-600 dark:text-gray-300" />
                    <div>
                      <p className="font-semibold">
                        {method.brand} •••• {method.last_four}
                      </p>
                      {method.is_default && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Predeterminada
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <button className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
            Añadir Método de Pago
          </button>
        </section>
      )}
    </motion.div>
  )
}
