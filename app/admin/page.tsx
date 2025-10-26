"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeLanguageToggle } from "@/components/theme-language-toggle"
import Link from "next/link"

interface AdminStats {
  totalUsers: number
  totalMaterials: number
  averageScore: number
  activeUsers: number
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalMaterials: 0,
    averageScore: 0,
    activeUsers: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Check if user is admin
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profileData?.role !== "admin") {
        router.push("/dashboard")
        return
      }

      setUser(user)
      setProfile(profileData)

      // Fetch stats
      const { data: usersData } = await supabase.from("profiles").select("id")
      const { data: materialsData } = await supabase.from("materials").select("id")
      const { data: attemptsData } = await supabase.from("quiz_attempts").select("score")

      const avgScore =
        attemptsData && attemptsData.length > 0
          ? Math.round(attemptsData.reduce((sum, a) => sum + (a.score || 0), 0) / attemptsData.length)
          : 0

      setStats({
        totalUsers: usersData?.length || 0,
        totalMaterials: materialsData?.length || 0,
        averageScore: avgScore,
        activeUsers: Math.floor((usersData?.length || 0) * 0.7),
      })

      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading admin dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-primary">Inno</span>
              <span className="text-accent">Verse</span>
            </h1>
            <p className="text-sm text-muted-foreground">Admin Panel</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeLanguageToggle />
            <Link href="/dashboard">
              <Button variant="outline">← Kembali ke Dashboard</Button>
            </Link>

            <Button
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut()
                router.push("/")
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2 text-foreground">
            Selamat Datang, <span className="text-primary">Admin!</span>
          </h2>
          <p className="text-muted-foreground">Kelola platform InnoVerse dengan mudah dan efisien</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-6 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Total Pengguna</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalUsers}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Total Materi</p>
                <p className="text-3xl font-bold text-primary">{stats.totalMaterials}</p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Nilai Rata-rata</p>
                <p className="text-3xl font-bold text-accent">{stats.averageScore}%</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Pengguna Aktif</p>
                <p className="text-3xl font-bold text-foreground">{stats.activeUsers}</p>
              </div>
              <div className="text-4xl">🟢</div>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/materials">
            <div className="p-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/50 hover:border-primary transition-all cursor-pointer">
              <h3 className="text-2xl font-bold mb-2 text-foreground">Kelola Materi</h3>
              <p className="text-muted-foreground mb-4">Tambah, edit, atau hapus materi pembelajaran</p>
              <Button className="bg-primary hover:bg-primary-dark text-background">Kelola Materi →</Button>
            </div>
          </Link>

          <Link href="/admin/users">
            <div className="p-8 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/50 hover:border-accent transition-all cursor-pointer">
              <h3 className="text-2xl font-bold mb-2 text-foreground">Kelola Pengguna</h3>
              <p className="text-muted-foreground mb-4">Lihat data pengguna dan progress mereka</p>
              <Button className="bg-accent hover:bg-accent-dark text-background">Kelola Pengguna →</Button>
            </div>
          </Link>

          <Link href="/admin/quizzes">
            <div className="p-8 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/50 hover:border-secondary transition-all cursor-pointer">
              <h3 className="text-2xl font-bold mb-2 text-foreground">Kelola Quiz</h3>
              <p className="text-muted-foreground mb-4">Buat dan kelola quiz untuk materi pembelajaran</p>
              <Button variant="outline">Kelola Quiz →</Button>
            </div>
          </Link>

          <Link href="/admin/messages">
            <div className="p-8 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border hover:border-primary transition-all cursor-pointer">
              <h3 className="text-2xl font-bold mb-2 text-foreground">Pesan & Notifikasi</h3>
              <p className="text-muted-foreground mb-4">Kelola pesan dan notifikasi sistem</p>
              <Button variant="outline">Kelola Pesan →</Button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
