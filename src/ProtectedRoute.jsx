// src/ProtectedRoute.jsx
import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "./supabaseClient"

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      setIsAuthenticated(!!data?.session)
      setLoading(false)
    }
    checkSession()
  }, [])

  if (loading) return <div className="p-6 text-center">Verificando acceso...</div>

  return isAuthenticated ? children : <Navigate to="/login" replace />
}
