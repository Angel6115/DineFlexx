// src/components/LogoutButton.jsx
import { useState } from "react";
import supabase from "../supabaseClient";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;
    
    setLoading(true);

    try {
      // 1. Cerrar sesión
      await supabase.auth.signOut();

      // 2. Marcar logout
      sessionStorage.setItem('justLoggedOut', 'true');

      // 3. Limpiar todo
      localStorage.clear();

      // 4. FORZAR redirect (sin React Router)
      window.location.replace('/');
      
    } catch (err) {
      console.error("Error logout:", err);
      setLoading(false);
      alert("Error al cerrar sesión");
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-xl shadow transition ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-red-600 hover:bg-red-700 text-white"
      }`}
    >
      <LogOut size={18} />
      {loading ? "Cerrando..." : "Cerrar sesión"}
    </button>
  );
}
