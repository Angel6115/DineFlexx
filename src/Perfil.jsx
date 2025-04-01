import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import LogoutButton from "./components/LogoutButton"

export default function Perfil() {
  const [loading, setLoading] = useState(true)
  const [preferences, setPreferences] = useState([])
  const [credit, setCredit] = useState(null)
  const [selectedPrefs, setSelectedPrefs] = useState([])
  const [userId, setUserId] = useState(null)
  const [reservas, setReservas] = useState([])

  const CATEGORIES = [
    "Vegano", "Tacos", "Alta cocina", "Asiática",
    "Mediterránea", "Comida rápida", "Pastas", "Parrilla"
  ]

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()

      if (error || !user) {
        console.error("❌ Error al obtener usuario:", error?.message)
        setLoading(false)
        return
      }

      setUserId(user.id)

      const { data: prefs } = await supabase
        .from("user_preferences")
        .select("preferences")
        .eq("user_id", user.id)
        .single()
      if (prefs?.preferences) {
        setPreferences(prefs.preferences)
        setSelectedPrefs(prefs.preferences)
      }

      const { data: creditData } = await supabase
        .from("credit")
        .select("amount")
        .eq("user_id", user.id)
        .single()
      if (creditData?.amount !== undefined) {
        setCredit(creditData.amount)
      }

      const { data: reservasData } = await supabase
        .from("reservas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      if (reservasData) {
        setReservas(reservasData)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const handleToggle = (pref) => {
    setSelectedPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    )
  }

  const handleSave = async () => {
    if (!userId) return

    const { error } = await supabase
      .from("user_preferences")
      .upsert({
        user_id: userId,
        preferences: selectedPrefs,
        update_at: new Date()
      })

    if (error) {
      console.error("❌ Error al guardar preferencias:", error.message)
    } else {
      setPreferences(selectedPrefs)
      alert("Preferencias actualizadas ✅")
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Cargando perfil...
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 font-sans">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">👤 Mi Perfil</h1>
        <LogoutButton />
      </div>

      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">💳 Crédito Disponible</h2>
        <p className="text-2xl text-green-600 font-bold">${credit ?? 0}</p>
      </div>

      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🍽️ Preferencias Gastronómicas</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleToggle(cat)}
              className={`px-4 py-2 rounded-full border transition ${
                selectedPrefs.includes(cat)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl shadow"
        >
          Guardar preferencias
        </button>
      </div>

      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">📅 Tus Reservaciones</h2>
        {reservas.length === 0 ? (
          <p className="text-gray-500">No tienes reservas registradas.</p>
        ) : (
          <ul className="space-y-3">
            {reservas.map((r, idx) => (
              <li key={idx} className="border rounded-xl p-4 text-sm text-gray-700 shadow-sm">
                <strong>Fecha:</strong> {r.fecha} - <strong>Hora:</strong> {r.hora}<br />
                <strong>Platos:</strong> {r.items?.map(i => i.nombre).join(", ")}<br />
                <strong>Total:</strong> ${r.total.toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
