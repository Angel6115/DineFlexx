// src/paginas/PublicRestaurants.jsx
import { Link } from 'react-router-dom'
import Restaurants from './Restaurants.jsx'

export default function PublicRestaurants() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Restaurantes Participantes
      </h1>

      <Restaurants />

      <div className="text-center mt-8">
        <p className="mb-4 text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Ingresa
          </Link>{' '}
          para hacer pedidos.
        </p>
        <p className="text-gray-600">
          ¿Aún no te registras?{' '}
          <Link to="/register" className="text-green-600 hover:underline">
            Crea tu cuenta
          </Link>{' '}
          y disfruta DineFlexx.
        </p>
      </div>
    </div>
  )
}
