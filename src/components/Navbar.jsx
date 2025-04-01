// src/components/Navbar.jsx
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { supabase } from "../supabaseClient"
import { LogOut, Menu as MenuIcon, X } from "lucide-react"
import DarkModeToggle from "./DarkModeToggle"

export default function Navbar() {
  const location = useLocation()
  const [userEmail, setUserEmail] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserEmail(user.email)
    }
    fetchUser()
  }, [])

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

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-600 dark:text-gray-300"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>

        <div className="hidden md:flex items-center gap-4">
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

          <DarkModeToggle />

          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-500 dark:text-gray-300 text-right">
              <p className="font-medium text-sm">{userEmail || "Usuario"}</p>
              <Link
                to="/logout"
                className="text-red-500 hover:underline text-xs flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" /> Cerrar sesión
              </Link>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-medium px-3 py-2 rounded-md transition ${
                location.pathname === to
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="flex justify-between items-center pt-2">
            <DarkModeToggle />
            <Link
              to="/logout"
              onClick={() => setMobileMenuOpen(false)}
              className="text-red-600 text-sm flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" /> Salir
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
