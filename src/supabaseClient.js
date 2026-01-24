// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// ✅ Variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

// 🔍 DEBUG - Borra esto después
console.log('🔍 Supabase URL:', supabaseUrl)
console.log('🔍 Supabase Key:', supabaseAnon)

// ✅ Exportación como default (funcionaba bien)
const supabase = createClient(supabaseUrl, supabaseAnon)

export default supabase
