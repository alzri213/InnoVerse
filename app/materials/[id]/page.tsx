"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeLanguageToggle } from "@/components/theme-language-toggle"
import Link from "next/link"

interface Material {
  id: string
  title: string
  description: string
  content: string
  content2?: string
  content3?: string
  content4?: string
  content5?: string
  video_url?: string
  category: string
  difficulty: string
  duration_minutes: number
}

export default function MaterialDetailPage() {
  const [material, setMaterial] = useState<Material | null>(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [nextMaterial, setNextMaterial] = useState<Material | null>(null)
  const [showContent2, setShowContent2] = useState(false)
  const [showContent3, setShowContent3] = useState(false)
  const [showContent4, setShowContent4] = useState(false)
  const [showContent5, setShowContent5] = useState(false)
  const router = useRouter()
  const params = useParams()
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

      // Fetch material
      const { data: materialData } = await supabase.from("materials").select("*").eq("id", params.id).single()

      setMaterial(materialData)

      // Fetch user progress
      const { data: progressData } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("material_id", params.id)
        .single()

      if (progressData) {
        setProgress(progressData.progress_percentage)
        // Show content based on progress
        if (progressData.progress_percentage >= 25) setShowContent2(true)
        if (progressData.progress_percentage >= 50) setShowContent3(true)
        if (progressData.progress_percentage >= 75) setShowContent4(true)
        if (progressData.progress_percentage >= 100) setShowContent5(true)
      }

      // Find next material in same category
      if (materialData) {
        const { data: allMaterials } = await supabase
          .from("materials")
          .select("*")
          .eq("category", materialData.category)
          .order("created_at", { ascending: true })

        if (allMaterials) {
          const currentIndex = allMaterials.findIndex((m: any) => m.id === materialData.id)
          const next = allMaterials[currentIndex + 1]
          setNextMaterial(next || null)
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [params.id])

  const handleUpdateProgress = async (newProgress: number) => {
    if (!user || !material) return

    const { data: existingProgress } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("material_id", material.id)
      .single()

    if (existingProgress) {
      await supabase
        .from("user_progress")
        .update({
          progress_percentage: newProgress,
          completed: newProgress === 100,
          completed_at: newProgress === 100 ? new Date().toISOString() : null,
        })
        .eq("id", existingProgress.id)
    } else {
      await supabase.from("user_progress").insert([
        {
          user_id: user.id,
          material_id: material.id,
          progress_percentage: newProgress,
          completed: newProgress === 100,
          completed_at: newProgress === 100 ? new Date().toISOString() : null,
        },
      ])
    }

    setProgress(newProgress)

    // Show content based on progress milestones
    if (newProgress >= 25 && !showContent2) setShowContent2(true)
    if (newProgress >= 50 && !showContent3) setShowContent3(true)
    if (newProgress >= 75 && !showContent4) setShowContent4(true)
    if (newProgress >= 100 && !showContent5) setShowContent5(true)

    // Removed automatic redirect to next material when progress reaches 100%
  }

  const handleRestartMaterial = async () => {
    if (!user || !material) return

    // Reset progress to 0
    const { data: existingProgress } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("material_id", material.id)
      .single()

    if (existingProgress) {
      await supabase
        .from("user_progress")
        .update({
          progress_percentage: 0,
          completed: false,
          completed_at: null,
        })
        .eq("id", existingProgress.id)
    }

    setProgress(0)
    setShowContent2(false)
    setShowContent3(false)
    setShowContent4(false)
    setShowContent5(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading material...</p>
      </div>
    )
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Material not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/materials">
            <h1 className="text-2xl font-bold cursor-pointer">
              <span className="text-primary">Inno</span>
              <span className="text-accent">Verse</span>
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeLanguageToggle />
            <Link href="/materials">
              <Button variant="outline">Kembali ke Materi</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8 overflow-x-auto lg:overflow-x-visible">
          {/* Material Content - Left Side */}
          <div className="flex-shrink-0 w-full lg:flex-1 lg:max-w-3xl">
            {/* Material Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4 text-foreground">{material.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{material.description}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <span className="px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium">
                  {material.category}
                </span>
                <span className="px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium">
                  {material.difficulty}
                </span>
                <span className="px-4 py-2 rounded-full bg-muted/20 text-muted-foreground text-sm font-medium">
                  {material.duration_minutes} menit
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-foreground">Progress Pembelajaran</p>
                  <p className="text-sm font-bold text-primary">{progress}%</p>
                </div>
                <div className="w-full bg-muted rounded-full h-4 overflow-hidden shadow-inner">
                  <div
                    className="bg-primary h-4 rounded-full transition-all duration-1000 ease-out animate-pulse-luxury shadow-lg shadow-primary/50"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Video Section */}
            {material.video_url && (
              <div className="mb-8">
                <div className="aspect-video w-full rounded-lg overflow-hidden border border-border">
                  <iframe
                    src={material.video_url}
                    title={material.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Material Content 1 */}
            <div className="p-8 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border mb-8">
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{material.content}</p>
              </div>
            </div>

            {/* Material Content 2 */}
            {showContent2 && material.content2 && (
              <div className="p-8 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border mb-8">
                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{material.content2}</p>
                </div>
              </div>
            )}

            {/* Material Content 3 */}
            {showContent3 && material.content3 && (
              <div className="p-8 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border mb-8">
                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{material.content3}</p>
                </div>
              </div>
            )}

            {/* Material Content 4 */}
            {showContent4 && material.content4 && (
              <div className="p-8 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border mb-8">
                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{material.content4}</p>
                </div>
              </div>
            )}

            {/* Material Content 5 */}
            {showContent5 && material.content5 && (
              <div className="p-8 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border mb-8">
                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{material.content5}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap">
              {progress < 100 && (
                <Button
                  onClick={() => handleUpdateProgress(Math.min(progress + 25, 100))}
                  className="bg-primary hover:bg-primary-dark text-background dark:hover:text-foreground"
                >
                  Lanjutkan Pembelajaran
                </Button>
              )}

              {progress === 100 && nextMaterial && (
                <div className="flex items-center gap-2 text-success">
                  <span className="text-2xl">✓</span>
                  <span className="font-semibold">Materi Selesai! Anda dapat melanjutkan ke materi berikutnya.</span>
                </div>
              )}

              {progress === 100 && !nextMaterial && (
                <div className="flex items-center gap-2 text-success">
                  <span className="text-2xl">✓</span>
                  <span className="font-semibold">Selamat! Anda telah menyelesaikan semua materi di kategori ini!</span>
                </div>
              )}

              {progress === 100 && nextMaterial && (
                <Link href={`/materials/${nextMaterial.id}`}>
                  <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-background dark:hover:text-foreground">
                    Materi Berikutnya: {nextMaterial.title}
                  </Button>
                </Link>
              )}

              {progress === 100 && (
                <Button
                  onClick={handleRestartMaterial}
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent hover:text-background dark:hover:text-foreground"
                >
                  🔄 Mengulang Materi
                </Button>
              )}

              <Link href="/quiz">
                <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground dark:hover:text-foreground">Ikuti Quiz</Button>
              </Link>
            </div>
          </div>

          {/* Quiz Section - Right Side */}
          <div className="flex-shrink-0 w-full lg:w-96">
            <div className="bg-gradient-to-br from-card to-card/80 border border-border rounded-xl p-6 lg:sticky lg:top-24 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-foreground text-center">Quiz Cepat</h3>
              <p className="text-muted-foreground text-sm mb-6 text-center">
                Uji pemahaman Anda dengan quiz singkat setelah menyelesaikan materi
              </p>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">📚</span>
                    <div>
                      <p className="font-semibold text-foreground">Quiz {material.category}</p>
                      <p className="text-sm text-muted-foreground">5 soal • 10 menit</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Nilai kelulusan: 70%
                  </p>
                  <Link href={`/quiz/${material.category.toLowerCase().replace(/\s+/g, '-')}-quiz`}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-background text-sm">
                      Mulai Quiz →
                    </Button>
                  </Link>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <p className="font-semibold text-foreground">Latihan Cepat</p>
                      <p className="text-sm text-muted-foreground">3 soal • 5 menit</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Cocok untuk review singkat
                  </p>
                  <Button variant="outline" className="w-full text-sm" disabled>
                    Segera Hadir
                  </Button>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🔄</span>
                    <div>
                      <p className="font-semibold text-foreground">Ulang Materi</p>
                      <p className="text-sm text-muted-foreground">Reset progress</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Mulai dari awal untuk pemahaman lebih baik
                  </p>
                  <Button
                    onClick={handleRestartMaterial}
                    variant="outline"
                    className="w-full text-sm border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400"
                  >
                    Reset Progress
                  </Button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50">
                <h4 className="text-sm font-semibold mb-2 text-foreground">Tips Belajar</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Baca materi secara bertahap</li>
                  <li>• Catat poin-poin penting</li>
                  <li>• Lakukan quiz untuk evaluasi</li>
                  <li>• Diskusikan dengan teman</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
