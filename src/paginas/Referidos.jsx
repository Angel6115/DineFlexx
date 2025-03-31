import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function Referidos() {
  const [userId, setUserId] = useState(null)
  const [refCode, setRefCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [referrals, setReferrals] = useState(0)
  const [points, setPoints] = useState(0)
  const [aiMessage, setAiMessage] = useState("")
  const [userInput, setUserInput] = useState("")
  const [loadingAi, setLoadingAi] = useState(false)
  const [credit, setCredit] = useState(0)
  const [creditUsed, setCreditUsed] = useState(0)

  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()
      if (!error && user) {
        setUserId(user.id)
        setRefCode(user.id.slice(0, 8).toUpperCase())

        const { count } = await supabase
          .from("referrals")
          .select("id", { count: "exact" })
          .eq("referrer_id", user.id)

        if (typeof count === "number") setReferrals(count)

        const { data: pointData } = await supabase
          .from("points")
          .select("total")
          .eq("user_id", user.id)
          .single()

        if (pointData?.total !== undefined) setPoints(pointData.total)

        const { data: creditData } = await supabase
          .from("credit")
          .select("amount, used")
          .eq("user_id", user.id)
          .single()

        if (creditData) {
          setCredit(creditData.amount ?? 0)
          setCreditUsed(creditData.used ?? 0)
        }
      }
    }
    getUserData()
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(refCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleAiSubmit = async (e) => {
    e.preventDefault()
    setLoadingAi(true)
    setAiMessage("Pensando en tu recomendación...")

    setTimeout(() => {
      setAiMessage("🍝 Recomendación: Prueba una pasta mediterránea con maridaje de vino blanco si estás en clima cálido.")
      setLoadingAi(false)
    }, 1500)
  }

  const creditRemaining = credit - creditUsed
  const creditPercent = credit ? Math.floor((creditRemaining / credit) * 100) : 0

  return (
    <div className="max-w-2xl mx-auto py-10 px-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">📢 Programa de Referidos</h1>

      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <p className="mb-2 text-gray-700">Tu código de referido:</p>
        <div className="flex items-center gap-2">
          <input
            value={refCode}
            readOnly
            className="w-full border rounded-xl px-4 py-2 font-mono text-lg"
          />
          <button
            onClick={handleCopy}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl"
          >
            {copied ? "Copiado!" : "Copiar"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center mb-8">
        <div className="bg-gray-100 p-4 rounded-xl">
          <p className="text-sm text-gray-500 mb-1">Referidos activos</p>
          <p className="text-2xl font-bold">{referrals}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-xl">
          <p className="text-sm text-gray-500 mb-1">Puntos ganados</p>
          <p className="text-2xl font-bold text-green-600">{points}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">💳 Wallet de Crédito</h2>
        <div className="mb-2 text-sm text-gray-700">
          Crédito usado: ${creditUsed} / ${credit}
        </div>
        <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 text-xs text-white text-center"
            style={{ width: `${creditPercent}%` }}
          >
            {creditPercent}%
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-2">🤖 Asistente Gastronómico</h2>
        <form onSubmit={handleAiSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="¿Qué quieres comer hoy?"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full border rounded-xl px-4 py-2"
            required
          />
          <button
            type="submit"
            disabled={loadingAi}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl"
          >
            {loadingAi ? "Pensando..." : "Obtener recomendación"}
          </button>
        </form>
        {aiMessage && (
          <p className="mt-4 text-blue-700 text-sm bg-blue-50 border border-blue-200 rounded-xl p-3">
            {aiMessage}
          </p>
        )}
      </div>
    </div>
  )
}
