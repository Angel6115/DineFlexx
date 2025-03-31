import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function Logros() {
  const [logros, setLogros] = useState([])
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const obtenerUsuarioYLogros = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()
      if (error || !user) return

      setUserId(user.id)

      const { data, error: logrosError } = await supabase
        .from("logros")
        .select("titulo, descripcion, fecha")
        .eq("user_id", user.id)
        .order("fecha", { ascending: false })

      if (!logrosError && data) setLogros(data)
    }
    obtenerUsuarioYLogros()
  }, [])

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 font-sans">
      <h1 className="text-3xl font-bold text-center mb-8">🏅 Tus Logros</h1>
      {logros.length === 0 ? (
        <p className="text-center text-gray-500">Aún no has desbloqueado logros... ¡Sigue usando DineFlexx!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {logros.map((l, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition-all border"
            >
              <h2 className="text-xl font-semibold mb-1">🏆 {l.titulo}</h2>
              <p className="text-gray-600 text-sm mb-2">{l.descripcion}</p>
              <p className="text-xs text-gray-400">Desbloqueado el {new Date(l.fecha).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
