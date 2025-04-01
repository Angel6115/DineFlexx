import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

export default function Dashboard() {
  const [userName, setUserName] = useState("")
  const [credit, setCredit] = useState(0)
  const [points, setPoints] = useState(0)

  useEffect(() => {
    const fetchUserInfo = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()

      if (!error && user) {
        setUserName(user.email)

        const { data: creditData } = await supabase
          .from("credit")
          .select("amount")
          .eq("user_id", user.id)
          .single()
        if (creditData) {
          setCredit(creditData.amount)
        }

        const { data: pointData } = await supabase
          .from("puntos")
          .select("puntos")
          .eq("user_id", user.id)
          .single()
        if (pointData) {
          setPoints(pointData.puntos)
        }
      }
    }

    fetchUserInfo()
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">👋 Bienvenido a DineFlexx</h1>

      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Usuario</h2>
        <p className="text-gray-700">{userName}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-green-50 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">💰 Crédito Disponible</h3>
          <p className="text-3xl font-bold text-green-600">${credit.toFixed(2)}</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">🎁 Puntos Acumulados</h3>
          <p className="text-3xl font-bold text-blue-600">{points}</p>
        </div>
      </div>
    </div>
  )
}
