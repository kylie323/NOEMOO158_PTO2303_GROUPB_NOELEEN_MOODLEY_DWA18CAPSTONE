import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://syqlsflaghyytdqebewl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5cWxzZmxhZ2h5eXRkcWViZXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0ODI1NjQsImV4cCI6MjAyMzA1ODU2NH0.HDyE_SyrDyx8Mml7cHO3m1K8cNNJad_DJ9Aq3IzS96Y'
export const supabase = createClient(supabaseUrl, supabaseKey)