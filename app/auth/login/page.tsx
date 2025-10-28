"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [logoClickCount, setLogoClickCount] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  const handleLogoClick = () => {
    const newCount = logoClickCount + 1
    setLogoClickCount(newCount)
    if (newCount === 3) {
      setIsAdminMode(!isAdminMode)
      setLogoClickCount(0)
      setIdentifier("")
      setPassword("")
      setError(null)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (isAdminMode) {
        // Sign in with email and password
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: identifier,
          password,
        })

        if (signInError) {
          if (signInError.message.includes("Invalid login credentials")) {
            throw new Error("Email atau password admin salah")
          }
          throw signInError
        }

        // Check if the user has admin role
        const { data: user } = await supabase.auth.getUser()
        if (!user.user) throw new Error("Login gagal")

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.user.id)
          .single()

        if (profileError || profile?.role !== "admin") {
          await supabase.auth.signOut()
          throw new Error("User ini bukan admin")
        }

        router.push("/admin")
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: identifier,
          password,
        })

        if (signInError) {
          // Handle specific error cases
          if (signInError.message.includes("Email not confirmed")) {
            throw new Error("Email belum dikonfirmasi. Silakan periksa email Anda dan klik link konfirmasi.")
          }
          if (signInError.message.includes("Invalid login credentials")) {
            throw new Error("Email atau password salah")
          }
          throw signInError
        }

        // Check if user exists and is confirmed
        if (data.user && !data.user.email_confirmed_at) {
          throw new Error("Email belum dikonfirmasi. Silakan periksa email Anda dan klik link konfirmasi.")
        }

        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err.message || "Login gagal")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="border-primary/30 bg-background/60 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center">
            <div className="mb-4">
              <button
                onClick={handleLogoClick}
                className="text-4xl font-bold cursor-pointer hover:opacity-80 transition-all duration-300 inline-block"
                type="button"
                title="Klik 3x untuk mode admin"
              >
                <span className="text-primary drop-shadow-lg">Inno</span>
                <span className="text-accent drop-shadow-lg">Verse</span>
              </button>
            </div>
            <CardTitle className="text-3xl font-bold text-foreground">
              {isAdminMode ? "Admin Login" : "Login"}
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              {isAdminMode ? "Masuk ke panel admin InnoVerse" : "Masuk ke dashboard InnoVerse"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">
                  {isAdminMode ? "Email Admin" : "Email"}
                </label>
                <Input
                  type="email"
                  placeholder={isAdminMode ? "Masukkan email admin" : "Masukkan email"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="bg-input border-primary/30 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">Password</label>
                <Input
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input border-primary/30 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/50"
                  required
                />
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm">{error}</div>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary text-background font-semibold py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-primary/50"
              >
                {isLoading ? "Sedang login..." : "Login"}
              </Button>
            </form>



            {!isAdminMode && (
              <div className="mt-4 text-center">
                <Link href="/auth/sign-up" className="text-primary hover:text-primary/80 transition-colors font-medium">
                  Belum punya akun? Daftar di sini
                </Link>
              </div>
            )}

            {isAdminMode && (
              <div className="mt-4 text-center text-xs text-primary/60 font-medium">
                Mode Admin Aktif • Klik logo 3x untuk kembali
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
