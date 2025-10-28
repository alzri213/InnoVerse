"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Trash2, Search, MessageCircle, User, Clock } from "lucide-react"

interface ChatMessage {
  id: string
  user_id: string | null
  username: string
  message: string
  created_at: string
  is_moderated: boolean
}

interface UserProfile {
  id: string
  username: string
  role: string
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<ChatMessage[]>([])
  const [filteredComments, setFilteredComments] = useState<ChatMessage[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
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

      // Fetch all comments (including moderated ones for admin view)
      const { data: commentsData } = await supabase
        .from("public_chat_messages")
        .select("*")
        .order("created_at", { ascending: false })

      // Fetch all users to check for moderators
      const { data: usersData } = await supabase
        .from("profiles")
        .select("id, username, role")
        .in("role", ["admin", "moderator"])

      setComments(commentsData || [])
      setFilteredComments(commentsData || [])
      setUsers(usersData || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const filtered = comments.filter(comment =>
      comment.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.message.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredComments(filtered)
  }, [searchTerm, comments])

  const handleDeleteComment = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus komentar ini?")) return

    try {
      const { error } = await supabase
        .from("public_chat_messages")
        .delete()
        .eq("id", id)

      if (error) {
        console.error("Error deleting comment:", error)
        alert("Gagal menghapus komentar. Silakan coba lagi.")
        return
      }

      // Update both state arrays to remove the deleted comment
      setComments(prevComments => prevComments.filter(comment => comment.id !== id))
      setFilteredComments(prevFilteredComments => prevFilteredComments.filter(comment => comment.id !== id))

      alert("Komentar berhasil dihapus!")
    } catch (err) {
      console.error("Unexpected error:", err)
      alert("Terjadi kesalahan tak terduga. Silakan coba lagi.")
    }
  }

  const toggleModerateComment = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("public_chat_messages")
        .update({ is_moderated: !currentStatus })
        .eq("id", id)

      if (error) {
        console.error("Error moderating comment:", error)
        alert("Gagal memoderasi komentar. Silakan coba lagi.")
        return
      }

      // Update both state arrays to reflect the moderation change
      const updatedComments = comments.map(comment =>
        comment.id === id
          ? { ...comment, is_moderated: !currentStatus }
          : comment
      )
      const updatedFilteredComments = filteredComments.map(comment =>
        comment.id === id
          ? { ...comment, is_moderated: !currentStatus }
          : comment
      )

      setComments(updatedComments)
      setFilteredComments(updatedFilteredComments)

      alert(`Komentar berhasil ${!currentStatus ? 'dimoderasi' : 'dibatalkan moderasinya'}!`)
    } catch (err) {
      console.error("Unexpected error:", err)
      alert("Terjadi kesalahan tak terduga. Silakan coba lagi.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading comments...</p>
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
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Kelola Komentar Public Chat</h2>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari komentar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Aktif ({comments.filter(c => !c.is_moderated).length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Dimoderasi ({comments.filter(c => c.is_moderated).length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>Anonymous ({comments.filter(c => !c.user_id).length})</span>
          </div>
        </div>

        <div className="space-y-4">
          {filteredComments.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchTerm ? "Tidak ada komentar yang cocok dengan pencarian" : "Belum ada komentar"}
              </p>
            </div>
          ) : (
            filteredComments.map((comment) => (
              <div
                key={comment.id}
                className={`p-4 sm:p-6 rounded-lg border transition-all ${
                  comment.is_moderated
                    ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
                    : 'bg-gradient-to-br from-muted/20 to-muted/5 border-border'
                }`}
              >
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground">{comment.username}</span>
                        {comment.user_id && users.find(u => u.id === comment.user_id)?.role === 'moderator' && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full dark:bg-blue-900 dark:text-blue-400">
                            Moderator
                          </span>
                        )}
                        {comment.user_id && users.find(u => u.id === comment.user_id)?.role === 'admin' && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full dark:bg-purple-900 dark:text-purple-400">
                            Admin
                          </span>
                        )}
                        {!comment.user_id && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full dark:bg-gray-800 dark:text-gray-400">
                            Anonymous
                          </span>
                        )}
                        {comment.is_moderated && (
                          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full dark:bg-red-900 dark:text-red-400">
                            Dimoderasi
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(comment.created_at).toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div className="bg-background rounded-lg p-3 border shadow-sm">
                      <p className="text-foreground whitespace-pre-wrap">{comment.message}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full lg:w-auto lg:ml-4">
                    <Button
                      onClick={() => toggleModerateComment(comment.id, comment.is_moderated)}
                      variant="outline"
                      size="sm"
                      className={`flex-1 lg:flex-initial ${comment.is_moderated
                        ? "text-green-600 border-green-600 hover:bg-green-50 dark:text-green-400 dark:border-green-400 dark:hover:bg-green-950/20"
                        : "text-orange-600 border-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-400 dark:hover:bg-orange-950/20"
                      }`}
                    >
                      {comment.is_moderated ? "Unmoderate" : "Moderate"}
                    </Button>
                    <Button
                      onClick={() => handleDeleteComment(comment.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1 lg:flex-initial text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="w-4 h-4 lg:mr-1" />
                      <span className="lg:inline hidden">Hapus</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
