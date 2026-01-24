// src/components/Navbar.jsx
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import supabase from '../supabaseClient'
import { useOrder } from '../context/OrderContext'
import { LogOut, Menu as MenuIcon, X, Bell } from 'lucide-react'
import DarkModeToggle from './DarkModeToggle'
import { contarNoLeidas, obtenerNotificaciones, marcarComoLeida } from '../utils/notifications'

export default function Navbar() {
  const location = useLocation()
  const { items } = useOrder()
  const [userEmail, setUserEmail] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userId, setUserId] = useState(null)
  const [notificationCount, setNotificationCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    console.log('🔵 Navbar useEffect ejecutándose...')
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        console.log('👤 Usuario encontrado:', user.email, user.id)
        setUserEmail(user.email)
        setUserId(user.id)
        loadNotificationCount(user.id)
        
        const interval = setInterval(() => {
          loadNotificationCount(user.id)
        }, 10000)

        return () => clearInterval(interval)
      } else {
        console.log('❌ No hay usuario logueado')
      }
    })
  }, [])

  const loadNotificationCount = async (uid) => {
    console.log('🔔 Cargando notificaciones para:', uid)
    const result = await contarNoLeidas(uid)
    console.log('🔔 Resultado de contarNoLeidas:', result)
    if (result.success) {
      console.log('✅ Actualizando badge a:', result.count)
      setNotificationCount(result.count)
    } else {
      console.log('❌ Error cargando notificaciones')
    }
  }

  const loadNotifications = async () => {
    if (!userId) return
    const { success, data } = await obtenerNotificaciones(userId, 10)
    if (success) {
      setNotifications(data)
    }
  }

  const handleNotificationClick = async (notification) => {
    await marcarComoLeida(notification.id)
    setNotificationCount(prev => Math.max(0, prev - 1))
    loadNotifications()
  }

  const toggleNotifications = async () => {
    if (!showNotifications) {
      await loadNotifications()
    }
    setShowNotifications(!showNotifications)
  }

  const links = [
    { to: '/restaurants', label: 'Restaurantes' },
    { to: '/cart', label: `Carrito (${items.reduce((sum, i) => sum + i.quantity, 0)})` },
    { to: '/wallet', label: 'Wallet' },
    { to: '/catering', label: 'Catering' },
    { to: '/perfil', label: 'Perfil' },
    { to: '/soporte', label: 'Soporte' },
    { to: '/dashboard', label: 'Dashboard' }
  ]

  console.log('🎨 Renderizando Navbar. Badge count:', notificationCount)

  return (
    <nav className="bg-white dark:bg-gray-900 border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/restaurants" className="flex items-center gap-2">
          <img src="/images/dlogo1.png" alt="DineFlexx" className="h-20 w-auto" />
          <span className="font-bold text-lg text-gray-800 dark:text-white">DineFlexx</span>
        </Link>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>

        <div className="hidden md:flex items-center gap-4">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname.startsWith(to)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </Link>
          ))}

          <DarkModeToggle />

          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Bell size={20} className="text-gray-600 dark:text-gray-300" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-800 dark:text-white">Notificaciones</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500 text-center">No tienes notificaciones</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                          !notif.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-gray-800 dark:text-white">
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notif.created_at).toLocaleDateString('es-PR', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right text-xs text-gray-500 dark:text-gray-300">
              <p className="font-medium">{userEmail || 'Usuario'}</p>
              <Link to="/logout" className="flex items-center gap-1 text-red-500 hover:underline">
                <LogOut className="w-3 h-3" />
                Cerrar sesión
              </Link>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {userEmail ? userEmail[0].toUpperCase() : 'U'}
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
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname.startsWith(to)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
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
              <LogOut className="w-4 h-4" />
              Salir
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
