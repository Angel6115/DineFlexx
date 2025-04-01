// src/components/Navbar.jsx
import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"
import DarkModeToggle from "./DarkModeToggle"
import { motion } from "framer-motion"

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  const linkClass = ({ isActive }) =>
    `transition hover:text-blue-600 ${isActive ? "text-blue-600 font-semibold underline" : ""}`

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl sticky top-0 z-50 shadow-sm border-b border-gray-200 dark:border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/images/logo3.jpg" alt="DineFlexx" className="h-10 w-10 rounded-full object-cover shadow" />
          <span className="text-xl font-bold text-gray-800 dark:text-white">DineFlexx</span>
        </div>

        <div className="hidden md:flex gap-6 items-center text-sm font-medium text-gray-700 dark:text-gray-200">
          <NavLink to="/" className={linkClass}>Inicio</NavLink>
          <NavLink to="/menu" className={linkClass}>Menú</NavLink>
          <NavLink to="/wallet" className={linkClass}>Wallet</NavLink>
          <NavLink to="/perfil" className={linkClass}>Perfil</NavLink>
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <DarkModeToggle />
          {user && (
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 font-semibold transition"
            >
              Cerrar sesión
            </button>
          )}
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 dark:text-white focus:outline-none"
          >
            {menuOpen ? "✖️" : "☰"}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 px-6 ${
          menuOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="space-y-3 text-sm font-medium text-gray-700 dark:text-gray-200">
          <NavLink to="/" className={linkClass} onClick={() => setMenuOpen(false)}>Inicio</NavLink>
          <NavLink to="/menu" className={linkClass} onClick={() => setMenuOpen(false)}>Menú</NavLink>
          <NavLink to="/wallet" className={linkClass} onClick={() => setMenuOpen(false)}>Wallet</NavLink>
          <NavLink to="/perfil" className={linkClass} onClick={() => setMenuOpen(false)}>Perfil</NavLink>
          <NavLink to="/dashboard" className={linkClass} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
          <DarkModeToggle />
          {user && (
            <button
              onClick={() => {
                handleLogout()
                setMenuOpen(false)
              }}
              className="block text-red-600 hover:text-red-700 font-semibold"
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
