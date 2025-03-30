import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  const handleRegister = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    setMessage(error ? error.message : '¡Registro exitoso! Revisa tu correo.')
  }

  return (
    <form onSubmit={handleRegister}>
      <input
        type="email"
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
        style={{
          display: 'block',
          width: '100%',
          padding: '0.5rem',
          marginBottom: '1rem',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        onChange={e => setPassword(e.target.value)}
        style={{
          display: 'block',
          width: '100%',
          padding: '0.5rem',
          marginBottom: '1rem',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
        required
      />
      <button
        type="submit"
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        Registrarse
      </button>
      {message && <p style={{ marginTop: '1rem', color: '#0070f3' }}>{message}</p>}
    </form>
  )
}
