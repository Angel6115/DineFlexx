import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function Referidos() {
  const [userId, setUserId] = useState(null)
  const [refCode, setRefCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [referrals, setReferrals] = useState(0)
  const [points, setPoints] = useState(0)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()
      if (!error && user) {
        setUserId(user.id)
        setRefCode(user.id.slice(0, 8).toUpperCase()) // código simple

        const { data: refCount } = await supabase
          .from("referrals")
          .select("id", { count: "exact" })
          .eq("referrer_id", user.id)

        if (refCount) setReferrals(refCount.length)

        const { data: pointData } = await supabase
          .from("points")
          .select("total")
          .eq("user_id", user.id)
          .single()

        if (pointData?.total !== undefined) setPoints(pointData.total)
      }
    }
    getUser()
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(refCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

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

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-gray-100 p-4 rounded-xl">
          <p className="text-sm text-gray-500 mb-1">Referidos activos</p>
          <p className="text-2xl font-bold">{referrals}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-xl">
          <p className="text-sm text-gray-500 mb-1">Puntos ganados</p>
          <p className="text-2xl font-bold text-green-600">{points}</p>
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mt-8">
        Comparte tu código con tus amigos y gana puntos cuando se registren 💸
      </p>
    </div>
  )
}
