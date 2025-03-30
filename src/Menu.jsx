import { useState } from "react"
import { supabase } from "./supabaseClient"

const INITIAL_CREDIT = 50.0

const chefSpecial = {
  name: "Tomahawk con reducción de vino tinto",
  price: 24.99,
  image: "/images/comidas/tomahawk.jpg",
  bonusPoints: true,
}

const menuData = {
  Comidas: [
    { name: "Bruschetta", price: 7.5, image: "/images/comidas/bruschetta.jpg" },
    { name: "Paella", price: 14.99, image: "/images/comidas/paella.jpg" },
    { name: "Pasta", price: 11.5, image: "/images/comidas/pasta.jpg" },
    { name: "Risotto", price: 13.0, image: "/images/comidas/risotto.jpg" },
    { name: "Sopa de tomate", price: 8.5, image: "/images/comidas/sopa-tomate.jpg" },
    { name: "Tacos", price: 10.0, image: "/images/comidas/tacos.jpg" },
  ],
  Bebidas: [
    { name: "Cabernet", price: 9.0, image: "/images/bebidas/cabernet.jpg" },
    { name: "Coca Cola", price: 2.5, image: "/images/bebidas/coca_cola.jpg" },
    { name: "Jugo de china", price: 3.0, image: "/images/bebidas/jugo_china.jpg" },
    { name: "Limonada", price: 3.5, image: "/images/bebidas/limonada.jpg" },
    { name: "Moët", price: 19.0, image: "/images/bebidas/moet.jpg" },
    { name: "Pinot Grigio", price: 8.5, image: "/images/bebidas/pinot.jpg" },
    { name: "Rosé", price: 8.0, image: "/images/bebidas/rose.jpg" },
  ],
  Postres: [
    { name: "Flan", price: 4.5, image: "/images/postres/flan.jpg" },
    { name: "Tiramisú", price: 5.0, image: "/images/postres/tiramisu.jpg" },
  ]
}

export default function Menu() {
  const [selectedItems, setSelectedItems] = useState([])
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedHour, setSelectedHour] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("wallet")
  const total = selectedItems.reduce((acc, item) => acc + item.price, 0)
  const remaining = INITIAL_CREDIT - total

  const handleAdd = (item) => {
    if (remaining - item.price >= 0) {
      setSelectedItems([...selectedItems, item])
    } else {
      alert("❌ Crédito insuficiente.")
    }
  }

  const handleRemove = (index) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index))
  }

  const handleConfirmReservation = async () => {
    if (!selectedDate || !selectedHour) {
      return alert("Selecciona fecha y hora para tu reserva.")
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return alert("Usuario no autenticado.")
    }

    const { error } = await supabase.from("reservas").insert([
      {
        user_id: user.id,
        fecha: selectedDate,
        hora: selectedHour,
        total: total,
        pago_tipo: paymentMethod,
        items: selectedItems,
      },
    ])

    if (error) {
      console.error("❌ Error al crear reserva:", error.message)
      alert("Hubo un error al guardar tu reserva.")
    } else {
      alert("🎉 ¡Reserva confirmada exitosamente!")
      setSelectedItems([])
      setSelectedDate("")
      setSelectedHour("")
      setPaymentMethod("wallet")
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 font-sans">
      <div className="flex items-center justify-between mb-8">
        <img src="/images/logo.jpg" alt="DineFlexx Logo" className="h-10 rounded-xl shadow" />
        <h1 className="text-3xl font-bold text-right">Dine Restaurant</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-lg mb-12 flex flex-col md:flex-row overflow-hidden">
        <img
          src={chefSpecial.image}
          alt={chefSpecial.name}
          className="w-full md:w-1/2 h-48 object-cover"
        />
        <div className="p-6 flex flex-col justify-between md:w-1/2">
          <div>
            <h2 className="text-2xl font-semibold mb-2">👨‍🍳 Recomendación del Chef</h2>
            <p className="text-lg">{chefSpecial.name}</p>
            <p className="text-sm text-green-600 mt-1">🎁 Obtienes puntos adicionales</p>
            <p className="mt-2 font-bold text-blue-600">${chefSpecial.price.toFixed(2)}</p>
          </div>
          <button
            onClick={() => handleAdd(chefSpecial)}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
          >
            ➕ Agregar a mi orden
          </button>
        </div>
      </div>

      {Object.entries(menuData).map(([section, items]) => (
        <div key={section} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{section}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow overflow-hidden hover:shadow-lg transition flex flex-col">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-blue-600 font-semibold mt-1">${item.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => handleAdd(item)}
                    className="mt-4 w-full bg-blue-600 text-white rounded-xl py-2 text-sm hover:bg-blue-700 transition"
                  >
                    ➕ Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-gray-100 p-6 rounded-2xl shadow mt-12">
        <h2 className="text-xl font-bold mb-4">🧾 Tu Orden</h2>

        {selectedItems.length === 0 ? (
          <p className="text-gray-600">Aún no has agregado productos.</p>
        ) : (
          <div className="space-y-2 mb-4">
            {selectedItems.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm border-b pb-1">
                <span>{item.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-medium">${item.price.toFixed(2)}</span>
                  <button onClick={() => handleRemove(i)} className="text-red-500 text-xs">❌</button>
                </div>
              </div>
            ))}
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-700">
              💳 Crédito disponible: <span className={remaining < 0 ? "text-red-600" : "text-green-600"}>${remaining.toFixed(2)}</span>
            </div>
          </div>
        )}

        {selectedItems.length > 0 && (
          <>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-2 rounded-lg border w-full sm:w-1/3"
              />
              <input
                type="time"
                value={selectedHour}
                onChange={(e) => setSelectedHour(e.target.value)}
                className="p-2 rounded-lg border w-full sm:w-1/3"
              />
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="p-2 rounded-lg border w-full sm:w-1/3"
              >
                <option value="wallet">Pagar con Wallet Digital</option>
                <option value="prepago">Prepagar ahora</option>
              </select>
            </div>

            <button
              onClick={handleConfirmReservation}
              className="mt-4 w-full bg-green-600 text-white py-3 rounded-xl font-medium text-lg hover:bg-green-700 transition"
            >
              ✅ Confirmar Reserva
            </button>
          </>
        )}
      </div>
    </div>
  )
}
