import { Link, useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    localStorage.clear()
    navigate("/")
  }

  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-white shadow">
      <div className="flex items-center gap-3">
        <img src="/images/logo1.jpg" alt="DineFlexx Logo" className="w-10 h-10 rounded-full" />
        <h1 className="text-xl font-bold">DineFlexx</h1>
      </div>
      <div className="flex items-center gap-6">
        <Link to="/soporte" className="flex flex-col items-center text-blue-600 hover:underline">
          <div className="bg-blue-100 p-2 rounded-full">
            <span role="img" aria-label="soporte">🛟</span>
          </div>
          Soporte
        </Link>
        <Link to="/perfil" className="flex flex-col items-center text-blue-600 hover:underline">
          <div className="bg-blue-100 p-2 rounded-full">
            <span role="img" aria-label="perfil">👤</span>
          </div>
          Perfil
        </Link>
        <Link to="/menu" className="flex flex-col items-center text-blue-600 hover:underline">
          <div className="bg-blue-100 p-2 rounded-full">
            <span role="img" aria-label="menu">🍽️</span>
          </div>
          Menú
        </Link>
        <Link to="/reservas" className="flex flex-col items-center text-blue-600 hover:underline">
          <div className="bg-blue-100 p-2 rounded-full">
            <span role="img" aria-label="reservas">📅</span>
          </div>
          Reservas
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}

export default Navbar


