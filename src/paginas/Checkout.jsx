import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function Checkout() {
  const [user, setUser] = useState(null)
  const [credit, setCredit] = useState(0)
  const [cartTotal, setCartTotal] = useState(100) // Simulación del total de compra
  const [fee, setFee] = useState(0)
  const [totalWithFee, setTotalWithFee] = useState(0)
  const [plan, setPlan] = useState("semanal")
  const [installments, setInstallments] = useState([])

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      setUser(user)

      const { data } = await supabase
        .from("credit")
        .select("amount")
        .eq("user_id", user.id)
        .single()

      if (data) setCredit(data.amount)
    }

    fetchUser()
  }, [])

  useEffect(() => {
    const calculatedFee = cartTotal * 0.2
    const total = cartTotal + calculatedFee
    setFee(calculatedFee)
    setTotalWithFee(total)

    if (plan === "semanal") {
      const cuota = (total - calculatedFee).toFixed(2) / 4
      setInstallments([calculatedFee.toFixed(2), ...Array(4).fill(cuota.toFixed(2))])
    } else {
      const cuota = (total - calculatedFee).toFixed(2) / 6
      setInstallments([calculatedFee.toFixed(2), ...Array(6).fill(cuota.toFixed(2))])
    }
  }, [cartTotal, plan])

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6">💳 Confirmación de Pago</h1>

      <div className="bg-white shadow rounded-2xl p-6 mb-4">
        <p className="text-gray-700 text-lg mb-2">
          Crédito Disponible: <span className="text-green-600 font-bold">${credit}</span>
        </p>
        <p className="text-gray-700 text-lg mb-2">
          Total de la orden: <span className="font-semibold">${cartTotal}</span>
        </p>
        <p className="text-gray-700 text-lg mb-2">
          Cargo por servicio (20%):{" "}
          <span className="font-semibold text-red-500">${fee.toFixed(2)}</span>
        </p>
        <p className="text-gray-800 text-xl font-bold">
          Total a pagar: ${totalWithFee.toFixed(2)}
        </p>
      </div>

      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">🧾 Elegir plan de pago:</h2>
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          className="border rounded-lg p-2 w-full"
        >
          <option value="semanal">4 Semanas</option>
          <option value="mensual">6 Meses</option>
        </select>

        <h3 className="mt-4 font-semibold">Distribución de pagos:</h3>
        <ul className="list-disc list-inside text-gray-600">
          {installments.map((amt, i) => (
            <li key={i}>
              {i === 0 ? "Pago inicial (20%)" : `Cuota ${i}`} - ${amt}
            </li>
          ))}
        </ul>
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow">
        Confirmar y pagar primer 20%
      </button>
    </div>
  )
}
