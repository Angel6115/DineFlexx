// src/Dashboard.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import supabase from './supabaseClient'
import { useOrder } from './context/OrderContext'
import { 
  TrendingUp, 
  CreditCard, 
  Calendar, 
  ChevronDown, 
  ChevronUp,
  DollarSign,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Gift,
  MapPin
} from 'lucide-react'

export default function Dashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrderId, setExpandedOrderId] = useState(null)
  const { credit, puntos, refreshCredit } = useOrder()
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        console.error('Error al obtener usuario:', userError)
        setLoading(false)
        return
      }

      setUserName(user.email?.split('@')[0] || 'Usuario')

      if (refreshCredit) {
        await refreshCredit()
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
        setOrders(data || [])
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
      } else if (frequency === 'weekly') {
        nuevaFecha.setDate(nuevaFecha.getDate() + (i * 14))
      }
      fechas.push(nuevaFecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }))
    }

    return fechas
  }

  // Empty State Premium
  if (!loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-2">
              Bienvenido, {userName} 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Estás a un paso de tu primera experiencia gastronómica flexible
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 lg:p-12 mb-10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 text-white">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-8 h-8" />
                <span className="text-lg font-semibold opacity-90">Crédito Disponible</span>
              </div>
              <div className="text-5xl lg:text-6xl font-black mb-4">
                ${Number(credit || 0).toFixed(2)}
              </div>
              <p className="text-lg opacity-90 mb-6">
                Aprobado y listo para usar. Sin interés en 4 cuotas.
              </p>
              <Link
                to="/restaurants"
                className="inline-flex items-center gap-2 bg-white text-purple-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-all shadow-xl hover:scale-105"
              >
                Explorar restaurantes
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-10"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Cómo funciona
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Escoge tu restaurante",
                  desc: "Navega entre decenas de opciones cercanas",
                  icon: MapPin,
                  color: "blue"
                },
                {
                  step: "2",
                  title: "Divide el pago",
                  desc: "Paga 25% hoy, el resto en 3 cuotas",
                  icon: DollarSign,
                  color: "purple"
                },
                {
                  step: "3",
                  title: "Gana puntos",
                  desc: "Acumula rewards en cada orden",
                  icon: Gift,
                  color: "green"
                }
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                    {item.step}
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border-2 border-gray-100 dark:border-gray-600">
                    <item.icon className={`w-8 h-8 text-${item.color}-600 mb-3`} />
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Restaurantes populares
              </h2>
              <Link
                to="/restaurants"
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
              >
                Ver todos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "La Pizzería", cuisine: "Italiana", rating: "4.8", img: "🍕" },
                { name: "Sushi House", cuisine: "Japonesa", rating: "4.9", img: "🍣" },
                { name: "Café Central", cuisine: "Cafetería", rating: "4.7", img: "☕" }
              ].map((rest, i) => (
                <Link
                  key={i}
                  to="/restaurants"
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
                >
                  <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform">
                    {rest.img}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      {rest.name}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{rest.cuisine}</span>
                      <span className="text-yellow-500 font-semibold">★ {rest.rating}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">Cargando tus órdenes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-2">
            Mis Órdenes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Gestiona tus pagos y revisa tu historial
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
          >
            <CreditCard className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-sm opacity-90 mb-1">Crédito Disponible</p>
            <p className="text-3xl font-black">${Number(credit || 0).toFixed(2)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-700"
          >
            <CheckCircle2 className="w-8 h-8 mb-3 text-blue-600" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Órdenes Activas</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{orders.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-gray-100 dark:border-gray-700"
          >
            <Gift className="w-8 h-8 mb-3 text-purple-600" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Puntos Acumulados</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{puntos || 0}</p>
          </motion.div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order, index) => {
            const plan = order.financing_plans // ✅ Corregido
            const restaurante = order.restaurants?.name ?? 'Restaurante desconocido'
            const fechaOrden = order.created_at ? new Date(order.created_at).toLocaleDateString('es-ES', { // ✅ Corregido
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) : '—'
            const totalOriginal = order.total ?? 0
            const totalPlan = plan?.total_amount ?? 0 // ✅ Corregido
            const cuotas = plan?.installments ?? 1
            const frecuencia = plan?.frequency === 'monthly' ? 'Mensual' : plan?.frequency === 'weekly' ? 'Semanal' : 'Personalizado'
            const fechaInicial = plan?.initial_due ?? null // ✅ Corregido
            const montoCuota = cuotas > 0 ? (totalPlan / cuotas).toFixed(2) : '0.00'
            const fechasPago = fechaInicial ? calcularFechasCuotas(fechaInicial, plan.frequency, cuotas) : []
            const isExpanded = expandedOrderId === order.id

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {restaurante}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {fechaOrden}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
                          #{order.id.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-gray-900 dark:text-white">
                        ${totalPlan.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">Total con plan</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Plan de Pago</p>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {frecuencia} ({cuotas} cuotas)
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Monto por Cuota</p>
                      <p className="font-bold text-green-600">${montoCuota}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Próxima Cuota</p>
                      <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {fechaInicial ? new Date(fechaInicial).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleDetails(order.id)}
                    className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-semibold py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-5 h-5" />
                        Ocultar detalles
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-5 h-5" />
                        Ver plan de pagos
                      </>
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 p-6"
                  >
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      Calendario de Pagos
                    </h3>
                    {fechasPago.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        No hay fechas programadas.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {fechasPago.map((fecha, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center font-bold text-blue-600">
                                {idx + 1}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  Cuota #{idx + 1}
                                </p>
                                <p className="text-sm text-gray-500">{fecha}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900 dark:text-white text-lg">
                                ${montoCuota}
                              </p>
                              <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                <Clock className="w-3 h-3" />
                                Pendiente
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
