import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import PreferenceSelector from "./components/PreferenceSelector"
import AIRecommender from "./components/AIRecommender"
import CreditSummary from "./components/CreditSummary"

export default function Perfil() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    fetchUser()
  }, [])

  if (!user) return <p className="text-center mt-10">Cargando perfil...</p>

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">👤 Tu Perfil - DineFlexx</h1>

      {/* Información básica del usuario */}
      <div className="bg-white rounded-2xl shadow p-5 mb-6">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Nombre:</strong> {user.user_metadata?.name || "Sin nombre registrado"}</p>
      </div>

      {/* Preferencias gastronómicas */}
      <PreferenceSelector />

      {/* Recomendaciones de IA */}
      <AIRecommender />

      {/* Resumen de crédito, puntos, referidos */}
      <CreditSummary />

      {/* Sección para funciones futuras */}
      <div className="bg-gray-100 rounded-2xl p-4 mt-6 text-center">
        <p className="text-sm text-gray-600">Próximamente podrás:</p>
        <ul className="text-gray-800 mt-2 space-y-1 text-sm">
          <li>→ Compartir experiencias en redes sociales</li>
          <li>→ Usar tu crédito como Wallet digital</li>
          <li>→ Reservar y prepagar comidas en restaurantes</li>
        </ul>
      </div>
    </div>
  )
}
