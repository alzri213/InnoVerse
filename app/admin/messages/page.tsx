"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  subject: string
  content: string
  read: boolean
  created_at: string
  type?: 'private' | 'public_chat'
  username?: string
  user_id?: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
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

      // Fetch private messages
      const { data: privateMessages } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })

      // Fetch public chat messages
      const { data: publicChatMessages } = await supabase
        .from("public_chat_messages")
        .select("*")
        .order("created_at", { ascending: false })

      // Combine and mark message types
      const combinedMessages: Message[] = [
        ...(privateMessages || []).map(msg => ({ ...msg, type: 'private' as const })),
        ...(publicChatMessages || []).map(msg => ({
          ...msg,
          type: 'public_chat' as const,
          subject: `Public Chat: ${msg.username}`,
          content: msg.message,
          read: msg.is_moderated // Use is_moderated as read status for public chat
        }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setMessages(combinedMessages)
      setLoading(false)
    }

    fetchData()
  }, [])

  const deleteMessage = async (messageId: string, messageType: 'private' | 'public_chat') => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesan ini?')) return

    setDeletingId(messageId)

    try {
      const table = messageType === 'private' ? 'messages' : 'public_chat_messages'
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', messageId)

      if (error) {
        console.error('Error deleting message:', error)
        alert('Gagal menghapus pesan')
      } else {
        // Remove from local state
        setMessages(prev => prev.filter(msg => msg.id !== messageId))
        alert('Pesan berhasil dihapus')
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      alert('Gagal menghapus pesan')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading messages...</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-8 text-foreground">Pesan & Notifikasi</h2>

        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={`p-6 rounded-lg border transition-all ${
                  message.read ? "bg-muted/10 border-border" : "bg-primary/10 border-primary/50 hover:border-primary"
                } ${message.type === 'public_chat' ? 'border-l-4 border-l-green-500' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-2">
                      {message.subject}
                      {message.type === 'public_chat' && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Public Chat
                        </span>
                      )}
                    </h3>
                    <p className="text-muted-foreground mb-2">{message.content}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{new Date(message.created_at).toLocaleString("id-ID")}</span>
                      {message.type === 'public_chat' && message.user_id && (
                        <span className="text-green-600">• User ID: {message.user_id.slice(0, 8)}...</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {!message.read && <div className="w-3 h-3 rounded-full bg-primary" />}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMessage(message.id, message.type || 'private')}
                      disabled={deletingId === message.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-12">Tidak ada pesan</p>
          )}
        </div>
      </div>
    </div>
  )
}
