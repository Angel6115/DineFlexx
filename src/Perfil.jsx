import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

export default function Perfil() {
  const [loading, setLoading] = useState(true)
  const [preferences, setPreferences] = useState([])
  const [credit, setCredit] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data?.user) {
        console.error("❌ No se pudo obtener el usuario:", error?.message)
        setLoading(false)
        return
      }

      const user = data.user

      const { data: prefs, error: prefsError } = await supabase
        .from("user_preferences")
        .select("preferences")
        .eq("user_id", user.id)

      if (prefsError) {
        console.error("❌ Error al obtener preferencias:", prefsError.message)
      } else {
        setPreferences(prefs?.[0]?.preferences || [])
      }

      const { data: creditData, error: creditError } = await supabase
        .from("credit")
        .select("amount")
        .eq("user_id", user.id)

      if (creditError) {
        console.error("❌ Error al obtener crédito:", creditError.message)
      } else {
        setCredit(creditData?.[0]?.amount || 0)
      }

      setLoading(false)
    }

    fetchProfile()
  }, [])

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Cargando perfil...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 font-sans">
      <h1 className="text-3xl font-bold mb-6">👤 Mi Perfil</h1>

      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Crédito Disponible</h2>
        <p className="text-2xl text-green-600 font-bold">${credit}</p>
      </div>

      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Preferencias Gastronómicas</h2>
        {preferences.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {preferences.map((pref, idx) => (
              <li key={idx}>{pref}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No se han configurado preferencias.</p>
        )}
      </div>
    </div>
  )
}
