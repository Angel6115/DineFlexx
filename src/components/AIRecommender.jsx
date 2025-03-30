import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function AIRecommender() {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  const SUGGESTIONS = {
    Vegano: "🥦 Hoy es ideal para una ensalada tibia de quinoa con tofu.",
    Tacos: "🌮 No te pierdas unos buenos tacos al pastor con piña fresca.",
    "Alta cocina": "🍷 Explorá un menú degustación con maridaje de vinos.",
    Asiática: "🍜 Ramen casero o sushi fresco para un toque oriental.",
    Mediterránea: "🫒 Tapas, hummus y aceite de oliva, ¿qué más se puede pedir?",
    "Comida rápida": "🍔 Una smash burger con papas trufadas nunca falla.",
    Pastas: "🍝 Ravioles rellenos con salsa cremosa de hongos.",
    Parrilla: "🔥 Un corte jugoso a la parrilla con chimichurri artesanal."
  }

  useEffect(() => {
    const fetchAndGenerate = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("user_preferences")
        .select("preferences")
        .eq("user_id", user.id)
        .single()

      if (data?.preferences?.length > 0) {
        const result = data.preferences.map(pref => SUGGESTIONS[pref]).filter(Boolean)
        setRecommendations(result)
      } else {
        setRecommendations(["Seleccioná tus preferencias para ver sugerencias."])
      }

      setLoading(false)
    }

    fetchAndGenerate()
  }, [])

  return (
    <div className="bg-white rounded-2xl shadow p-5 mb-6">
      <h2 className="text-xl font-semibold mb-3">🤖 Recomendaciones personalizadas</h2>
      {loading ? (
        <p className="text-gray-500 text-sm">Cargando recomendaciones...</p>
      ) : (
        <ul className="list-disc list-inside text-gray-800 space-y-1">
          {recommendations.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

  