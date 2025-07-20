import { useState, useEffect } from "react"
import supabase from "../supabaseClient"

export default function SolicitudCredito() {
  const [user, setUser] = useState(null)
  const [solicitado, setSolicitado] = useState(false)
  const [aprobado, setAprobado] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const obtenerEstado = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) return

      setUser(user)

      const { data, error: err } = await supabase
        .from("credito_virtual")
        .select("estado")
        .eq("user_id", user.id)
        .single()

      if (data) {
        setSolicitado(true)
        if (data.estado === "aprobado") setAprobado(true)
      }

      setCargando(false)
    }

    obtenerEstado()
  }, [])

  const solicitarCredito = async () => {
    if (!user?.id) return

    const { error } = await supabase
      .from("credito_virtual")
      .upsert({
        user_id: user.id,
        estado: "pendiente"
      })

    if (!error) {
      setSolicitado(true)
      alert("✅ Solicitud enviada. Te notificaremos cuando sea aprobada.")
    }
  }

  if (cargando) return null

  return (
    <div className="bg-white shadow rounded-2xl p-6 mb-6">
      <h2 className="text-xl font-semibold mb-3">💳 Tarjeta Virtual DineFlexx</h2>

      {!solicitado && (
        <>
          <p className="text-sm mb-3 text-gray-600">
            Solicita tu tarjeta de crédito virtual para pagar en restaurantes sin revelar tu menú ni actividad.
          </p>
          <button
            onClick={solicitarCredito}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl"
          >
            Solicitar Crédito Virtual
          </button>
        </>
      )}

      {solicitado && !aprobado && (
        <p className="text-yellow-600 font-medium">
          🕐 Tu solicitud está en proceso. Te notificaremos al ser aprobada.
        </p>
      )}

      {aprobado && (
        <div className="border p-4 rounded mt-2 bg-gray-50">
          <h3 className="font-semibold text-green-600 mb-1">✅ Aprobado</h3>
          <p className="text-sm text-gray-600 mb-1">
            Tu tarjeta está activa y visible en tu <a href="/wallet" className="underline text-blue-600">Wallet Digital</a>.
          </p>
          <p className="text-xs text-gray-400">
            Puedes usarla directamente en el restaurante afiliado sin revelar tu historial de pedidos.
          </p>
        </div>
      )}
    </div>
  )
}
