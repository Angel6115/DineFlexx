// src/paginas/Menu.jsx
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import supabase from "../supabaseClient"
import { useOrder } from "../context/OrderContext"
import { 
  ShoppingCart, 
  Plus, 
  Minus,
  Star,
  Clock,
  MapPin,
  ArrowLeft,
  Search,
  Gift
} from "lucide-react"

export default function Menu() {
  const { id: restaurantId } = useParams()
  const { agregarItem, credit, puntos, items } = useOrder()
  
  const [restaurant, setRestaurant] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Fetch restaurant
      const { data: restData, error: restError } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", restaurantId)
        .single()

      if (restError) {
        console.error("Error fetching restaurant:", restError)
        setLoading(false)
        return
      }

      setRestaurant(restData)

      // Fetch menu items
      const { data: itemsData, error: itemsError } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", restaurantId)

      if (itemsError) {
        console.error("Error fetching menu:", itemsError)
      } else {
        setMenuItems(itemsData || [])
      }

      setLoading(false)
    }

    fetchData()
  }, [restaurantId])

  const filteredItems = menuItems.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleQuantityChange = (itemId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + delta)
    }))
  }

  const handleAddToCart = (item) => {
    const quantity = quantities[item.id] || 1
    agregarItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity,
      restaurant_id: restaurantId
    })
    setQuantities(prev => ({ ...prev, [item.id]: 0 }))
  }

  const cartItemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Restaurante no encontrado</h2>
          <Link to="/restaurantes" className="text-blue-600 hover:underline">
            ← Volver
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/restaurantes" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-black">{restaurant.name}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {restaurant.rating || "4.5"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    30-45 min
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/cart"
              className="relative flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Carrito</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Credit Banner */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 mb-8 text-white shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm opacity-90 mb-1">💳 Crédito Disponible</p>
                <p className="text-3xl font-black">${credit?.toFixed(2) || "1500.00"}</p>
              </div>
              <div className="h-12 w-px bg-white/30" />
              <div>
                <p className="text-sm opacity-90 mb-1">🎁 Puntos</p>
                <p className="text-3xl font-black">{puntos || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar en el menú..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl"
          />
        </div>

        {/* Menu Items */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No hay items en el menú</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const qty = quantities[item.id] || 0
              
              return (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100 dark:border-gray-700">
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-6xl">
                    🍽️
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                    {item.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-black text-blue-600">
                        ${Number(item.price || 0).toFixed(2)}
                      </p>

                      {qty === 0 ? (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl"
                        >
                          <Plus className="w-5 h-5" />
                          Agregar
                        </button>
                      ) : (
                        <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl p-1">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold w-6 text-center">{qty}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Floating Cart (Mobile) */}
      {cartItemCount > 0 && (
        <Link
          to="/cart"
          className="fixed bottom-6 right-6 lg:hidden flex items-center gap-3 bg-blue-600 text-white font-bold px-6 py-4 rounded-2xl shadow-2xl"
        >
          <ShoppingCart className="w-6 h-6" />
          <span>{cartItemCount}</span>
        </Link>
      )}
    </div>
  )
}
