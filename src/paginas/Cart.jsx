// src/paginas/Cart.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../supabaseClient'
import { useOrder } from '../context/OrderContext'

export default function Cart() {
  const {
    orden: items = [],
    vaciarOrden,
    credit,
    setCredit,
    puntos,
    setPuntos
  } = useOrder()

  const [loading, setLoading] = useState(false)
  const [planType, setPlanType] = useState('monthly') // 'monthly' o 'weekly'
  const [installments, setInstallments] = useState(4)
  const navigate = useNavigate()

  useEffect(() => {
    console.log('🛒 Items en el carrito:', items)
  }, [items])

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const taxRate = 0.115
  const tax = Number((subtotal * taxRate).toFixed(2))
  const totalWithTax = Number((subtotal + tax).toFixed(2))
  const cuotaInicial = Number((totalWithTax / installments).toFixed(2))

  const handleCheckout = async () => {
    if (!items.length) return
    if (credit < cuotaInicial) {
      alert('⚠️ Crédito insuficiente para cubrir la primera cuota.')
      return
    }

    setLoading(true)
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const orderPayload = {
        client_id: user.id,
        restaurant_id: items[0].restaurant_id,
        items: items.map(({ id, name, price, quantity }) => ({
          menu_id: id,
          name,
          price,
          quantity
        })),
        total: subtotal
      }

      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select()

      if (orderErr) throw orderErr

      const orderId = orderData[0].id
      const today = new Date().toISOString().split('T')[0]

      const planPayload = {
        order_id: orderId,
        total_amount: totalWithTax,
        markup_percent: taxRate * 100,
        installments,
        frequency: planType,
        initial_due: today
      }

      const { error: planErr } = await supabase
        .from('financing_plans')
        .insert([planPayload])

      if (planErr) throw planErr

      setCredit(prev => Number((prev - cuotaInicial).toFixed(2)))
      vaciarOrden()
      navigate('/orden-confirmada')
    } catch (err) {
      console.error('❌ Error en el proceso:', err)
      alert('Ocurrió un error al procesar tu orden.')
    }
    setLoading(false)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tu Carrito</h1>

      <div className="mb-6">
        <p className="text-sm text-gray-600">Crédito disponible:</p>
        <p className="text-xl text-green-600 font-bold">${credit.toFixed(2)}</p>
      </div>

      {items.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="space-y-2 mb-6">
            {items.map((item, i) => (
              <li key={i} className="flex justify-between items-center border-b py-2">
                <div>
                  <p>{item.name} x{item.quantity}</p>
                  <p className="text-sm text-gray-500">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">Selecciona tu plan de pago:</h2>
            <div className="flex gap-4 mb-2">
              <label>
                <input
                  type="radio"
                  name="plan"
                  value="monthly"
                  checked={planType === 'monthly'}
                  onChange={() => setPlanType('monthly')}
                  className="mr-1"
                />
                Cuotas Mensuales
              </label>
              <label>
                <input
                  type="radio"
                  name="plan"
                  value="weekly"
                  checked={planType === 'weekly'}
                  onChange={() => setPlanType('weekly')}
                  className="mr-1"
                />
                Cuotas Semanales
              </label>
            </div>

            <label className="block text-sm mt-2">
              Número de cuotas:
              <select
                className="ml-2 border rounded px-2 py-1"
                value={installments}
                onChange={(e) => setInstallments(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n} cuota{n > 1 && 's'}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mb-6">
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Impuesto (11.5%): +${tax.toFixed(2)}</p>
            <p className="font-semibold">Total a financiar: ${totalWithTax.toFixed(2)}</p>
            <p className="text-sm text-gray-600">
              Pago inicial (1 cuota): <strong>${cuotaInicial.toFixed(2)}</strong>
            </p>
            {credit < cuotaInicial && (
              <p className="text-red-600 text-sm mt-2">❌ Crédito insuficiente para cubrir esta cuota.</p>
            )}
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading || credit < cuotaInicial}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Confirmar y Financiar Pedido'}
          </button>
        </>
      )}
    </div>
  )
}
