"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Material {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  duration_minutes: number
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "RPL":
      return "💻"
    case "DKV":
      return "🎨"
    case "TKJ":
      return "🌐"
    case "TRANS/TELKO":
      return "📡"
    default:
      return "📚"
  }
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const categories = ["All", "RPL", "DKV", "TKJ", "TRANS/TELKO"]

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser()
      setUser(userData.user)

      let query = supabase.from("materials").select("*")
      if (selectedCategory !== "All") {
        query = query.eq("category", selectedCategory)
      }

      const { data } = await query
      setMaterials(data || [])
      setLoading(false)
    }

    fetchData()
  }, [selectedCategory])

  const difficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-success/20 text-success"
      case "Intermediate":
        return "bg-warning/20 text-warning"
      case "Advanced":
        return "bg-error/20 text-error"
      default:
        return "bg-muted/20 text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Learning Materials</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Pilih kategori jurusan untuk melihat materi pembelajaran
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
              <Button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`${
                  selectedCategory === cat
                    ? "bg-primary hover:bg-primary-dark text-background"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Loading materials...</p>
              </div>
            ) : materials.length > 0 ? (
              materials.map((material) => (
                <div
                  key={material.id}
                  className="p-6 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 flex flex-col h-full"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">{getCategoryIcon(material.category)}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground">{material.title}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{material.category}</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground line-clamp-2 mb-4 flex-1">{material.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColor(material.difficulty)}`}
                    >
                      {material.difficulty}
                    </span>
                    <span className="text-sm text-muted-foreground">{material.duration_minutes} min</span>
                  </div>

                  <div className="mt-auto">
                    <Link href={`/materials/${material.id}`}>
                      <Button className="w-full bg-primary hover:bg-primary-dark text-background">Pelajari →</Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No materials found in this category</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
