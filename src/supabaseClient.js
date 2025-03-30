import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gtvzbnoblrwgihfhrosl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0dnpibm9ibHJ3Z2loZmhyb3NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMjI4MzQsImV4cCI6MjA1ODU5ODgzNH0.Q9VSQzuo5dLvQQAV7csQj-SVuSBZTRHm3faF2nGC44s'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
