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
              <Button variant="outline">← Kembali</Button>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-foreground">
            Selamat Datang, <span className="text-primary">Admin!</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">Kelola platform InnoVerse dengan mudah dan efisien</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link href="/admin/materials">
            <div className="p-4 sm:p-6 lg:p-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/50 hover:border-primary transition-all cursor-pointer h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-foreground">Kelola Materi</h3>
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">Tambah, edit, atau hapus materi pembelajaran</p>
              </div>
              <Button className="bg-primary hover:bg-primary-dark text-background w-full">Kelola Materi →</Button>
            </div>
          </Link>

          <Link href="/admin/users">
            <div className="p-4 sm:p-6 lg:p-8 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/50 hover:border-accent transition-all cursor-pointer h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-foreground">Kelola Pengguna</h3>
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">Lihat data pengguna dan progress mereka</p>
              </div>
              <Button className="bg-accent hover:bg-accent-dark text-background w-full">Kelola Pengguna →</Button>
            </div>
          </Link>

          <Link href="/admin/comments">
            <div className="p-4 sm:p-6 lg:p-8 rounded-lg bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/50 hover:border-green-500 transition-all cursor-pointer h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-foreground">Kelola Komentar</h3>
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">Kelola komentar public chat dan moderasi pesan</p>
              </div>
              <Button className="bg-green-500 hover:bg-green-600 text-white dark:text-white w-full">Kelola Komentar →</Button>
            </div>
          </Link>

          <Link href="/admin/quizzes">
            <div className="p-4 sm:p-6 lg:p-8 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/50 hover:border-secondary transition-all cursor-pointer h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-foreground">Kelola Quiz</h3>
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">Buat dan kelola quiz untuk materi pembelajaran</p>
              </div>
              <Button variant="outline" className="w-full">Kelola Quiz →</Button>
            </div>
          </Link>

          <Link href="/admin/news">
            <div className="p-4 sm:p-6 lg:p-8 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border hover:border-primary transition-all cursor-pointer h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-foreground">Kelola Berita</h3>
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">Tambah, edit, dan kelola berita platform</p>
              </div>
              <Button variant="outline" className="w-full">Kelola Berita →</Button>
            </div>
          </Link>

          {/* Placeholder for future features */}
          <div className="p-4 sm:p-6 lg:p-8 rounded-lg bg-gradient-to-br from-gray-500/10 to-gray-500/5 border border-gray-500/20 h-full flex flex-col justify-center items-center">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-2">🚀</div>
              <p className="text-muted-foreground text-sm sm:text-base">Fitur Mendatang</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
