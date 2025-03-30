import { Link } from "react-router-dom"
import { LogOut } from "lucide-react"

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-white shadow">
      <div className="flex items-center gap-3">
        <img src="/images/logo1.jpg" alt="DineFlexx Logo" className="w-10 h-10 rounded-full" />
        <h1 className="text-xl font-bold">DineFlexx</h1>
      </div>
      <div className="flex items-center gap-6">
        <Link to="/" className="flex flex-col items-center text-blue-600 hover:underline">
          <div className="bg-blue-100 p-2 rounded-full">
            🛟
          </div>
          Soporte
        </Link>
        <Link to="/perfil" className="flex flex-col items-center text-blue-600 hover:underline">
          <div className="bg-blue-100 p-2 rounded-full">
            👤
          </div>
          Perfil
        </Link>
        <Link to="/menu" className="flex flex-col items-center text-blue-600 hover:underline">
          <div className="bg-blue-100 p-2 rounded-full">
            🍽️
          </div>
          Menú
        </Link>
        <Link to="/dashboard" className="flex flex-col items-center text-blue-600 hover:underline">
          <div className="bg-blue-100 p-2 rounded-full">
            📅
          </div>
          Reservas
        </Link>
        <button className="flex items-center gap-2 text-red-600 hover:underline">
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}

export default Navbar
