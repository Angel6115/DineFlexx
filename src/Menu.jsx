import { useState } from "react"
import { supabase } from "../supabaseClient"

const menuData = {
  recomendacion: {
    nombre: "Risotto de Setas",
    precio: 24.99,
    imagen: "/images/comidas/risotto.jpg",
    mensaje: "Obtienes puntos adicionales"
  },
  comidas: [
    { nombre: "Bruschetta", precio: 7.5, imagen: "/images/comidas/bruschetta.jpg" },
    { nombre: "Paella", precio: 14.99, imagen: "/images/comidas/paella.jpg" },
    { nombre: "Pasta", precio: 11.5, imagen: "/images/comidas/pasta.jpg" },
    { nombre: "Risotto", precio: 9.25, imagen: "/images/comidas/risotto.jpg" }
  ],
  bebidas: [
    { nombre: "Jugo Natural", precio: 3.25, imagen: "/images/bebidas/jugo_natural.jpg" },
    { nombre: "Limonada", precio: 3.5, imagen: "/images/bebidas/limonada.jpg" },
    { nombre: "Mojito", precio: 5.5, imagen: "/images/bebidas/mojito.jpg" }
  ],
  postres: [
    { nombre: "Flan", precio: 4.0, imagen: "/images/postres/flan.jpg" },
    { nombre: "Tiramisu", precio: 4.5, imagen: "/images/postres/tiramisu.jpg" }
  ]
}

export default function Menu({ credit, puntosIniciales }) {
  const [orden, setOrden] = useState([])
  const [puntos, setPuntos] = useState(puntosIniciales)
  const [creditoDisponible, setCreditoDisponible] = useState(credit)

  const handleAgregar = (item) => {
    setOrden([...orden, item])
    setPuntos(p => p + 25)
    setCreditoDisponible(c => c - item.precio)
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">DineFlexx - Menú</h1>
        <div>
          <p className="text-green-600 font-semibold">Crédito: ${creditoDisponible.toFixed(2)}</p>
          <p className="text-blue-600 font-semibold">Puntos: {puntos}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <img src={menuData.recomendacion.imagen} alt="Recomendación del Chef" className="rounded-xl h-52 w-full object-cover mb-2" />
        <h2 className="text-xl font-bold mb-1">
          🌟 Recomendación del Chef: {menuData.recomendacion.nombre}
        </h2>
        <p className="text-sm text-green-600">🎁 {menuData.recomendacion.mensaje}</p>
        <p className="font-semibold text-blue-800 mt-1 mb-2">${menuData.recomendacion.precio}</p>
        <button
          onClick={() => handleAgregar(menuData.recomendacion)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >Agregar a mi orden</button>
      </div>

      {Object.entries(menuData).map(([categoria, items]) => (
        categoria !== "recomendacion" && (
          <div key={categoria} className="mb-6">
            <h2 className="text-xl font-bold capitalize mb-4">{categoria}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow p-2 hover:shadow-md transition"
                >
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="rounded-xl h-32 w-full object-cover mb-2"
                  />
                  <h3 className="text-md font-semibold">{item.nombre}</h3>
                  <p className="text-sm text-gray-600 mb-2">${item.precio}</p>
                  <button
                    onClick={() => handleAgregar(item)}
                    className="bg-blue-600 text-white w-full py-1 rounded-lg hover:bg-blue-700"
                  >Agregar</button>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  )
}
