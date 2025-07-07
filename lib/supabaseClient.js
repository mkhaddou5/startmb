import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ihixmftpvavimtdqpdew.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaXhtZnRwdmF2aW10ZHFwZGV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NDg5NzYsImV4cCI6MjA2NzIyNDk3Nn0.Xi_iCTPH4x9S8dv4H66WZPbAjFUCpgSLvGGBQUtQEsk'

export const supabase = createClient(supabaseUrl, supabaseKey)