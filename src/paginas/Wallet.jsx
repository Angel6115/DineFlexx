import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { BookCheck, Clock, CreditCard } from "lucide-react"

export default function Wallet() {
  const [userId, setUserId] = useState(null)
  const [credit, setCredit] = useState(0)
  const [payments, setPayments] = useState([])

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
      }
    }
    fetchUserData()
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 font-sans">
      <div className="flex items-center gap-4 mb-6">
        <img
          src="/images/foto4.jpg"
          alt="Wallet"
          className="h-12 w-12 rounded-full object-cover shadow"
        />
        <h1 className="text-3xl font-bold tracking-tight text-gray-800">💼 Mi Wallet</h1>
      </div>

      <div className="bg-white shadow rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">💳 Crédito Disponible</h2>
        <p className="text-2xl text-green-600 font-bold">${credit}</p>
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
