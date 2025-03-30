import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function SupportForm() {
  const [message, setMessage] = useState('')
  const [user, setUser] = useState(null)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    fetchUser()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message) return

    const { error } = await supabase
      .from('support_tickets')
      .insert([{ user_id: user.id, message }])

    setFeedback(error ? 'Hubo un error al enviar.' : '¡Mensaje enviado!')
    if (!error) setMessage('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
      <textarea
        placeholder="Escribe tu mensaje de soporte aquí..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
        style={{ width: '100%', padding: '1rem', borderRadius: '6px' }}
      />
      <button
        type="submit"
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Enviar soporte
      </button>
      {feedback && <p style={{ marginTop: '1rem', color: '#0070f3' }}>{feedback}</p>}
    </form>
  )
}
