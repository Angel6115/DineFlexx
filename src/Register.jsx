import { useState } from "react"
import { supabase } from "./supabaseClient"
import { useNavigate } from "react-router-dom"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("✅ Cuenta creada. Revisa tu correo para confirmar.")
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Crear Cuenta</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-xl shadow-sm"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-xl shadow-sm"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition"
        >
          Registrarse
        </button>

        {message && (
          <p className="text-center mt-4 text-sm text-green-600">{message}</p>
        )}
      </form>
    </div>
  )
}
