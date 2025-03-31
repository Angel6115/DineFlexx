import { Link, useLocation } from "react-router-dom"

export default function Navbar() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-black text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
        {/* Logo + Título */}
        <div className="flex items-center gap-3">
          <img
            src="/images/logo1.jpg"
            alt="DineFlexx"
            className="h-10 w-auto object-contain shadow rounded-xl"
          />
          <span className="text-xl font-bold tracking-tight">DineFlexx</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-end text-sm sm:text-base">
          <Link
            to="/"
            className={`px-4 py-2 rounded-xl transition ${
              isActive("/") ? "bg-white text-black font-semibold" : "hover:bg-white hover:text-black"
            }`}
          >
            Inicio
          </Link>
          <Link
            to="/menu"
            className={`px-4 py-2 rounded-xl transition ${
              isActive("/menu") ? "bg-white text-black font-semibold" : "hover:bg-white hover:text-black"
            }`}
          >
            Menú
          </Link>
          <Link
            to="/perfil"
            className={`px-4 py-2 rounded-xl transition ${
              isActive("/perfil") ? "bg-white text-black font-semibold" : "hover:bg-white hover:text-black"
            }`}
          >
            Perfil
          </Link>
          <Link
            to="/referidos"
            className={`px-4 py-2 rounded-xl transition ${
              isActive("/referidos") ? "bg-white text-black font-semibold" : "hover:bg-white hover:text-black"
            }`}
          >
            Referidos
          </Link>
          <Link
            to="/soporte"
            className={`px-4 py-2 rounded-xl transition ${
              isActive("/soporte") ? "bg-white text-black font-semibold" : "hover:bg-white hover:text-black"
            }`}
          >
            Soporte
          </Link>
          <Link
            to="/checkout"
            className={`px-4 py-2 rounded-xl transition ${
              isActive("/checkout") ? "bg-white text-black font-semibold" : "hover:bg-white hover:text-black"
            }`}
          >
            Checkout
          </Link>
        </div>
      </div>
    </nav>
  )
}
