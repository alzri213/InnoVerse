"use client"

import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import AnimatedSection from "@/components/animated-section"
import AnimatedText from "@/components/animated-text"
import Link from "next/link"

interface User {
  id: string
  username: string
  full_name: string
  role: string
  created_at: string
}

interface UserStats {
  totalUsers: number
  activeUsers: number
  newUsersThisMonth: number
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<UserStats>({ totalUsers: 0, activeUsers: 0, newUsersThisMonth: 0 })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 12
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

      // Fetch all users
      const { data: usersData } = await supabase.from("profiles").select("*")

      if (usersData) {
        setUsers(usersData)

        // Calculate stats
        const now = new Date()
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const newUsersThisMonth = usersData.filter(user => new Date(user.created_at) >= thisMonth).length
        const activeUsers = Math.floor(usersData.length * 0.7) // Assuming 70% are active

        setStats({
          totalUsers: usersData.length,
          activeUsers,
          newUsersThisMonth
        })
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  // Filter and paginate users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.username?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [users, searchQuery, roleFilter])

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
        <AnimatedText className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-foreground">
          Kelola Pengguna
        </AnimatedText>

        {/* Stats Cards */}
        <AnimatedSection delay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Total Pengguna</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalUsers}</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Pengguna Aktif</p>
                  <p className="text-3xl font-bold text-foreground">{stats.activeUsers}</p>
                </div>
                <div className="text-4xl">🟢</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Baru Bulan Ini</p>
                  <p className="text-3xl font-bold text-foreground">{stats.newUsersThisMonth}</p>
                </div>
                <div className="text-4xl">🆕</div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Search and Filter */}
        <AnimatedSection delay={0.2} className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Cari pengguna berdasarkan nama atau username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Role</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </AnimatedSection>

        {/* Users Grid */}
        <AnimatedSection delay={0.3}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paginatedUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full bg-gradient-to-br from-muted/20 to-muted/5 border-border hover:border-primary/50 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`/placeholder-user.jpg`} alt={user.full_name || user.username} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {(user.full_name || user.username).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{user.full_name || "Nama tidak tersedia"}</h3>
                        <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <Badge
                        variant={user.role === "admin" ? "default" : "secondary"}
                        className={user.role === "admin" ? "bg-accent/20 text-accent hover:bg-accent/30" : "bg-primary/20 text-primary hover:bg-primary/30"}
                      >
                        {user.role === "admin" ? "Admin" : "User"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Bergabung {new Date(user.created_at).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full">
                          Lihat Profil
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full">
                          Edit
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button size="sm" variant="destructive" className="w-full">
                          Ban
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Pagination */}
        {totalPages > 1 && (
          <AnimatedSection delay={0.4} className="flex justify-center mt-8">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ← Sebelumnya
              </Button>
              <span className="px-4 py-2 text-sm text-muted-foreground">
                Halaman {currentPage} dari {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Selanjutnya →
              </Button>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  )
}
