import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xkgyaafgtbadzsofapkj.supabase.co"
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrZ3lhYWZndGJhZHpzb2ZhcGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODk0MjgsImV4cCI6MjA3Njc2NTQyOH0.FW7jdMzysvt_JbFkHXY8twhid0a9m0-lULuAxKGmaJE"
  if (!url || !key || url === "https://placeholder.supabase.co" || key === "placeholder-key") {
    console.warn("Supabase environment variables are not set, using placeholder values")
  }
  return createBrowserClient(url, key)
}
