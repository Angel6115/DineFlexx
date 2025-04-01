// src/App.jsx
import { useEffect, useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { supabase } from "./supabaseClient"
import Wallet from "./paginas/Wallet"
import Perfil from "./paginas/Perfil.jsx"
import Menu from "./paginas/Menu"
import Login from "./Login"

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="text-center mt-20 text-gray-600">Verificando acceso...</div>

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/menu" /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/menu" element={user ? <Menu /> : <Navigate to="/login" />} />
      <Route path="/perfil" element={user ? <Perfil /> : <Navigate to="/login" />} />
      <Route path="/wallet" element={user ? <Wallet /> : <Navigate to="/login" />} />
    </Routes>
  )
}
