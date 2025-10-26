"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Upload } from "lucide-react"
import { ThemeLanguageToggle } from "@/components/theme-language-toggle"
import Link from "next/link"

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
  progress_percentage: number
  completed: boolean
}

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [progress, setProgress] = useState<ProgressItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ full_name: "", bio: "" })
  const [avatarUrl, setAvatarUrl] = useState<string>("")
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
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

      // Fetch profile
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

      // Fetch progress
      const { data: progressData } = await supabase.from("user_progress").select("*").eq("user_id", user.id)

      setProgress(progressData || [])
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

      // Try to upload to avatars bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError)

        // If bucket doesn't exist, try using a different approach or show error
        if (uploadError.message.includes('Bucket not found')) {
          alert('Avatar storage is not configured yet. Please contact administrator to set up the avatars bucket in Supabase.')
          setUploading(false)
          return
        }

        alert('Failed to upload avatar. Please try again.')
        setUploading(false)
        return
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setAvatarUrl(data.publicUrl)
      alert('Avatar updated successfully!')
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-primary/20 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/admin">
            <h1 className="text-2xl font-bold cursor-pointer hover:opacity-80 transition-opacity">
              <span className="text-primary">Inno</span>
              <span className="text-accent">Verse</span>
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeLanguageToggle />
            <Link href="/admin">
              <Button className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50">
                ← Kembali ke Admin Dashboard
              </Button>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Section */}
        <div className="mb-12 p-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-primary/30 shadow-lg">
                  <AvatarImage src={avatarUrl} alt={profile?.username} />
                  <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-primary to-accent text-white">
                    {profile?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-primary hover:bg-primary/90"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">{profile?.full_name || profile?.username}</h2>
                  <p className="text-muted-foreground">@{profile?.username}</p>
                  <p className="text-sm text-primary mt-2 capitalize font-semibold">{profile?.role}</p>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-primary hover:bg-primary/90 text-background font-semibold"
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
                <p className="text-muted-foreground">{profile?.bio || "Belum ada bio"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{progress.length}</div>
            <p className="text-sm text-muted-foreground">Materi Dipelajari</p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 text-center">
            <div className="text-3xl font-bold text-accent mb-2">{achievements.length}</div>
            <p className="text-sm text-muted-foreground">Pencapaian</p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 border border-secondary/30 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {progress.reduce((acc, item) => acc + item.progress_percentage, 0) / Math.max(progress.length, 1) | 0}%
            </div>
            <p className="text-sm text-muted-foreground">Rata-rata Progress</p>
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
                      <p className="font-semibold text-foreground mb-2">Material {item.material_id}</p>
                      <div className="w-full bg-muted rounded-full h-3 mt-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary via-accent to-primary h-full rounded-full transition-all duration-500 shadow-sm"
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
        <div>
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
      </div>
    </div>
  )
}
