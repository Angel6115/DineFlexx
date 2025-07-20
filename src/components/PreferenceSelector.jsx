import { useEffect, useState } from "react"
import supabase from "./supabaseClient"; // ✅

const CATEGORIES = [
  "Vegano", "Tacos", "Alta cocina", "Asiática",
  "Mediterránea", "Comida rápida", "Pastas", "Parrilla"
]

export default function PreferenceSelector() {
  const [selected, setSelected] = useState([])
  const [userId, setUserId] = useState(null)

  // Cargar preferencias existentes desde Supabase
  useEffect(() => {
    const fetchPreferences = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      const { data } = await supabase
        .from("user_preferences")
        .select("preferences")
        .eq("user_id", user.id)
        .single()

      if (data?.preferences) {
        setSelected(data.preferences)
      }
    }

    fetchPreferences()
  }, [])

  // Guardar automáticamente cuando cambian las preferencias
  useEffect(() => {
    if (!userId) return

    const savePreferences = async () => {
      await supabase.from("user_preferences").upsert({
        user_id: userId,
        preferences: selected,
        updated_at: new Date().toISOString()
      })
    }

    savePreferences()
  }, [selected, userId])

  const toggle = (item) => {
    setSelected((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow p-5 mb-6">
      <h2 className="text-xl font-semibold mb-3">🍽️ Tus preferencias gastronómicas</h2>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => toggle(cat)}
            className={`px-3 py-1 rounded-full border ${
              selected.includes(cat)
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
