"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Camera, Upload, Settings, User, Trash2, Moon, Sun, Languages } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/useLanguage"
import { useTranslation } from "react-i18next"

interface Profile {
  id: string
  username: string
  full_name: string
  bio: string
  role: string
  avatar_url?: string
}

interface Achievement {
  id: string
  name: string
  description: string
  earned_at: string
}

interface ProgressItem {
  material_id: string
  material_title?: string
  progress_percentage: number
  completed: boolean
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [progress, setProgress] = useState<ProgressItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ full_name: "", bio: "" })
  const [avatarUrl, setAvatarUrl] = useState<string>("")
  const [uploading, setUploading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()
  const { language, changeLanguage } = useLanguage()
  const { t } = useTranslation()

  useEffect(() => {
    setMounted(true)

    // Load dark mode preference
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark)
    setIsDarkMode(initialDarkMode)

    // Apply theme
    if (initialDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

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
      setEditData({
        full_name: profileData?.full_name || "",
        bio: profileData?.bio || "",
      })
      setAvatarUrl(profileData?.avatar_url || "")

      // Fetch achievements
      const { data: achievementsData } = await supabase
        .from("user_achievements")
        .select("achievements(*)")
        .eq("user_id", user.id)

      setAchievements(achievementsData?.map((a: any) => a.achievements) || [])

      // Fetch progress with material titles
      const { data: progressData } = await supabase
        .from("user_progress")
        .select(`
          *,
          materials (
            title
          )
        `)
        .eq("user_id", user.id)

      const progressWithTitles = progressData?.map(item => ({
        ...item,
        material_title: item.materials?.title || `Material ${item.material_id}`
      })) || []

      setProgress(progressWithTitles)
      setLoading(false)
    }

    fetchData()
  }, [])

  const handleUpdateProfile = async () => {
    if (!user) return

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: editData.full_name,
        bio: editData.bio,
        avatar_url: avatarUrl,
      })
      .eq("id", user.id)

    if (!error) {
      setProfile({ ...profile!, ...editData, avatar_url: avatarUrl })
      setIsEditing(false)
    }
  }

  const handleRemoveAvatar = async () => {
    if (!user || !avatarUrl) return

    // Confirm deletion
    if (!confirm('Apakah Anda yakin ingin menghapus foto profil?')) return

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          avatar_url: null,
        })
        .eq("id", user.id)

      if (!error) {
        setAvatarUrl("")
        setProfile({ ...profile!, avatar_url: undefined })
        alert('Foto profil berhasil dihapus!')
      } else {
        alert('Gagal menghapus foto profil. Silakan coba lagi.')
      }
    } catch (error) {
      console.error('Error removing avatar:', error)
      alert('Terjadi kesalahan saat menghapus foto profil.')
    }
  }

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)

    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  if (!mounted) {
    return null
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    setUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Try to upload to avatars bucket first
      let uploadError = null
      let publicUrl = null

      try {
        const { error, data } = await supabase.storage
          .from('avatars')
          .upload(filePath, file)

        uploadError = error

        if (!error) {
          const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath)
          publicUrl = urlData.publicUrl
        }
      } catch (err) {
        uploadError = err
      }

      // If avatars bucket doesn't exist, try using a public bucket or show helpful message
      if (uploadError && (uploadError as any).message?.includes('Bucket not found')) {
        console.log('Avatars bucket not found, trying alternative storage...')

        // Try uploading to a public bucket (you might need to create this)
        try {
          const { error: altError, data: altData } = await supabase.storage
            .from('public') // Assuming there's a 'public' bucket
            .upload(`avatars/${fileName}`, file)

          if (!altError) {
            const { data: urlData } = supabase.storage
              .from('public')
              .getPublicUrl(`avatars/${fileName}`)
            publicUrl = urlData.publicUrl
          } else {
            throw altError
          }
        } catch (altErr) {
          console.error('Alternative upload failed:', altErr)
          alert('Storage belum dikonfigurasi. Silakan hubungi administrator untuk mengatur penyimpanan avatar di Supabase. Bucket "avatars" atau "public" perlu dibuat.')
          setUploading(false)
          return
        }
      } else if (uploadError) {
        console.error('Error uploading avatar:', uploadError)
        alert('Gagal mengupload avatar. Silakan coba lagi.')
        setUploading(false)
        return
      }

      if (publicUrl) {
        setAvatarUrl(publicUrl)
        alert('Foto profil berhasil diperbarui!')
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('An unexpected error occurred. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  const averageProgress = progress.length > 0 
    ? Math.round(progress.reduce((acc, item) => acc + item.progress_percentage, 0) / progress.length)
    : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-primary/20 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold cursor-pointer hover:opacity-80 transition-opacity">
              <span className="text-primary">Inno</span>
              <span className="text-accent">Verse</span>
            </h1>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50">
              Kembali ke Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              {/* Profile Section */}
              <div className="mb-12 p-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center lg:items-start space-y-4">
                    <div className="relative">
                      <Avatar className="w-32 h-32 border-4 border-primary/30 shadow-lg">
                        <AvatarImage src={avatarUrl} alt={profile?.username} />
                        <AvatarFallback className="text-4xl font-bold bg-primary text-white">
                          {avatarUrl ? profile?.username?.charAt(0).toUpperCase() : "👤"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 flex gap-2">
                        <Button
                          size="sm"
                          className="rounded-full w-10 h-10 p-0 bg-primary hover:bg-primary/90 shadow-lg"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          title="Ganti foto profil"
                        >
                          {uploading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Camera className="w-4 h-4" />
                          )}
                        </Button>
                        {avatarUrl && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="rounded-full w-10 h-10 p-0 hover:bg-red-600 shadow-lg"
                            onClick={handleRemoveAvatar}
                            title="Hapus foto profil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    {/* Stats untuk Mobile */}
                    <div className="lg:hidden w-full grid grid-cols-3 gap-4 mt-6">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 text-center">
                        <div className="text-2xl font-bold text-primary mb-1">{progress.length}</div>
                        <p className="text-xs text-muted-foreground">Materi</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 text-center">
                        <div className="text-2xl font-bold text-accent mb-1">{achievements.length}</div>
                        <p className="text-xs text-muted-foreground">Pencapaian</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 border border-secondary/30 text-center">
                        <div className="text-xl font-bold text-primary mb-1">
                          {averageProgress}%
                        </div>
                        <p className="text-xs text-muted-foreground">Progress</p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="lg:col-span-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold text-foreground mb-2">{profile?.full_name || profile?.username}</h2>
                        <p className="text-muted-foreground">@{profile?.username}</p>
                        <p className="text-sm text-primary mt-2 capitalize font-semibold">{profile?.role}</p>
                      </div>
                      <Button
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-primary hover:bg-primary/90 text-background font-semibold self-start sm:self-auto"
                      >
                        {isEditing ? "Batal" : "Edit Profile"}
                      </Button>
                    </div>

                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-foreground">Nama Lengkap</label>
                          <Input
                            value={editData.full_name}
                            onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                            className="bg-input border-primary/30 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-foreground">Bio</label>
                          <textarea
                            value={editData.bio}
                            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                            className="w-full p-3 rounded-lg bg-input border border-primary/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            rows={4}
                          />
                        </div>
                        <Button
                          onClick={handleUpdateProfile}
                          className="bg-primary hover:bg-primary/90 text-background font-semibold"
                        >
                          Simpan Perubahan
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">{profile?.bio || "Belum ada bio"}</p>

                        {/* Stats untuk Desktop */}
                        <div className="hidden lg:grid grid-cols-3 gap-4">
                          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 text-center">
                            <div className="text-2xl font-bold text-primary mb-1">{progress.length}</div>
                            <p className="text-sm text-muted-foreground">Materi Dipelajari</p>
                          </div>
                          <div className="p-4 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 text-center">
                            <div className="text-2xl font-bold text-accent mb-1">{achievements.length}</div>
                            <p className="text-sm text-muted-foreground">Pencapaian</p>
                          </div>
                          <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 border border-secondary/30 text-center">
                            <div className="text-2xl font-bold text-primary mb-1">
                              {averageProgress}%
                            </div>
                            <p className="text-sm text-muted-foreground">Rata-rata Progress</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Learning History */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-foreground">Riwayat Pembelajaran</h3>
                <div className="space-y-4">
                  {progress.length > 0 ? (
                    progress.map((item, index) => (
                      <div
                        key={index}
                        className="p-6 rounded-xl bg-gradient-to-br from-background to-muted/20 border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-foreground mb-2">{item.material_title}</p>
                            <div className="w-full bg-muted rounded-full h-4 mt-2 overflow-hidden shadow-inner">
                              <div
                                className="bg-primary h-4 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-primary/50"
                                style={{ width: `${item.progress_percentage}%` }}
                              />
                            </div>
                          </div>
                          <div className="ml-6 text-right">
                            <p className="font-bold text-primary text-lg">{item.progress_percentage}%</p>
                            {item.completed && (
                              <div className="flex items-center justify-end mt-1">
                                <span className="text-sm text-accent font-medium">✓ Selesai</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📚</div>
                      <p className="text-muted-foreground text-lg">Belum ada riwayat pembelajaran</p>
                      <p className="text-sm text-muted-foreground mt-2">Mulai belajar untuk melihat progress Anda di sini!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Achievements */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-foreground">Pencapaian</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {achievements.length > 0 ? (
                    achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="p-6 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 hover:border-accent/50 hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="text-4xl group-hover:scale-110 transition-transform">🏆</div>
                          <div className="flex-1">
                            <h4 className="font-bold text-foreground mb-2 text-lg">{achievement.name}</h4>
                            <p className="text-muted-foreground mb-3 leading-relaxed">{achievement.description}</p>
                            <div className="flex items-center text-sm text-accent font-medium">
                              <span className="mr-2">📅</span>
                              {new Date(achievement.earned_at).toLocaleDateString("id-ID", {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-16">
                      <div className="text-8xl mb-6">🎯</div>
                      <h4 className="text-xl font-bold text-foreground mb-2">Belum ada pencapaian</h4>
                      <p className="text-muted-foreground text-lg">Mulai belajar untuk mendapatkan pencapaian pertama Anda!</p>
                      <div className="mt-6 text-sm text-muted-foreground">
                        💡 Tip: Selesaikan materi dan quiz untuk unlock achievements
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Pengaturan Akun
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base flex items-center gap-2">
                        {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        Mode Gelap
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Aktifkan mode gelap untuk pengalaman yang lebih nyaman
                      </p>
                    </div>
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={toggleDarkMode}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base flex items-center gap-2">
                      <Languages className="w-4 h-4" />
                      Bahasa
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        variant={language === 'id' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => changeLanguage('id')}
                      >
                        Bahasa Indonesia
                      </Button>
                      <Button
                        variant={language === 'en' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => changeLanguage('en')}
                      >
                        English
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}