import { Link } from "react-router-dom"
import logo from "/images/logo1.jpg"

export default function Navbar() {
  return (
    <nav className="bg-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-10 w-10 rounded-full object-cover" />
          <span className="text-white text-xl font-bold">DineFlexx</span>
        </div>

        <div className="flex space-x-6">
          <Link to="/" className="text-sm font-semibold text-white hover:text-yellow-300 transition">
            🏠 Inicio
          </Link>
          <Link to="/menu" className="text-sm font-semibold text-white hover:text-yellow-300 transition">
            🍽️ Menú
          </Link>
          <Link to="/perfil" className="text-sm font-semibold text-white hover:text-yellow-300 transition">
            👤 Perfil
          </Link>
          <Link to="/reservas" className="text-sm font-semibold text-white hover:text-yellow-300 transition">
            📆 Reservas
          </Link>
          <Link to="/logros" className="text-sm font-semibold text-white hover:text-yellow-300 transition">
            🏅 Logros
          </Link>
          <Link to="/referidos" className="text-sm font-semibold text-white hover:text-yellow-300 transition">
            🎁 Referidos
          </Link>
          <Link to="/soporte" className="text-sm font-semibold text-white hover:text-yellow-300 transition">
            🛠️ Soporte
          </Link>
        </div>
      </div>
    </nav>
  )
}
