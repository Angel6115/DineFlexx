// src/paginas/Menu.jsx
import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { useOrder } from "../context/OrderContext"

export default function Menu() {
  const { agregarItem, credit, puntos } = useOrder()
  const [restaurante, setRestaurante] = useState(null)
  const [menuItems, setMenuItems] = useState({ comidas: [], bebidas: [], postres: [] })

  useEffect(() => {
    const fetchData = async () => {
      const { data: restaurantes, error: restError } = await supabase
        .from("restaurantes")
        .select("*")
        .limit(1)

      if (restError || !restaurantes?.length) {
        console.warn("No se encontró restaurante.")
        return
      }

      const restauranteSeleccionado = restaurantes[0]
      setRestaurante(restauranteSeleccionado)

      const { data: items, error: itemsError } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurante_id", restauranteSeleccionado.id)

      if (itemsError) {
        console.error("Error cargando menú:", itemsError)
        return
      }

      const agrupado = { comidas: [], bebidas: [], postres: [] }
      const mapTipo = {
        comida: "comidas",
        bebida: "bebidas",
        postre: "postres"
      }

      items.forEach((item) => {
        const tipoKey = mapTipo[item.tipo?.toLowerCase()]
        if (tipoKey) agrupado[tipoKey].push(item)
      })

      setMenuItems(agrupado)
    }

    fetchData()
  }, [])

  if (!restaurante) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        No se encontró ningún restaurante registrado.
      </div>
    )
  }

  return (
    <div className="p-4 max-w-7xl mx-auto font-sans">
      <div className="flex items-center gap-4 mb-6">
        <img src="/images/logo3.jpg" alt="DineFlexx" className="h-14 w-auto object-contain" />
        <h1 className="text-3xl font-bold text-gray-800">{restaurante.nombre}</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <p className="text-lg font-semibold">
          💰 Crédito Disponible: <span className="text-green-600">${credit.toFixed(2)}</span>
        </p>
        <p className="text-lg font-semibold">
          🎁 Puntos Acumulados: <span className="text-blue-600">{puntos}</span>
        </p>
      </div>

      <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-xl shadow mb-10">
        <h2 className="text-xl font-bold mb-1">👨‍🍳 Recomendación del Chef</h2>
        <p className="text-gray-700">{restaurante.recomendacion}</p>
        <img
          src={restaurante.imagen}
          alt="Recomendación"
          className="w-full h-60 object-cover rounded-xl my-3"
        />
        <p className="text-sm text-gray-600 mb-2">
          📍 {restaurante.ubicacion} - {restaurante.distancia}
        </p>
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <button
            onClick={() => agregarItem({ nombre: restaurante.recomendacion, precio: 12.75 })}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            + Agregar
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg">
            📅 Reservar Mesa
          </button>
        </div>
      </div>

      {Object.entries(menuItems).map(([categoria, items]) => (
        <div key={categoria} className="mb-14">
          <h2 className="text-2xl font-bold mb-4 capitalize">{categoria}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="h-40 w-full object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold">{item.nombre}</h3>
                <p className="text-blue-600 font-bold mb-3">
                  ${Number(item.precio || 0).toFixed(2)}
                </p>
                <button
                  onClick={() => agregarItem(item)}
                  className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700"
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
