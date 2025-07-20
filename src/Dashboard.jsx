import { useEffect, useState } from 'react'
import supabase from './supabaseClient'

export default function Dashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrderId, setExpandedOrderId] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        console.error('Error al obtener usuario:', userError)
        return
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total,
          created_at,
          financing_plans (
            total_amount,
            installments,
            markup_percent,
            frequency,
            initial_due
          ),
          restaurants (
            name
          )
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error al cargar órdenes:', error)
      } else {
        setOrders(data)
      }

      setLoading(false)
    }

    fetchOrders()
  }, [])

  const toggleDetails = (orderId) => {
    setExpandedOrderId(prev => (prev === orderId ? null : orderId))
  }

  const calcularFechasCuotas = (initialDate, frequency, installments) => {
    const fechas = []
    const baseDate = new Date(initialDate)

    for (let i = 0; i < installments; i++) {
      const nuevaFecha = new Date(baseDate)
      if (frequency === 'monthly') {
        nuevaFecha.setMonth(nuevaFecha.getMonth() + i)
      } else {
        nuevaFecha.setDate(nuevaFecha.getDate() + (i * 7))
      }
      fechas.push(nuevaFecha.toLocaleDateString())
    }

    return fechas
  }

  if (loading) return <div className="p-8">Cargando tus órdenes…</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Tus Órdenes Financiadas</h1>

      {orders.length === 0 ? (
        <p>No tienes órdenes registradas aún.</p>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => {
            const plan = order.financing_plans
            const restaurante = order.restaurants?.name ?? 'Restaurante desconocido'
            const fechaOrden = order.created_at ? new Date(order.created_at).toLocaleDateString() : '—'
            const totalOriginal = order.total ?? 0
            const totalPlan = plan?.total_amount ?? 0
            const cuotas = plan?.installments ?? 1
            const frecuencia = plan?.frequency === 'monthly' ? 'Mensual' : plan?.frequency === 'weekly' ? 'Semanal' : 'Personalizado'
            const fechaInicial = plan?.initial_due ?? null
            const montoCuota = cuotas > 0 ? (totalPlan / cuotas).toFixed(2) : '0.00'
            const fechasPago = fechaInicial ? calcularFechasCuotas(fechaInicial, plan.frequency, cuotas) : []

            return (
              <div key={order.id} className="border rounded-lg p-4 shadow-sm bg-white">
                <h2 className="text-xl font-semibold mb-1">{restaurante}</h2>
                <p className="text-sm text-gray-500 mb-2">
                  Orden #{order.id} • {fechaOrden}
                </p>
                <p>Total original: <span className="font-semibold">${totalOriginal.toFixed(2)}</span></p>
                <p>Total a pagar con plan: <span className="font-semibold">${totalPlan.toFixed(2)}</span></p>
                <p>Plan de pago: {frecuencia} ({cuotas} cuotas)</p>
                <p>Monto por cuota: <span className="font-semibold">${montoCuota}</span></p>
                <p className="text-sm text-gray-600 mt-2">
                  Primera cuota programada para: {fechaInicial ?? 'Fecha no disponible'}
                </p>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => toggleDetails(order.id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {expandedOrderId === order.id ? 'Ocultar detalles' : 'Ver detalles'}
                  </button>
                </div>

                {expandedOrderId === order.id && (
                  <div className="mt-4 border-t pt-4">
                    <h3 className="text-md font-semibold mb-2">Plan de Pagos</h3>
                    {fechasPago.length === 0 ? (
                      <p className="text-gray-500 text-sm">No hay fechas programadas.</p>
                    ) : (
                      <ul className="text-sm">
                        {fechasPago.map((fecha, idx) => (
                          <li key={idx} className="flex justify-between py-1">
                            <span>Cuota #{idx + 1}</span>
                            <span>{fecha}</span>
                            <span className="font-medium">${montoCuota}</span>
                            <span className="text-green-600">Pendiente</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
