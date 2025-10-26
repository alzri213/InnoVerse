"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Send, MessageCircle, Loader2, Mail, Phone, MapPin, Clock, HelpCircle, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { RealtimeChannel } from "@supabase/supabase-js"

interface ChatMessage {
  id: string
  username: string
  message: string
  created_at: string
  user_id?: string
  avatar_url?: string
}

export default function PublicChat({ language = 'en' }: { language?: 'en' | 'id' }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const supabase = createClient()
  const channelRef = useRef<RealtimeChannel | null>(null)

  // Use localStorage to persist messages across sessions
  const MESSAGES_KEY = 'public_chat_messages'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load initial messages
  useEffect(() => {
    loadMessages()
  }, [])

  // Set up real-time subscription
  useEffect(() => {
    setupRealtimeSubscription()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [])

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
    }
  }, [messages])

  const loadMessages = async () => {
    try {
      // Load from API first
      const response = await fetch('/api/chat?limit=50')
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      } else {
        // Fallback to localStorage if API fails
        const storedMessages = localStorage.getItem(MESSAGES_KEY)
        if (storedMessages) {
          const parsedMessages = JSON.parse(storedMessages)
          setMessages(parsedMessages)
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error)
      // Fallback to localStorage if API fails
      const storedMessages = localStorage.getItem(MESSAGES_KEY)
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages)
        setMessages(parsedMessages)
      }
    }
  }

  const setupRealtimeSubscription = () => {
    channelRef.current = supabase
      .channel('public_chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'public_chat_messages',
          filter: 'is_moderated=eq.false'
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage
          setMessages(prev => {
            // Avoid duplicates
            if (prev.some(msg => msg.id === newMessage.id)) {
              return prev
            }
            return [...prev, newMessage]
          })
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage.trim(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // The message will be added via real-time subscription
        setInputMessage("")
      } else {
        const errorData = await response.json()
        console.error('Error sending message:', errorData.error)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Skip authentication check for now
  // if (!user) {
  //   return (
  //     <Card className="w-full max-w-2xl mx-auto">
  //       <CardContent className="p-6 text-center">
  //         <MessageCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
  //         <h3 className="text-lg font-semibold mb-2">
  //           Login Required
  //         </h3>
  //         <p className="text-muted-foreground">
  //           Silakan login untuk bergabung dalam obrolan komunitas
  //         </p>
  //       </CardContent>
  //     </Card>
  //   )
  // }

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 h-auto lg:h-[700px] px-4 md:px-0">
      {/* Contact Section - Left Side */}
      <div className="lg:col-span-1 order-2 lg:order-1">
        <Card className="h-full min-h-[500px] lg:h-full bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <HelpCircle className="w-5 h-5 text-primary" />
              Hubungi Kami
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Informasi kontak dan bantuan
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px] md:h-[500px] lg:h-[600px] p-4">
              <div className="space-y-4 md:space-y-6">
                <div className="bg-card rounded-lg p-4 md:p-6 border shadow-sm">
                  <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
                    <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    Informasi Kontak
                  </h3>
                  <div className="space-y-2 md:space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground flex-shrink-0" />
                      <span><strong>Email:</strong> support@innoverse.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground flex-shrink-0" />
                      <span><strong>Telepon:</strong> +62 812-3456-7890</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground flex-shrink-0" />
                      <span><strong>Jam Operasional:</strong> Senin - Jumat, 08:00 - 17:00 WIB</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg p-4 md:p-6 border shadow-sm">
                  <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    Alamat
                  </h3>
                  <div className="text-sm">
                    <p>Jl. Teknologi No. 123</p>
                    <p>Jakarta Selatan, DKI Jakarta 12345</p>
                    <p>Indonesia</p>
                  </div>
                </div>

                <div className="bg-card rounded-lg p-4 md:p-6 border shadow-sm">
                  <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    Bantuan Cepat
                  </h3>
                  <div className="space-y-1 md:space-y-2 text-sm">
                    <p>• Panduan penggunaan platform</p>
                    <p>• Pertanyaan teknis</p>
                    <p>• Masukan dan saran</p>
                    <p>• Laporan bug</p>
                  </div>
                </div>

                {/* Additional Content to Fill Space */}
                <div className="bg-card rounded-lg p-4 md:p-6 border shadow-sm">
                  <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    Komunitas
                  </h3>
                  <div className="text-sm space-y-2">
                    <p>Bergabunglah dengan komunitas InnoVerse untuk:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Berbagi pengalaman belajar</li>
                      <li>Mendapatkan bantuan dari sesama</li>
                      <li>Mengikuti update terbaru</li>
                      <li>Berpartisipasi dalam diskusi</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Chat Section - Right Side */}
      <div className="lg:col-span-2 order-1 lg:order-2">
        <Card className="h-full min-h-[500px] lg:h-full flex flex-col bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              Public Chat Komunitas
              <div className={`w-2 h-2 rounded-full ml-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Diskusi bersama komunitas InnoVerse • {messages.length} pesan
            </p>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-3 md:p-4">
              <div className="space-y-3 md:space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-6 md:py-8">
                    <MessageCircle className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 text-primary/50" />
                    <p className="text-muted-foreground">
                      Belum ada pesan. Jadilah yang pertama memulai percakapan!
                    </p>
                  </div>
                )}

                {messages.map((message) => (
                  <div key={message.id} className="flex gap-2 md:gap-3">
                    <Avatar className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0">
                      <AvatarImage src={message.avatar_url} alt={message.username} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs md:text-sm">
                        {message.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 md:gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-xs md:text-sm">{message.username}</span>
                        {message.user_id && (
                          <span className="text-xs bg-primary/20 text-primary px-1.5 md:px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatTime(message.created_at)}
                        </span>
                      </div>
                      <div className="bg-muted rounded-lg px-2 md:px-3 py-1 md:py-2 max-w-[85%] md:max-w-[70%] shadow-sm">
                        <p className="text-xs md:text-sm whitespace-pre-wrap break-words">{message.message}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t p-3 md:p-4 bg-muted/10">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ketik pesan Anda..."
                  disabled={isLoading}
                  maxLength={500}
                  className="flex-1 text-sm md:text-base"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="icon"
                  className="bg-primary hover:bg-primary/90 flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                  ) : (
                    <Send className="w-3 h-3 md:w-4 md:h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Pesan akan dikirim secara real-time • Maksimal 500 karakter
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
