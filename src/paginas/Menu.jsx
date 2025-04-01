import { useState } from "react"
import { supabase } from "../supabaseClient"

const menuData = {
  comidas: [
    { nombre: "Bruschetta", precio: 7.5, imagen: "/images/comidas/bruschetta.jpg" },
    { nombre: "Paella", precio: 14.99, imagen: "/images/comidas/paella.jpg" },
    { nombre: "Pasta", precio: 11.5, imagen: "/images/comidas/pasta.jpg" },
    { nombre: "Sopa de Tomate", precio: 6.25, imagen: "/images/comidas/sopa-tomate.jpg" },
    { nombre: "Tacos", precio: 9.5, imagen: "/images/comidas/tacos.jpg" },
    { nombre: "Tomahawk", precio: 24.99, imagen: "/images/comidas/tomahawk.jpg" }
  ],
  bebidas: [
    { nombre: "Limonada", precio: 3.5, imagen: "/images/bebidas/limonada.jpg" },
    { nombre: "Mojito", precio: 5.5, imagen: "/images/bebidas/mojito.jpg" },
    { nombre: "Coca Cola", precio: 2.75, imagen: "/images/bebidas/coca_cola.jpg" },
    { nombre: "Cabernet", precio: 4.0, imagen: "/images/bebidas/cabernet.jpg" },
    { nombre: "Pinot Grigio", precio: 4.5, imagen: "/images/bebidas/pinot.jpg" },
    { nombre: "Rose", precio: 4.5, imagen: "/images/bebidas/rose.jpg" },
    { nombre: "Moet", precio: 5.0, imagen: "/images/bebidas/moet.jpg" }
  ],
  postres: [
    { nombre: "Flan", precio: 4.0, imagen: "/images/postres/flan.jpg" },
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

  return (
    <div className="relative font-sans">
      {/* Header sticky */}
      <div className="sticky top-0 z-50 bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/images/logo4.png" alt="logo" className="h-10 w-auto object-contain" />
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">DineFlexx Restaurant</h1>
        </div>
        <div className="text-right">
          <p className="text-green-600 font-semibold">💰 Crédito: ${credito.toFixed(2)}</p>
          <p className="text-blue-600 font-semibold">🎁 Puntos: {puntos}</p>
        </div>
      </div>

      {/* Chef Recommendation */}
      <div className="bg-yellow-100 p-5 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-1">👨‍🍳 Recomendación del Chef</h2>
          <p className="text-gray-700">Risotto con parmesano y champiñones</p>
          <p className="text-green-600 text-sm mb-2">🎯 Puntos adicionales con este plato</p>
          <button
            onClick={() => handleAgregar({ nombre: "Risotto", precio: 12.75 })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl mt-2 shadow"
          >
            + Agregar Risotto ($12.75)
          </button>
        </div>
        <img
          src="/images/comidas/risotto.jpg"
          alt="Risotto"
          className="w-48 h-32 object-cover rounded-xl shadow"
        />
      </div>

      {/* Secciones del menú */}
      <div className="p-6 max-w-7xl mx-auto">
        {Object.entries(menuData).map(([categoria, items]) => (
          <div key={categoria} className="mb-10">
            <h2 className="text-2xl font-bold capitalize mb-4 text-gray-700">{categoria}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 shadow hover:shadow-lg transition flex flex-col"
                >
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="h-40 object-contain mb-3 rounded-xl"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">{item.nombre}</h3>
                  <p className="text-blue-600 font-bold text-sm mb-3">${item.precio.toFixed(2)}</p>
                  <button
                    onClick={() => handleAgregar(item)}
                    className="bg-blue-600 text-white py-2 rounded-xl mt-auto hover:bg-blue-700"
                  >
                    + Agregar
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
