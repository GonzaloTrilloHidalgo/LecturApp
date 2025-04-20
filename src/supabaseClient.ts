import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vcuoxhpmjoewdxlnwpgy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjdW94aHBtam9ld2R4bG53cGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMDIzMjQsImV4cCI6MjA2MDY3ODMyNH0.0M_G5yPIlBqDxzsJ6GSZmdgXyt7brpt-1sHR3NjWsFY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
