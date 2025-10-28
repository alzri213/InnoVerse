"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface NewsItem {
  id: string
  title: string
  description: string
  content?: string
  icon: string
  published: boolean
  created_at: string
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newNews, setNewNews] = useState({
    title: "",
    description: "",
    content: "",
    icon: "📰",
    published: true,
  })
  const [editNews, setEditNews] = useState({
    title: "",
    description: "",
    content: "",
    icon: "📰",
    published: true,
  })
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

      // Fetch news
      const { data: newsData } = await supabase.from("news").select("*").order("created_at", { ascending: false })

      setNews(newsData || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  const handleAddNews = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from("news")
      .insert([
        {
          ...newNews,
          created_by: user.id,
        },
      ])
      .select()

    if (!error && data) {
      setNews([data[0], ...news])
      setNewNews({
        title: "",
        description: "",
        content: "",
        icon: "📰",
        published: true,
      })
      setIsAdding(false)
    }
  }

  const handleEditNews = (newsItem: NewsItem) => {
    setEditingId(newsItem.id)
    setEditNews({
      title: newsItem.title,
      description: newsItem.description,
      content: newsItem.content || "",
      icon: newsItem.icon,
      published: newsItem.published,
    })
    setIsAdding(true)
  }

  const handleUpdateNews = async () => {
    if (!editingId) return

    const { data, error } = await supabase
      .from("news")
      .update(editNews)
      .eq("id", editingId)
      .select()

    if (!error && data) {
      setNews(news.map((n) => (n.id === editingId ? data[0] : n)))
      setEditingId(null)
      setEditNews({
        title: "",
        description: "",
        content: "",
        icon: "📰",
        published: true,
      })
      setIsAdding(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditNews({
      title: "",
      description: "",
      content: "",
      icon: "📰",
      published: true,
    })
    setIsAdding(false)
  }

  const handleDeleteNews = async (id: string) => {
    await supabase.from("news").delete().eq("id", id)
    setNews(news.filter((n) => n.id !== id))
  }

  const togglePublished = async (id: string, currentStatus: boolean) => {
    const { data, error } = await supabase
      .from("news")
      .update({ published: !currentStatus })
      .eq("id", id)
      .select()

    if (!error && data) {
      setNews(news.map((n) => (n.id === id ? data[0] : n)))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading news...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/admin">
            <h1 className="text-2xl font-bold cursor-pointer">
              <span className="text-primary">Inno</span>
              <span className="text-accent">Verse</span>
            </h1>
          </Link>
          <Link href="/admin">
            <Button variant="outline">Kembali ke Admin</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Kelola Berita</h2>
          <Button onClick={() => editingId ? handleCancelEdit() : setIsAdding(!isAdding)} className="bg-primary hover:bg-primary-dark text-background w-full sm:w-auto">
            {isAdding ? "Batal" : "+ Tambah Berita"}
          </Button>
        </div>

        {/* Add/Edit News Form */}
        {isAdding && (
          <div className="mb-8 p-6 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border">
            <h3 className="text-xl font-bold mb-4 text-foreground">
              {editingId ? "Edit Berita" : "Tambah Berita Baru"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Judul</label>
                <Input
                  value={editingId ? editNews.title : newNews.title}
                  onChange={(e) => editingId
                    ? setEditNews({ ...editNews, title: e.target.value })
                    : setNewNews({ ...newNews, title: e.target.value })
                  }
                  placeholder="Judul berita"
                  className="bg-input border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Deskripsi</label>
                <textarea
                  value={editingId ? editNews.description : newNews.description}
                  onChange={(e) => editingId
                    ? setEditNews({ ...editNews, description: e.target.value })
                    : setNewNews({ ...newNews, description: e.target.value })
                  }
                  placeholder="Deskripsi berita"
                  className="w-full p-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Konten Lengkap (Opsional)</label>
                <textarea
                  value={editingId ? editNews.content : newNews.content}
                  onChange={(e) => editingId
                    ? setEditNews({ ...editNews, content: e.target.value })
                    : setNewNews({ ...newNews, content: e.target.value })
                  }
                  placeholder="Konten lengkap berita"
                  className="w-full p-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={5}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ikon</label>
                  <Input
                    value={editingId ? editNews.icon : newNews.icon}
                    onChange={(e) => editingId
                      ? setEditNews({ ...editNews, icon: e.target.value })
                      : setNewNews({ ...newNews, icon: e.target.value })
                    }
                    placeholder="📰"
                    className="bg-input border-border"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingId ? editNews.published : newNews.published}
                      onChange={(e) => editingId
                        ? setEditNews({ ...editNews, published: e.target.checked })
                        : setNewNews({ ...newNews, published: e.target.checked })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm font-medium">Dipublikasikan</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={editingId ? handleUpdateNews : handleAddNews} className="flex-1 bg-primary hover:bg-primary-dark text-background">
                  {editingId ? "Update Berita" : "Simpan Berita"}
                </Button>
                {editingId && (
                  <Button onClick={handleCancelEdit} variant="outline" className="flex-1">
                    Batal Edit
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {news.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border flex flex-col lg:flex-row justify-between items-start gap-4"
            >
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
                  <div className="text-2xl sm:text-3xl">{item.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">{item.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded text-xs ${item.published ? 'bg-green-500/20 text-green-600' : 'bg-gray-500/20 text-gray-600'}`}>
                        {item.published ? 'Published' : 'Draft'}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground mb-3 text-sm sm:text-base">{item.description}</p>
                {item.content && (
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{item.content}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 w-full lg:w-auto lg:ml-4">
                <Button
                  onClick={() => togglePublished(item.id, item.published)}
                  variant="outline"
                  className={`flex-1 lg:flex-initial ${item.published ? "text-orange-600 border-orange-600 hover:bg-orange-50" : "text-green-600 border-green-600 hover:bg-green-50"}`}
                >
                  {item.published ? "Unpublish" : "Publish"}
                </Button>
                <Button
                  onClick={() => handleEditNews(item)}
                  variant="outline"
                  className="flex-1 lg:flex-initial text-primary border-primary hover:bg-primary/10"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteNews(item.id)}
                  variant="outline"
                  className="flex-1 lg:flex-initial text-error border-error hover:bg-error/10"
                >
                  Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
