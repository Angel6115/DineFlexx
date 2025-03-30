import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function SupportHistory() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) setTickets(data)
      setLoading(false)
    }

    fetchTickets()
  }, [])

  if (loading) return <p>Cargando historial...</p>
  if (tickets.length === 0) return <p>No tienes mensajes enviados aún.</p>

  return (
    <div style={{ marginTop: '2rem', textAlign: 'left' }}>
      <h3>📜 Historial de soporte</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tickets.map(ticket => (
          <li key={ticket.id} style={{ 
            border: '1px solid #ccc', 
            borderRadius: '6px', 
            padding: '1rem', 
            marginBottom: '1rem' 
          }}>
            <p style={{ margin: 0 }}>{ticket.message}</p>
            <small style={{ color: '#555' }}>
              {new Date(ticket.created_at).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  )
}
