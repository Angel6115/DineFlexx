import { useState } from "react"
import { supabase } from "../../supabaseClient"

const menuData = {
  comidas: [
    { nombre: "Bruschetta", precio: 7.5, imagen: "/images/comidas/bruschetta.jpg" },
    { nombre: "Paella", precio: 14.99, imagen: "/images/comidas/paella.jpg" },
    { nombre: "Pasta", precio: 11.5, imagen: "/images/comidas/pasta.jpg" },
    { nombre: "Risotto", precio: 12.75, imagen: "/images/comidas/risotto.jpg" },
    { nombre: "Sopa de Tomate", precio: 6.25, imagen: "/images/comidas/sopa-tomate.jpg" },
    { nombre: "Tacos", precio: 9.5, imagen: "/images/comidas/tacos.jpg" },
    { nombre: "Tomahawk", precio: 24.99, imagen: "/images/comidas/tomahawk.jpg" }
  ],
  bebidas: [
    { nombre: "Limonada", precio: 3.5, imagen: "/images/bebidas/limonada.jpg" },
    { nombre: "Mojito", precio: 5.5, imagen: "/images/bebidas/mojito.jpg" },
    { nombre: "Coca Cola", precio: 2.75, imagen: "/images/bebidas/coca_cola.jpg" },
    { nombre: "Té Helado", precio: 3.25, imagen: "/images/bebidas/te_helado.jpg" },
    { nombre: "Cabernet", precio: 4.0, imagen: "/images/bebidas/cabernet.jpg" },
    { nombre: "Jugo China", precio: 2.5, imagen: "/images/bebidas/jugo_china.jpg" },
    { nombre: "Jugo Uva", precio: 2.5, imagen: "/images/bebidas/jugo_uva.jpg" },
    { nombre: "Pinot Grigio", precio: 4.5, imagen: "/images/bebidas/pinot.jpg" },
    { nombre: "Rose", precio: 4.5, imagen: "/images/bebidas/rose.jpg" },
    { nombre: "Moet", precio: 5.0, imagen: "/images/bebidas/moet.jpg" }
  ],
  postres: [
    { nombre: "Flan", precio: 4.0, imagen: "/images/postres/flan.jpg" },
    { nombre: "Tiramisu", precio: 4.75, imagen: "/images/postres/tiramisu.jpg" }
  ]
}

function Menu({ credit = 1500, puntosIniciales = 0 }) {
  const [orden, setOrden] = useState([])
  const [fecha, setFecha] = useState("")
  const [hora, setHora] = useState("")
  const [mostrarReserva, setMostrarReserva] = useState(false)
  const [puntos, setPuntos] = useState(puntosIniciales)
  const [creditoRestante, setCreditoRestante] = useState(credit)

  const handleAgregar = (item) => {
    setOrden([...orden, item])
    setPuntos((prev) => prev + 10)
    setCreditoRestante((prev) => prev - item.precio)
  }

  const handleReserva = async () => {
    const { data: user } = await supabase.auth.getUser()
    const { data, error } = await supabase.from("reservas").insert([
      {
        user_id: user.data.user.id,
        fecha,
        hora,
        items: orden,
        propina: 18,
        total: orden.reduce((acc, item) => acc + item.precio, 0)
      }
    ])
    if (!error) {
      alert("✅ Reserva completada con éxito")
      setOrden([])
    }
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <img src="/images/logo/logo1.jpg" alt="DineFlexx" className="h-10 w-10 object-contain rounded-full" />
        <h1 className="text-3xl font-bold">DineFlexx Restaurant</h1>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold">💰 Crédito Disponible: <span className="text-green-600">${creditoRestante.toFixed(2)}</span></p>
          <p className="text-lg font-semibold">🎁 Puntos Acumulados: <span className="text-blue-600">{puntos}</span></p>
        </div>
        <button onClick={() => setMostrarReserva(!mostrarReserva)} className="bg-blue-600 text-white px-4 py-2 rounded-xl mt-4 md:mt-0">
          Reservar
        </button>
      </div>

      {mostrarReserva && (
        <div className="bg-white p-4 rounded-2xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Reservar en Dine Restaurant</h2>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full mb-2 p-2 border rounded" />
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className="w-full mb-2 p-2 border rounded" />
          <button onClick={handleReserva} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Reservar ahora</button>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-xl shadow mb-6">
        <h2 className="text-xl font-bold">👨‍🍳 Recomendación del Chef</h2>
        <p className="text-sm text-gray-700">Risotto con parmesano y champiñones</p>
        <p className="text-green-600 text-sm">🎯 Obtienes puntos adicionales con este plato</p>
        <img src="/images/comidas/risotto.jpg" alt="Risotto" className="w-full h-48 object-cover rounded-xl my-2" />
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold">$12.75</p>
          <button onClick={() => handleAgregar({ nombre: "Risotto", precio: 12.75 })} className="bg-blue-600 text-white px-4 py-2 rounded-xl">
            + Agregar
          </button>
        </div>
      </div>

      {Object.entries(menuData).map(([seccion, items]) => (
        <div key={seccion} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 capitalize">{seccion}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow">
                <img src={item.imagen} alt={item.nombre} className="h-40 w-full object-cover rounded mb-3" />
                <h3 className="text-lg font-medium mb-1">{item.nombre}</h3>
                <p className="text-blue-600 font-semibold mb-2">${item.precio.toFixed(2)}</p>
                <button onClick={() => handleAgregar(item)} className="bg-blue-600 text-white w-full py-1.5 rounded-xl hover:bg-blue-700">
                  + Agregar
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Menu
