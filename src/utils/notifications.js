import supabase from '../supabaseClient'

/**
 * Crear notificación
 */
export const crearNotificacion = async ({
  userId,
  type,
  title,
  message,
  relatedId = null
}) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          type,
          title,
          message,
          related_id: relatedId,
          read: false
        }
      ])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error creando notificación:', error)
    return { success: false, error }
  }
}

/**
 * Obtener notificaciones del usuario
 */
export const obtenerNotificaciones = async (userId, limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error)
    return { success: false, error }
  }
}

/**
 * Contar notificaciones no leídas
 */
export const contarNoLeidas = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', userId)
        .eq('read', false)
  
      if (error) throw error
      return { success: true, count: data?.length || 0 }
    } catch (error) {
      console.error('Error contando notificaciones:', error)
      return { success: false, count: 0 }
    }
  }
  
/**
 * Marcar notificación como leída
 */
export const marcarComoLeida = async (notificationId) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error marcando notificación:', error)
    return { success: false, error }
  }
}

/**
 * Marcar TODAS como leídas
 */
export const marcarTodasComoLeidas = async (userId) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error marcando todas como leídas:', error)
    return { success: false, error }
  }
}
