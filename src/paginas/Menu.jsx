// src/paginas/Menu.jsx
import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { useOrder } from "../context/OrderContext"

export default function Menu() {
  const { agregarItem, credit, puntos } = useOrder()
  const [restaurante, setRestaurante] = useState(null)
  const [menuItems, setMenuItems] = useState({ comidas: [], bebidas: [], postres: [] })

  useEffect(() => {
    const fetchRestauranteYMenu = async () => {
      try {
        const { data: restaurantes, error: restError } = await supabase
          .from("restaurantes")
          .select("*")
          .limit(1)

        if (restError || !restaurantes || restaurantes.length === 0) {
          console.warn("No hay restaurantes registrados.")
          setRestaurante(null)
          return
        }

        const res = restaurantes[0]
        setRestaurante(res)

        const { data: items, error: itemsError } = await supabase
          .from("menu_items")
          .select("*")
          .eq("restaurante_id", res.id)

        if (itemsError) {
          console.error("Error cargando menú:", itemsError)
          return
        }

        console.log("Items cargados desde Supabase:", items)

        const agrupado = { comidas: [], bebidas: [], postres: [] }
        items.forEach((item) => {
          const tipo = item.tipo?.toLowerCase()
          if (["comida", "comidas"].includes(tipo)) agrupado.comidas.push(item)
          else if (["bebida", "bebidas"].includes(tipo)) agrupado.bebidas.push(item)
          else if (["postre", "postres"].includes(tipo)) agrupado.postres.push(item)
        })

        setMenuItems(agrupado)
      } catch (err) {
        console.error("Error general:", err)
      }
    }

    fetchRestauranteYMenu()
  }, [])

  if (restaurante === null) {
    return (
      <p className="p-6 text-center text-red-500 font-semibold">
        No se encontró ningún restaurante registrado.
      </p>
    )
  }

  return (
    <div className="p-4 max-w-7xl mx-auto font-sans">
      <div className="flex items-center gap-4 mb-6">
        <img src="/images/logo3.jpg" alt="DineFlexx" className="h-14 w-auto object-contain shadow" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-800 dark:text-white">
          {restaurante.nombre}
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl mb-8 flex flex-col md:flex-row md:items-center md:justify-between sticky top-0 z-10">
        <div>
          <p className="text-lg md:text-xl font-semibold">
            💰 Crédito Disponible: <span className="text-green-600">${Number(credit || 0).toFixed(2)}</span>
          </p>
          <p className="text-lg md:text-xl font-semibold">
            🎁 Puntos Acumulados: <span className="text-blue-600">{puntos}</span>
          </p>
        </div>
      </div>

      <div className="bg-yellow-100 dark:bg-yellow-200 border border-yellow-300 p-4 rounded-2xl shadow-xl mb-10 sticky top-24 z-10">
        <h2 className="text-lg md:text-xl font-bold mb-1">👨‍🍳 Recomendación del Chef</h2>
        <p className="text-gray-700">{restaurante.recomendacion}</p>
        <img
          src={restaurante.imagen}
          alt="Recomendación"
          className="w-full h-60 object-cover rounded-xl shadow my-3"
        />
        <p className="text-sm text-gray-600 mb-2">📍 {restaurante.ubicacion} - {restaurante.distancia}</p>
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <button
            onClick={() => agregarItem({ nombre: restaurante.recomendacion, precio: 12.75 })}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition"
          >
            + Agregar
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow transition">
            📅 Reservar Mesa
          </button>
        </div>
      </div>

      {Object.entries(menuItems).map(([seccion, items]) => (
        <div key={seccion} className="mb-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 capitalize text-gray-800 dark:text-white">
            {seccion}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md hover:shadow-xl transition flex flex-col justify-between"
              >
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="h-40 md:h-48 w-full object-contain rounded-xl mb-4"
                />
                <h3 className="text-lg md:text-xl font-semibold mb-1 text-gray-800 dark:text-white">{item.nombre}</h3>
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
