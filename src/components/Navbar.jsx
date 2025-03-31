import { Link, useLocation } from "react-router-dom"

export default function Navbar() {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-black text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/images/logo1.jpg"
            alt="DineFlexx Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-end text-sm sm:text-base">
          <NavLink path="/" label="Inicio" isActive={isActive} />
          <NavLink path="/menu" label="Menú" isActive={isActive} />
          <NavLink path="/perfil" label="Perfil" isActive={isActive} />
          <NavLink path="/referidos" label="Referidos" isActive={isActive} />
          <NavLink path="/soporte" label="Soporte" isActive={isActive} />
          <NavLink path="/checkout" label="Checkout" isActive={isActive} />
        </div>
      </div>
    </nav>
  )
}

function NavLink({ path, label, isActive }) {
  return (
    <Link
      to={path}
      className={`px-3 py-2 rounded-xl transition ${
        isActive(path)
          ? "bg-white text-black font-semibold"
          : "hover:bg-white hover:text-black"
      }`}
    >
      {label}
    </Link>
  )
}
