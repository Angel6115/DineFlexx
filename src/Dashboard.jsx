import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import SupportForm from './SupportForm'
import SupportHistory from './SupportHistory' // 👈 nuevo

export default function Dashboard() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (!user) return <p>Cargando usuario...</p>

  return (
    <div>
      <h2>Bienvenido, {user.email}</h2>
      <p>Este es tu panel de usuario. ✨</p>

      <SupportForm />
      <SupportHistory /> {/* 👈 nuevo */}

      <button 
        onClick={handleLogout}
        style={{
          marginTop: '2rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#e53935',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Cerrar sesión
      </button>
    </div>
  )
}
