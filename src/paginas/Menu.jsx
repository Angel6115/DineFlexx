// src/paginas/Menu.jsx
import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { useOrder } from "../context/OrderContext"

export default function Menu() {
  const { agregarItem, credit, puntos } = useOrder()
  const [restaurante, setRestaurante] = useState(null)
  const [menuItems, setMenuItems] = useState({ comida: [], bebida: [], postre: [] })

  useEffect(() => {
    const fetchData = async () => {
      const { data: restaurantes, error: restError } = await supabase
        .from("restaurantes")
        .select("*")
        .limit(1)

      if (restError || !restaurantes || restaurantes.length === 0) {
        console.warn("No hay restaurantes.")
        return
      }

      const res = restaurantes[0]
      setRestaurante(res)

      const { data: items, error: itemsError } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurante_id", res.id)

      if (itemsError) {
        console.error("Error al cargar menú:", itemsError)
        return
      }

      const agrupado = { comida: [], bebida: [], postre: [] }
      items.forEach((item) => {
        const tipo = item.tipo?.toLowerCase()
        if (agrupado[tipo]) agrupado[tipo].push(item)
      })

      setMenuItems(agrupado)
    }

    fetchData()
  }, [])

  if (!restaurante) {
    return <p className="text-center p-6 text-red-500">No se encontró ningún restaurante registrado.</p>
  }

  return (
    <div className="p-4 max-w-7xl mx-auto font-sans">
      <div className="flex items-center gap-4 mb-6">
        <img src="/images/logo3.jpg" alt="Logo" className="h-14" />
        <h1 className="text-3xl font-bold">{restaurante.nombre}</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 flex flex-col md:flex-row justify-between">
        <div>
          <p className="text-lg font-semibold">
            💰 Crédito Disponible: <span className="text-green-600">${Number(credit || 0).toFixed(2)}</span>
          </p>
          <p className="text-lg font-semibold">
            🎁 Puntos Acumulados: <span className="text-blue-600">{puntos}</span>
          </p>
        </div>
      </div>

      <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-2xl shadow-xl mb-10">
        <h2 className="text-xl font-bold mb-1">👨‍🍳 Recomendación del Chef</h2>
        <p>{restaurante.recomendacion}</p>
        <img
          src={restaurante.imagen}
          alt="Recomendación"
          className="w-full h-60 object-cover rounded-xl my-3"
        />
        <p className="text-sm text-gray-600 mb-2">
          📍 {restaurante.ubicacion} - {restaurante.distancia}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => agregarItem({ nombre: restaurante.recomendacion, precio: 12.75 })}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition"
          >
            + Agregar
          </button>
          <button className="bg-green-600 text-white px-5 py-2 rounded-xl shadow hover:bg-green-700 transition">
            📅 Reservar Mesa
          </button>
        </div>
      </div>

      {Object.entries(menuItems).map(([tipo, items]) => (
        <div key={tipo} className="mb-14">
          <h2 className="text-2xl font-bold capitalize mb-6">{tipo}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="h-40 w-full object-contain rounded-xl mb-4"
                />
                <h3 className="text-xl font-semibold mb-1">{item.nombre}</h3>
                <p className="text-blue-600 font-bold mb-3">${Number(item.precio || 0).toFixed(2)}</p>
                <button
                  onClick={() => agregarItem(item)}
                  className="bg-blue-600 text-white w-full py-2 rounded-xl hover:bg-blue-700"
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
