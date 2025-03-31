import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import LogoutButton from "../components/LogoutButton"

export default function Perfil() {
  const [loading, setLoading] = useState(true)
  const [preferences, setPreferences] = useState([])
  const [credit, setCredit] = useState(null)
  const [selectedPrefs, setSelectedPrefs] = useState([])
  const [userId, setUserId] = useState(null)
  const [email, setEmail] = useState("")
  const [createdAt, setCreatedAt] = useState("")

  const CATEGORIES = [
    "Vegano",
    "Tacos",
    "Alta cocina",
    "Asiática",
    "Mediterránea",
    "Comida rápida",
    "Pastas",
    "Parrilla"
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
      setEmail(user.email)
      setCreatedAt(user.created_at.split("T")[0])

      const { data: prefs, error: prefsError } = await supabase
        .from("user_preferences")
        .select("preferences")
        .eq("user_id", user.id)
        .single()

      if (!prefsError && prefs?.preferences) {
        setPreferences(prefs.preferences)
        setSelectedPrefs(prefs.preferences)
      }

      const { data: creditData, error: creditError } = await supabase
        .from("credit")
        .select("amount")
        .eq("user_id", user.id)
        .single()

      if (!creditError && creditData?.amount !== undefined) {
        setCredit(creditData.amount)
      }

      setLoading(false)
    }

    fetchProfile()
  }, [])

  const handleToggle = (pref) => {
    setSelectedPrefs((prev) =>
      prev.includes(pref)
        ? prev.filter((p) => p !== pref)
        : [...prev, pref]
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
        <h2 className="text-xl font-semibold mb-2">Crédito Disponible</h2>
        <p className="text-2xl text-green-600 font-bold">${credit ?? 0}</p>
      </div>

      <div className="bg-white shadow rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Datos del Usuario</h2>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Registrado desde:</strong> {createdAt}</p>
      </div>

      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Preferencias Gastronómicas</h2>

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
    </div>
  )
}
