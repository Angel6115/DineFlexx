// src/paginas/OrdenConfirmada.jsx
import { Link } from "react-router-dom"

export default function OrdenConfirmada() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">✅ ¡Pedido realizado con éxito!</h1>
      <p className="text-gray-700 mb-6">
        Tu orden ha sido procesada correctamente. Pronto recibirás notificaciones del estado.
      </p>
      <Link
        to="/restaurants"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow"
      >
        Volver a Restaurantes
      </Link>
    </div>
  )
}
