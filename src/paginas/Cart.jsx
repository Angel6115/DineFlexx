// src/paginas/Cart.jsx
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useOrder } from "../context/OrderContext"
import supabase from "../supabaseClient"
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft,
  CreditCard,
  Calendar,
  CheckCircle2,
  Sparkles,
  DollarSign,
  TrendingUp,
  AlertCircle
} from "lucide-react"

export default function Cart() {
  const navigate = useNavigate()
  const { 
    items = [], 
    actualizarCantidad, 
    eliminarItem, 
    limpiarCarrito, 
    credit = 0, 
    setCredit, 
    puntos = 0,
    setPuntos 
  } = useOrder()
  
  const [selectedPlan, setSelectedPlan] = useState("4-cuotas")
  const [processing, setProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.115 // 11.5% IVU Puerto Rico
  const total = subtotal + tax

  // Payment plans
  const plans = {
    "4-cuotas": {
      name: "4 Cuotas sin interés",
      installments: 4,
      frequency: "Cada 2 semanas",
      installmentAmount: (total / 4).toFixed(2),
      icon: Calendar,
      badge: "Más popular",
      color: "blue"
    },
    "3-cuotas": {
      name: "3 Cuotas sin interés",
      installments: 3,
      frequency: "Mensual",
      installmentAmount: (total / 3).toFixed(2),
      icon: TrendingUp,
      badge: null,
      color: "purple"
    },
    "pago-completo": {
      name: "Pago completo",
      installments: 1,
      frequency: "Hoy",
      installmentAmount: total.toFixed(2),
      icon: DollarSign,
      badge: "+50 puntos extra",
      color: "green"
    }
  }

  const currentPlan = plans[selectedPlan]
  const firstPayment = parseFloat(currentPlan.installmentAmount)
  const pointsEarned = selectedPlan === "pago-completo" 
    ? Math.floor(total / 2) + 50 
    : Math.floor(total / 2)

  const handleCheckout = async () => {
    if (items.length === 0) return
    
    // Validar crédito suficiente para el PRIMER PAGO
    if (credit < firstPayment) {
      setErrorMsg(`No tienes suficiente crédito para el primer pago de $${firstPayment.toFixed(2)}. Crédito actual: $${credit.toFixed(2)}`)
      return
    }
    
    setProcessing(true)
    setErrorMsg("")

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        setErrorMsg("Debes iniciar sesión para continuar")
        setProcessing(false)
        navigate("/login")
        return
      }

      console.log("✅ Usuario autenticado:", user.id)

      // 1) Crear orden
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          client_id: user.id,
          restaurant_id: items[0]?.restaurant_id,
          total: total,
          status: "pending",
          items: items
        })
        .select()
        .single()

      if (orderError) {
        console.error("❌ Error creando orden:", orderError)
        throw new Error(`Error al crear orden: ${orderError.message}`)
      }

      console.log("✅ Orden creada:", orderData.id)

      // 2) Crear financing_plan
      const today = new Date()
      const initialDue = new Date(today)

      let frequency = "once"
      if (selectedPlan === "3-cuotas") {
        frequency = "monthly"
      } else if (selectedPlan === "4-cuotas") {
        frequency = "weekly"
      }

      // ✅ IMPORTANTE: ahora guardamos user_id + metadata para badge
      const planTitle = `Restaurante • Orden #${String(orderData.id).slice(0, 8)}`

      const { data: planData, error: planError } = await supabase
        .from("financing_plans")
        .insert({
          // 🔒 Esto evita que "desaparezcan" en Wallet
          user_id: user.id,

          // relación existente
          order_id: orderData.id,

          // totals
          total_amount: total,
          markup_percent: 0,
          installments: currentPlan.installments,
          frequency,
          initial_due: initialDue.toISOString().split("T")[0],

          // ✅ para distinguir origen en Wallet
          source_type: "restaurant",
          source_ref_id: orderData.id, // puedes usar restaurant_id si quieres
          title: planTitle
        })
        .select()
        .single()

      if (planError) {
        console.error("❌ Error creando financing_plan:", planError)
        throw new Error(`Error al crear plan de financiamiento: ${planError.message}`)
      }

      console.log("✅ financing_plan creado:", planData.id)

      // 3) Crear installments usando financing_plans.id
      const installmentsRows = []
      
      for (let i = 0; i < currentPlan.installments; i++) {
        const dueDate = new Date(initialDue)
        if (frequency === "monthly") {
          dueDate.setMonth(dueDate.getMonth() + i)
        } else if (frequency === "weekly") {
          dueDate.setDate(dueDate.getDate() + (i * 14)) // cada 2 semanas
        }

        installmentsRows.push({
          plan_id: planData.id,
          sequence: i + 1,
          amount: firstPayment,
          due_date: dueDate.toISOString().split('T')[0],
          status: i === 0 ? "paid" : "pending",
          paid_at: i === 0 ? new Date().toISOString() : null
        })
      }

      console.log("📦 Insertando installments:", installmentsRows)

      const { error: installmentsError } = await supabase
        .from("installments")
        .insert(installmentsRows)

      if (installmentsError) {
        console.error("❌ Error creando installments:", installmentsError)
        throw new Error(`Error al crear plan de pagos: ${installmentsError.message}`)
      }

      console.log("✅ Installments creados")

      // 4) Actualizar crédito local (descontar PRIMER PAGO)
      const newCredit = credit - firstPayment
      const newPoints = puntos + pointsEarned
      
      console.log(`💳 Crédito anterior: $${credit} → Nuevo: $${newCredit}`)
      
      setCredit(newCredit)
      setPuntos(newPoints)

      // 5) Actualizar en la base de datos
      const { error: creditError } = await supabase
        .from("profiles")
        .update({ 
          credit: newCredit,
          points: newPoints
        })
        .eq("id", user.id)

      if (creditError) {
        console.warn("⚠️ No se pudo actualizar el crédito en profiles:", creditError)
      }

      // 6) Success!
      setShowSuccess(true)
      setTimeout(() => {
        limpiarCarrito()
        navigate("/wallet")
      }, 3000)

    } catch (error) {
      console.error("❌ Error en checkout:", error)
      setErrorMsg(error.message || "Hubo un error al procesar tu orden. Intenta de nuevo.")
    } finally {
      setProcessing(false)
    }
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Explora nuestros restaurantes y encuentra tu próxima comida favorita
            </p>
            <Link
              to="/restaurants"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Ver restaurantes
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  // Success Modal
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-xl text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            ¡Orden confirmada!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Tu primer pago de <strong className="text-green-600">${firstPayment.toFixed(2)}</strong> fue procesado.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Crédito restante: <strong>${(credit - firstPayment).toFixed(2)}</strong>
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span>Ganaste <strong>{pointsEarned}</strong> puntos</span>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Seguir comprando
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <ShoppingCart className="w-8 h-8" />
            Tu Carrito
          </h1>
        </div>

        {/* Credit Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-emerald-100 mb-1">Crédito Disponible</p>
                <p className="text-3xl font-bold">${credit.toFixed(2)}</p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div>
                <p className="text-sm text-emerald-100 mb-1">Ganarás</p>
                <p className="text-3xl font-bold">{pointsEarned} pts</p>
              </div>
            </div>
            {credit >= firstPayment && (
              <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
                <span>Crédito suficiente</span>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                    🍽️
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {item.name}
                    </h3>
                    <p className="text-xl font-bold text-blue-600 mb-3">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button
                          onClick={() => actualizarCantidad(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-white dark:bg-gray-800 rounded-md flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => actualizarCantidad(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>

                      <button
                        onClick={() => eliminarItem(item.id)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-4">
              <h2 className="text-xl font-bold mb-6">Resumen</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>IVU (11.5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold mb-2">
                <span>Total</span>
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </div>

              {/* Primer Pago Destacado */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-1 font-semibold">Primer Pago Hoy</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">${firstPayment.toFixed(2)}</p>
                {currentPlan.installments > 1 && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    + {currentPlan.installments - 1} pagos de ${firstPayment} {currentPlan.frequency.toLowerCase()}
                  </p>
                )}
              </div>

              {/* Payment Plans */}
              <div className="space-y-3 mb-6">
                <p className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Plan de pago</p>
                {Object.entries(plans).map(([key, plan]) => {
                  const Icon = plan.icon
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedPlan(key)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        selectedPlan === key
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-sm">{plan.name}</span>
                        </div>
                        {plan.badge && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        {plan.frequency}
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ${plan.installmentAmount} × {plan.installments}
                      </p>
                    </button>
                  )
                })}
              </div>

              <button
                onClick={handleCheckout}
                disabled={processing || credit < firstPayment}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Confirmar Orden
                  </>
                )}
              </button>

              {credit < firstPayment && (
                <p className="text-sm text-red-600 text-center mt-3">
                  Crédito insuficiente para el primer pago
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
