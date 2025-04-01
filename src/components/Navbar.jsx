// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom"
import { LogOut } from "lucide-react"
import DarkModeToggle from "./DarkModeToggle"

export default function Navbar() {
  const location = useLocation()

  const links = [
    { to: "/menu", label: "Menú" },
    { to: "/wallet", label: "Wallet" },
    { to: "/perfil", label: "Perfil" },
    { to: "/soporte", label: "Soporte" },
    { to: "/dashboard", label: "Dashboard" }
  ]

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/menu" className="flex items-center gap-2">
          <img src="/images/logo3.jpg" alt="DineFlexx" className="h-10 w-10 object-contain" />
          <span className="font-bold text-lg text-gray-800 dark:text-white">DineFlexx</span>
        </Link>

        <div className="hidden md:flex gap-4">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                location.pathname === to
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <Link
            to="/logout"
            className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" /> Salir
          </Link>
        </div>
      </div>
    </nav>
  )
}
