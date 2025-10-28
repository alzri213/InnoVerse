"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Navigation from "@/components/navigation"

interface NewsItem {
  id: string
  title: string
  description: string
  content?: string
  icon: string
  published: boolean
  created_at: string
}

export default function NewsPage() {
  const [user, setUser] = useState<any>(null)
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchNews = async () => {
      const { data: newsData } = await supabase
        .from("news")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })

      setNewsItems(newsData || [])
      setLoading(false)
    }

    fetchNews()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-foreground">News</h1>
          <p className="text-lg text-muted-foreground mb-12">Berita dan update terbaru dari InnoVerse</p>

          {/* News Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading news...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {newsItems.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
