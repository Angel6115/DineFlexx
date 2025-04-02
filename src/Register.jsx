// src/Register.jsx
import { useState } from "react"
import { supabase } from "./supabaseClient"
import { useNavigate } from "react-router-dom"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      navigate("/menu")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
          Crear Cuenta
        </h1>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold"
          >
            Crear Cuenta
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          ¿Ya tienes cuenta? {" "}
          <a href="/login" className="text-blue-600 hover:underline dark:text-blue-400">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  )
}
