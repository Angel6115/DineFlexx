import { useEffect, useState } from "react"
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
  const [credit, setCredit] = useState(1500)

  const handleAgregar = (item) => {
    setOrden((prev) => [...prev, item])
    setCredit((prev) => prev - item.precio)
  }

  const total = orden.reduce((acc, i) => acc + i.precio, 0)

  return (
    <div className="font-sans">
      <div className="flex justify-between items-center px-4 py-6 bg-white shadow">
        <div className="flex items-center gap-4">
          <img src="/images/logo4.jpg" alt="logo" className="h-12 object-contain" />
          <h1 className="text-2xl font-bold text-gray-800">DineFlexx Restaurant</h1>
        </div>
        <div className="hidden md:block">
          <p className="text-green-600 font-semibold">Crédito: ${credit.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4">
        <div className="md:col-span-3 p-6">
          <div className="bg-yellow-100 border border-yellow-300 p-5 rounded-2xl shadow-xl mb-8 sticky top-4 z-10">
            <h2 className="text-xl md:text-2xl font-bold mb-1">👨‍🍳 Recomendación del Chef</h2>
            <p className="text-gray-700">Risotto con parmesano y champiñones</p>
            <img
              src="/images/comidas/risotto.jpg"
              className="w-full max-h-48 object-cover rounded-xl shadow my-3"
              alt="Chef Recomendación"
            />
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg">$12.75</p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
                onClick={() => handleAgregar({ nombre: "Risotto", precio: 12.75 })}
              >
                + Agregar
              </button>
            </div>
          </div>

          {Object.entries(menuData).map(([categoria, items]) => (
            <div key={categoria} className="mb-12">
              <h2 className="text-2xl font-bold mb-4 capitalize text-gray-800">{categoria}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-4 shadow flex flex-col">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="h-40 w-full object-cover rounded-xl mb-4"
                    />
                    <h3 className="text-lg font-bold text-gray-800">{item.nombre}</h3>
                    <p className="text-blue-600 font-semibold">${item.precio.toFixed(2)}</p>
                    <button
                      onClick={() => handleAgregar(item)}
                      className="mt-auto bg-blue-600 text-white py-2 rounded-xl mt-4 hover:bg-blue-700"
                    >
                      + Agregar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 sticky top-4 h-fit bg-white shadow-xl rounded-2xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">🧾 Tu Orden</h2>
          {orden.length === 0 ? (
            <p className="text-gray-500">No has añadido nada aún.</p>
          ) : (
            <ul className="divide-y divide-gray-200 mb-4">
              {orden.map((item, i) => (
                <li key={i} className="py-2 flex justify-between">
                  <span>{item.nombre}</span>
                  <span className="font-semibold text-sm">${item.precio.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}

          <p className="text-lg font-bold text-gray-700">Total: ${total.toFixed(2)}</p>
          <button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl">
            Continuar al Checkout
          </button>
        </div>
      </div>
    </div>
  )
}
