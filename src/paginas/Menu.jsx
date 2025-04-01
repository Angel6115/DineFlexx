import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { useOrder } from "../context/OrderContext"

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
  const { agregarItem, total, puntos, credit } = useOrder()

  return (
    <div className="p-4 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <img src="/images/foto4.jpg" alt="DineFlexx" className="h-12 w-12 object-contain shadow" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-800">DineFlexx Restaurant</h1>
      </div>

      {/* Resumen de crédito */}
      <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 flex flex-col md:flex-row md:items-center md:justify-between sticky top-0 z-10">
        <div>
          <p className="text-lg md:text-xl font-semibold">
            💰 Crédito Disponible: <span className="text-green-600">${Number(credit || 0).toFixed(2)}</span>
          </p>
          <p className="text-lg md:text-xl font-semibold">
            🎁 Puntos Acumulados: <span className="text-blue-600">{puntos}</span>
          </p>
        </div>
      </div>

      {/* Recomendación del Chef */}
      <div className="relative w-full max-h-[420px] overflow-hidden rounded-2xl shadow-xl mb-10">
        <img
          src="/images/comidas/risotto.jpg"
          alt="Recomendación del Chef"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 p-6 flex flex-col justify-between text-white">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">👨‍🍳 Recomendación del Chef</h2>
            <p className="text-sm md:text-base mb-1">Risotto con parmesano y champiñones</p>
            <p className="text-green-300 text-sm">🎯 Obtienes puntos adicionales con este plato</p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="text-lg md:text-xl font-semibold">$12.75</p>
            <button
              onClick={() => agregarItem({ nombre: "Risotto", precio: 12.75 })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow transition"
            >
              + Agregar
            </button>
          </div>
        </div>
      </div>

      {/* Menú general */}
      {Object.entries(menuData).map(([seccion, items]) => (
        <div key={seccion} className="mb-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 capitalize text-gray-800">{seccion}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition flex flex-col justify-between"
              >
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="h-40 md:h-48 w-full object-contain rounded-xl mb-4"
                />
                <h3 className="text-lg md:text-xl font-semibold mb-1">{item.nombre}</h3>
                <p className="text-blue-600 font-bold text-md md:text-lg mb-3">
                  ${Number(item.precio || 0).toFixed(2)}
                </p>
                <button
                  onClick={() => agregarItem(item)}
                  className="bg-blue-600 text-white w-full py-2 rounded-xl hover:bg-blue-700 font-medium"
                >
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
