// src/supabaseClient.js
import  { createClient }  from '@supabase/supabase-js'

// ✅ Variables de entorno
const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

// ✅ Exportación como default (funcionaba bien)
const supabase = createClient(supabaseUrl, supabaseAnon)

export default supabase
