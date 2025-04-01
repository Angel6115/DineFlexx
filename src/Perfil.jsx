import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import { useOrder } from "../context/OrderContext"

export default function Perfil() {
  const [userId, setUserId] = useState(null)
  const [preferences, setPreferences] = useState([])
  const [selectedPrefs, setSelectedPrefs] = useState([])
  const [citas, setCitas] = useState([])
  const { credit, puntos } = useOrder()

  const CATEGORIES = [
    "Vegano", "Tacos", "Alta cocina", "Asiática",
    "Mediterránea", "Comida rápida", "Pastas", "Parrilla"
  ]

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()

      if (error || !user) return

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

      const { data: reservas } = await supabase
        .from("reservas")
        .select("fecha, hora, total")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      setCitas(reservas || [])
    }

    fetchProfile()
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
      .upsert({ user_id: userId, preferences: selectedPrefs })

    if (!error) {
      alert("Preferencias guardadas con éxito ✅")
      setPreferences(selectedPrefs)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 font-sans">
      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Crédito Disponible</h2>
        <p className="text-2xl text-green-600 font-bold">${credit.toFixed(2)}</p>
        <p className="text-sm text-gray-500 mt-1">Puntos acumulados: {puntos}</p>
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

      {citas.length > 0 && (
        <div className="bg-white shadow rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📅 Historial de Reservas</h2>
          <ul className="divide-y divide-gray-200">
            {citas.map((res, i) => (
              <li key={i} className="py-3 flex justify-between text-sm text-gray-700">
                <span>{res.fecha} a las {res.hora}</span>
                <span className="font-bold text-blue-600">${res.total.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
