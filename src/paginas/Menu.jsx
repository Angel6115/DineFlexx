import { useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../supabaseClient"

const menuData = {
  comidas: [
    { nombre: "Bruschetta", precio: 7.5, imagen: "/images/comidas/bruschetta.jpg" },
    { nombre: "Paella", precio: 14.99, imagen: "/images/comidas/paella.jpg" },
    { nombre: "Tomahawk", precio: 24.99, imagen: "/images/comidas/tomahawk.jpg" }
  ],
  bebidas: [
    { nombre: "Coca Cola", precio: 2.75, imagen: "/images/bebidas/coca_cola.jpg" },
    { nombre: "Moet", precio: 5.0, imagen: "/images/bebidas/moet.jpg" }
  ],
  postres: [
    { nombre: "Tiramisu", precio: 4.75, imagen: "/images/postres/tiramisu.jpg" }
  ]
}

export default function Menu() {
  const [orden, setOrden] = useState([])
  const [puntos, setPuntos] = useState(0)
  const [credito, setCredito] = useState(1500)

  const handleAgregar = (item) => {
    setOrden([...orden, item])
    setPuntos((prev) => prev + 10)
    setCredito((prev) => prev - item.precio)
  }

  const total = orden.reduce((acc, item) => acc + item.precio, 0)

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto gap-6 p-4">
      {/* Menú principal */}
      <div className="flex-1">
        <div className="mb-6">
          <img src="/images/logo3.png" className="h-16 mb-2" alt="Logo DineFlexx" />
          <h1 className="text-3xl font-bold text-gray-800">Menú</h1>
        </div>

        {Object.entries(menuData).map(([categoria, items]) => (
          <div key={categoria} className="mb-10">
            <h2 className="text-xl font-semibold capitalize mb-4">{categoria}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl shadow p-4">
                  <img src={item.imagen} alt={item.nombre} className="w-full h-40 object-cover rounded-xl mb-2" />
                  <h3 className="text-md font-semibold">{item.nombre}</h3>
                  <p className="text-blue-600 font-bold">${item.precio.toFixed(2)}</p>
                  <button
                    onClick={() => handleAgregar(item)}
                    className="mt-2 bg-blue-600 text-white px-4 py-1 rounded-xl hover:bg-blue-700"
                  >
                    + Agregar
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Sticky */}
      <div className="md:w-80 sticky top-4 self-start bg-white shadow-lg rounded-2xl p-6 h-fit">
        <h2 className="text-xl font-semibold mb-4">🧾 Resumen del Pedido</h2>
        <p className="mb-2 text-green-700 font-medium">Crédito restante: ${credito.toFixed(2)}</p>
        <ul className="text-sm mb-4 space-y-1">
          {orden.map((item, i) => (
            <li key={i} className="flex justify-between text-gray-700">
              <span>{item.nombre}</span>
              <span>${item.precio.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <p className="font-bold text-gray-800 mb-2">Total: ${total.toFixed(2)}</p>
        <Link to="/checkout" className="block text-center bg-black text-white py-2 rounded-xl hover:bg-gray-800">
          Ir a Checkout
        </Link>
      </div>
    </div>
  )
}
