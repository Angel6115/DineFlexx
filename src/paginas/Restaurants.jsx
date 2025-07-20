import { useEffect, useState } from 'react'
import supabase from '../supabaseClient'
import { Link } from 'react-router-dom'

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('restaurants').select('*')

      if (error) {
        setError('Error al cargar los restaurantes.')
      } else {
        setRestaurants(data || [])
      }

      setLoading(false)
    }

    fetchRestaurants()
  }, [])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">Restaurantes Disponibles</h1>

      {error && (
        <div className="mb-4 text-center bg-red-100 text-red-700 p-3 rounded-md shadow">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Cargando restaurantes...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              to={`/restaurants/${restaurant.id}`}
              className="bg-white shadow rounded-xl p-4 flex flex-col items-center hover:shadow-lg transition"
            >
              {restaurant.image_url ? (
                <img
                  src={restaurant.image_url}
                  alt={restaurant.name}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md mb-3">
                  <span className="text-gray-500">Sin imagen</span>
                </div>
              )}
              <h2 className="text-xl font-semibold mb-1">{restaurant.name}</h2>
              <p className="text-gray-600 text-sm mb-3 text-center">
                {restaurant.description || "Descripción no disponible"}
              </p>
              <span className="text-blue-600 font-medium text-sm">
                Ver menú →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Restaurants
