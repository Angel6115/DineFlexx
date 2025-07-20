import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import supabase from '../supabaseClient'
import { useOrder } from '../context/OrderContext'

export default function RestaurantDetail() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const { agregarItem } = useOrder()

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      // Obtener datos del restaurante
      const { data: restData, error: restError } = await supabase
        .from('restaurants')
        .select('name, address')
        .eq('id', id)
        .single()

      if (restError) {
        console.error('❌ Error al cargar restaurante:', restError)
      } else {
        setRestaurant(restData)
      }

      // Obtener menú activo
      const { data: menuData, error: menuError } = await supabase
        .from('menus')
        .select('id, name, description, price, category, image_url')
        .eq('restaurant_id', id)
        .eq('is_active', true)
        .order('category', { ascending: true })

      if (menuError) {
        console.error('❌ Error al cargar menú:', menuError)
      } else {
        setMenu(menuData)
      }

      setLoading(false)
    }

    fetchRestaurantAndMenu()
  }, [id])

  if (loading) return <div className="p-8 text-center">Cargando...</div>
  if (!restaurant) return <div className="p-8 text-center">Restaurante no encontrado.</div>

  // Agrupación de ítems únicos por nombre y categoría
  const uniqueMenu = menu.filter(
    (item, index, arr) =>
      arr.findIndex((i) => i.name === item.name) === index
  )

  const grouped = uniqueMenu.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  return (
    <div className="p-8">
      <Link to="/restaurants" className="text-blue-600 underline block mb-4">
        ← Volver a Restaurantes
      </Link>

      <h1 className="text-3xl font-bold mb-1">{restaurant.name}</h1>
      {restaurant.address && (
        <p className="text-gray-600 mb-6">{restaurant.address}</p>
      )}

      {Object.keys(grouped).length === 0 ? (
        <p className="text-gray-500">Este restaurante no tiene menú disponible.</p>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <section key={category} className="mb-10">
            <h2 className="text-xl font-semibold mb-4">{category}</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item) => {
                const image = item.image_url || '/images/menus/placeholder.png'
                return (
                  <li key={item.id} className="border rounded-xl p-4 shadow-sm flex flex-col bg-white">
                    <img
                      src={image}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1 mb-2">{item.description}</p>
                      )}
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-medium text-green-700">${item.price.toFixed(2)}</span>
                      <button
                        onClick={() =>
                          agregarItem({
                            id: item.id,
                            restaurant_id: id,
                            name: item.name,
                            price: item.price,
                            quantity: 1,
                          })
                        }
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
