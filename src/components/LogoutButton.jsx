import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"

export default function LogoutButton() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    alert("Sesión cerrada correctamente ✅")
    navigate("/")
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl shadow"
    >
      Cerrar sesión
    </button>
  )
}
