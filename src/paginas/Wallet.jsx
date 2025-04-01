import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { BookCheck, Clock, CreditCard } from "lucide-react"

export default function Wallet() {
  const [userId, setUserId] = useState(null)
  const [credit, setCredit] = useState(0)
  const [payments, setPayments] = useState([])
  const [cuotas, setCuotas] = useState(3)
  const [propina, setPropina] = useState(0.2)
  const [totalGastado, setTotalGastado] = useState(0)

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()

      if (!error && user) {
        setUserId(user.id)

        const { data: creditData } = await supabase
          .from("credit")
          .select("amount")
          .eq("user_id", user.id)
          .single()
        if (creditData?.amount) setCredit(creditData.amount)

        const { data: paymentHistory } = await supabase
          .from("payments")
          .select("amount, status, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
        setPayments(paymentHistory || [])

        const total = paymentHistory?.reduce((sum, p) => sum + p.amount, 0) || 0
        setTotalGastado(total)
      }
    }
    fetchUserData()
  }, [])

  const cuotaInicial = totalGastado * propina
  const restante = totalGastado - cuotaInicial
  const pagoPorCuota = (restante / cuotas).toFixed(2)

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 font-sans">
      <div className="flex items-center gap-4 mb-6">
        <img src="/images/logo4.png" alt="Wallet" className="h-12 w-auto object-contain" />
        <h1 className="text-3xl font-bold tracking-tight text-gray-800">DineFlexx Wallet</h1>
      </div>

      <div className="sticky top-4 z-10 bg-white shadow-lg rounded-2xl p-6 mb-8 border border-gray-200">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">💳 Crédito Disponible</h2>
            <p className="text-2xl text-green-600 font-bold mb-2">${credit}</p>
          </div>
          <div className="flex flex-col items-start gap-2">
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-xl shadow hover:scale-105 transition">
              Añadir a Apple Wallet
            </button>
            <p className="text-sm text-gray-500">Tarjeta vinculada: <span className="font-medium text-black">•••• 4242</span></p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🧮 Calculadora de Pagos</h2>
        <div className="mb-2 text-gray-700">Total gastado: <strong>${totalGastado.toFixed(2)}</strong></div>

        <label className="block mb-2 text-sm font-medium">Selecciona método de pago:</label>
        <select
          value={cuotas}
          onChange={(e) => setCuotas(parseInt(e.target.value))}
          className="mb-4 p-2 border rounded-lg shadow-sm"
        >
          <option value={1}>1 cuota mensual</option>
          <option value={2}>2 cuotas mensuales</option>
          <option value={3}>3 cuotas mensuales</option>
          <option value={4}>4 cuotas mensuales</option>
          <option value={4}>4 pagos semanales</option>
        </select>

        <label className="block mb-2 text-sm font-medium">Selecciona propina:</label>
        <select
          value={propina}
          onChange={(e) => setPropina(parseFloat(e.target.value))}
          className="mb-4 p-2 border rounded-lg shadow-sm"
        >
          <option value={0.2}>20%</option>
          <option value={0.25}>25%</option>
          <option value={0.3}>30%</option>
        </select>

        <div className="text-gray-800 space-y-1">
          <p>💰 Cuota inicial: <strong>${cuotaInicial.toFixed(2)}</strong></p>
          <p>📆 Pagos: <strong>{cuotas} x ${pagoPorCuota}</strong></p>
        </div>
      </div>

      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">📜 Historial de Pagos</h2>
        {payments.length === 0 ? (
          <p className="text-gray-500">Aún no has realizado pagos.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {payments.map((pago, i) => (
              <li key={i} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {pago.status === "completed" ? (
                    <BookCheck className="text-green-600 w-5 h-5" />
                  ) : (
                    <Clock className="text-yellow-600 w-5 h-5" />
                  )}
                  <span className="text-gray-800">${pago.amount.toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(pago.created_at).toLocaleDateString()}
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full shadow ${
                    pago.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {pago.status === "completed" ? "Pagado" : "Pendiente"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
