"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeLanguageToggle } from "@/components/theme-language-toggle"
import Link from "next/link"

interface DashboardStats {
  totalMaterials: number
  completedMaterials: number
  averageProgress: number
  totalQuizzes: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalMaterials: 0,
    completedMaterials: 0,
    averageProgress: 0,
    totalQuizzes: 0,
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

      setUser(user)

      // Fetch profile
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      setProfile(profileData)

      // Fetch stats
      const { data: materialsData } = await supabase.from("materials").select("id")
      const { data: progressData } = await supabase.from("user_progress").select("*").eq("user_id", user.id)

      const { data: quizzesData } = await supabase.from("quizzes").select("id")

      const completedCount = progressData?.filter((p) => p.completed).length || 0
      const avgProgress =
        progressData && progressData.length > 0
          ? Math.round(progressData.reduce((sum, p) => sum + p.progress_percentage, 0) / progressData.length)
          : 0

      setStats({
        totalMaterials: materialsData?.length || 0,
        completedMaterials: completedCount,
        averageProgress: avgProgress,
        totalQuizzes: quizzesData?.length || 0,
      })

      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-primary/20 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-primary">Inno</span>
              <span className="text-accent">Verse</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeLanguageToggle />
            <Link href="/dashboard/profile">
              <div className="flex items-center gap-3 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 rounded-lg px-3 py-2 transition-all cursor-pointer">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.username} />
                  <AvatarFallback className="text-sm bg-primary text-white">
                    {profile?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">Profile</span>
              </div>
            </Link>
            <Button
              className="bg-accent/20 hover:bg-accent/30 text-accent border border-accent/50"
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
            Selamat Datang, <span className="text-primary">{profile?.full_name || profile?.username}!</span>
          </h2>
          <p className="text-muted-foreground">Lanjutkan perjalanan belajar Anda hari ini</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 hover:border-primary/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Total Materi</p>
                <p className="text-3xl font-bold text-primary">{stats.totalMaterials}</p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 hover:border-accent/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Materi Selesai</p>
                <p className="text-3xl font-bold text-accent">{stats.completedMaterials}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/5 border border-primary/30 hover:border-primary/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Progress Rata-rata</p>
                <p className="text-3xl font-bold text-primary">{stats.averageProgress}%</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-gradient-to-br from-foreground/10 to-foreground/5 border border-foreground/20 hover:border-foreground/40 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Total Quiz</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalQuizzes}</p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/materials">
            <div className="p-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/50 hover:border-primary transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/20">
              <h3 className="text-2xl font-bold mb-2 text-foreground">Lanjutkan Belajar</h3>
              <p className="text-muted-foreground mb-4">Akses semua materi pembelajaran</p>
              <Button className="bg-primary hover:bg-primary/90 text-background font-semibold">Buka Materi →</Button>
            </div>
          </Link>

          <Link href="/quiz">
            <div className="p-8 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/50 hover:border-accent transition-all cursor-pointer hover:shadow-lg hover:shadow-accent/20">
              <h3 className="text-2xl font-bold mb-2 text-foreground">Ikuti Quiz</h3>
              <p className="text-muted-foreground mb-4">Uji pemahaman Anda dengan quiz interaktif</p>
              <Button className="bg-accent hover:bg-accent/90 text-background font-semibold">Mulai Quiz →</Button>
            </div>
          </Link>
        </div>

        {/* Admin Dashboard Access */}
        {profile?.role === "admin" && (
          <div className="mt-12 p-8 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/50">
            <h3 className="text-2xl font-bold mb-4 text-foreground">Panel Admin</h3>
            <p className="text-muted-foreground mb-6">Kelola platform InnoVerse sebagai administrator</p>
            <Link href="/admin">
              <Button className="bg-accent hover:bg-accent/90 text-background font-semibold">
                Akses Admin Dashboard →
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
