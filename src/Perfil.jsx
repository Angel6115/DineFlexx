import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import LogoutButton from "./components/LogoutButton"
import { useOrder } from "./context/OrderContext"

export default function Perfil() {
  const [loading, setLoading] = useState(true)
  const [preferences, setPreferences] = useState([])
  const [selectedPrefs, setSelectedPrefs] = useState([])
  const [userId, setUserId] = useState(null)
  const [iaQuery, setIaQuery] = useState("")
  const [iaResult, setIaResult] = useState("")
  const [nombre, setNombre] = useState("")
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

      if (error || !user) {
        console.error("❌ No se pudo obtener el usuario:", error?.message)
        setLoading(false)
        return
      }

      setUserId(user.id)
      setNombre(user.user_metadata?.full_name || "Usuario")

      const { data: prefs } = await supabase
        .from("user_preferences")
        .select("preferences")
        .eq("user_id", user.id)
        .single()
      if (prefs?.preferences) {
        setPreferences(prefs.preferences)
        setSelectedPrefs(prefs.preferences)
      }

      setLoading(false)
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

  const handleIaRecommendation = () => {
    if (!iaQuery) {
      setIaResult("Por favor, escribe una consulta para obtener una recomendación.")
      return
    }

    setIaResult(`Basado en tu preferencia, te sugerimos visitar "Sushi Go" en San Juan 🍣. ¡Recibirás puntos extra por reservar desde DineFlexx!`)
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
        <p className="text-2xl text-green-600 font-bold">${credit.toFixed(2)}</p>
        <h2 className="text-xl font-semibold mt-4">🎯 Puntos Acumulados</h2>
        <p className="text-2xl text-blue-600 font-bold">{puntos}</p>
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

        {preferences.length > 0 && (
          <div className="mt-6">
            <h3 className="text-md font-semibold mb-1 text-gray-700">
              Tus preferencias actuales:
            </h3>
            <ul className="list-disc list-inside text-gray-600">
              {preferences.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 🔮 Recomendaciones Inteligentes con IA */}
      <div className="mt-10 bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-2">🔍 ¿Qué te apetece comer?</h2>
        <p className="text-sm text-gray-500 mb-4">
          Escribe algo como: <em>“Quiero comer sushi en San Juan”</em> y obtén sugerencias.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            value={iaQuery}
            onChange={(e) => setIaQuery(e.target.value)}
            placeholder="Escribe tu idea gastronómica..."
            className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleIaRecommendation}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Consultar IA
          </button>
        </div>

        {iaResult && (
          <div className="mt-4 border rounded-xl bg-gray-50 p-4 shadow-inner text-left">
            <h3 className="font-semibold text-gray-800 mb-1">✨ Recomendación:</h3>
            <p className="text-gray-700">{iaResult}</p>
          </div>
        )}
      </div>
    </div>
  )
}
