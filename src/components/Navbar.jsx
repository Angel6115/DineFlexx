// src/components/Navbar.jsx
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import supabase from "./supabaseClient"; // ✅
import { useOrder } from "../context/OrderContext"
import { LogOut, Menu as MenuIcon, X } from "lucide-react"
import DarkModeToggle from "./DarkModeToggle"

export default function Navbar() {
  const location = useLocation()
  const [userEmail, setUserEmail] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { items } = useOrder()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserEmail(user.email)
    })
  }, [])

  const links = [
    { to: "/restaurants", label: "Restaurantes" },
    { to: "/cart",        label: `Carrito (${items.reduce((sum, i) => sum + i.quantity, 0)})` },
    { to: "/wallet",      label: "Wallet" },
    { to: "/perfil",      label: "Perfil" },
    { to: "/soporte",     label: "Soporte" },
    { to: "/dashboard",   label: "Dashboard" },
  ]

  return (
    <nav className="bg-white dark:bg-gray-900 border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/restaurants" className="flex items-center gap-2">
          <img src="/images/logo3.jpg" alt="DineFlexx" className="h-10 w-10" />
          <span className="font-bold text-lg text-gray-800 dark:text-white">DineFlexx</span>
        </Link>
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6"/> : <MenuIcon className="w-6 h-6"/>}
        </button>
        <div className="hidden md:flex items-center gap-4">
          {links.map(({to,label})=>(
            <Link
              key={to}
              to={to}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname.startsWith(to)
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {label}
            </Link>
          ))}
          <DarkModeToggle />
          <div className="flex items-center gap-2">
            <div className="text-right text-xs text-gray-500 dark:text-gray-300">
              <p className="font-medium">{userEmail||"Usuario"}</p>
              <Link to="/logout" className="flex items-center gap-1 text-red-500 hover:underline">
                <LogOut className="w-3 h-3"/> Cerrar sesión
              </Link>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {userEmail ? userEmail[0].toUpperCase() : "U"}
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {links.map(({to,label})=>(
            <Link
              key={to}
              to={to}
              onClick={()=>setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname.startsWith(to)
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="flex justify-between items-center pt-2">
            <DarkModeToggle />
            <Link to="/logout" onClick={()=>setMobileMenuOpen(false)} className="text-red-600 text-sm flex items-center gap-1">
              <LogOut className="w-4 h-4"/> Salir
            </Link>
          </div>
        </div>
      )}
    </nav>
)
}
