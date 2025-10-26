"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Navigation from "@/components/navigation"

interface NewsItem {
  id: string
  title: string
  description: string
  date: string
  icon: string
}

export default function NewsPage() {
  const [user, setUser] = useState(null)
  const supabase = createClient()

  const newsItems: NewsItem[] = [
    {
      id: "1",
      title: "Update Teknologi Terbaru",
      description: "Pelajari tren teknologi terkini yang sedang berkembang di industri.",
      date: "2025-01-20",
      icon: "📰",
    },
    {
      id: "2",
      title: "Tips Belajar Efektif",
      description: "Strategi dan tips untuk meningkatkan efektivitas belajar programming.",
      date: "2025-01-18",
      icon: "💡",
    },
    {
      id: "3",
      title: "Inovasi di InnoVerse",
      description: "Fitur-fitur baru yang hadir untuk meningkatkan pengalaman belajar Anda.",
      date: "2025-01-15",
      icon: "🚀",
    },
  ]

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-foreground">News</h1>
          <p className="text-lg text-muted-foreground mb-12">Berita dan update terbaru dari InnoVerse</p>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsItems.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground mb-4">{item.description}</p>
                <p className="text-sm text-muted-foreground">{item.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
