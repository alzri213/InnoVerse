"use client"

import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import AnimatedSection from "@/components/animated-section"
import AnimatedText from "@/components/animated-text"
import Link from "next/link"

interface Material {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  duration_minutes: number
}

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const materialsPerPage = 9
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    description: "",
    category: "RPL",
    difficulty: "Beginner",
    duration_minutes: 60,
  })
  const [editMaterial, setEditMaterial] = useState({
    title: "",
    description: "",
    category: "RPL",
    difficulty: "Beginner",
    duration_minutes: 60,
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

      // Fetch materials
      const { data: materialsData } = await supabase.from("materials").select("*")

      setMaterials(materialsData || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  // Filter and paginate materials
  const filteredMaterials = useMemo(() => {
    return materials.filter(material => {
      const matchesSearch = material.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           material.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === "all" || material.category === categoryFilter
      const matchesDifficulty = difficultyFilter === "all" || material.difficulty === difficultyFilter
      return matchesSearch && matchesCategory && matchesDifficulty
    })
  }, [materials, searchQuery, categoryFilter, difficultyFilter])

  const totalPages = Math.ceil(filteredMaterials.length / materialsPerPage)
  const paginatedMaterials = filteredMaterials.slice(
    (currentPage - 1) * materialsPerPage,
    currentPage * materialsPerPage
  )

  const handleAddMaterial = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from("materials")
      .insert([
        {
          ...newMaterial,
          created_by: user.id,
        },
      ])
      .select()

    if (!error && data) {
      setMaterials([...materials, data[0]])
      setNewMaterial({
        title: "",
        description: "",
        category: "RPL",
        difficulty: "Beginner",
        duration_minutes: 60,
      })
      setIsAdding(false)
    }
  }

  const handleEditMaterial = (material: Material) => {
    setEditingId(material.id)
    setEditMaterial({
      title: material.title,
      description: material.description,
      category: material.category,
      difficulty: material.difficulty,
      duration_minutes: material.duration_minutes,
    })
    setIsAdding(true)
  }

  const handleUpdateMaterial = async () => {
    if (!editingId) return

    const { data, error } = await supabase
      .from("materials")
      .update(editMaterial)
      .eq("id", editingId)
      .select()

    if (!error && data) {
      setMaterials(materials.map((m) => (m.id === editingId ? data[0] : m)))
      setEditingId(null)
      setEditMaterial({
        title: "",
        description: "",
        category: "RPL",
        difficulty: "Beginner",
        duration_minutes: 60,
      })
      setIsAdding(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditMaterial({
      title: "",
      description: "",
      category: "RPL",
      difficulty: "Beginner",
      duration_minutes: 60,
    })
    setIsAdding(false)
  }

  const handleDeleteMaterial = async (id: string) => {
    await supabase.from("materials").delete().eq("id", id)
    setMaterials(materials.filter((m) => m.id !== id))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading materials...</p>
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
          Kelola Materi Pembelajaran
        </AnimatedText>

        {/* Stats Cards */}
        <AnimatedSection delay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Total Materi</p>
                  <p className="text-3xl font-bold text-foreground">{materials.length}</p>
                </div>
                <div className="text-4xl">📚</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">RPL</p>
                  <p className="text-3xl font-bold text-foreground">{materials.filter(m => m.category === 'RPL').length}</p>
                </div>
                <div className="text-4xl">💻</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">DKV</p>
                  <p className="text-3xl font-bold text-foreground">{materials.filter(m => m.category === 'DKV').length}</p>
                </div>
                <div className="text-4xl">🎨</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-purple-500/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">TKJ</p>
                  <p className="text-3xl font-bold text-foreground">{materials.filter(m => m.category === 'TKJ').length}</p>
                </div>
                <div className="text-4xl">🔧</div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Search and Filters */}
        <AnimatedSection delay={0.2} className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Cari materi berdasarkan judul atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Filter Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="RPL">RPL</SelectItem>
              <SelectItem value="DKV">DKV</SelectItem>
              <SelectItem value="TKJ">TKJ</SelectItem>
              <SelectItem value="TRANS/TELKO">TRANS/TELKO</SelectItem>
            </SelectContent>
          </Select>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Filter Kesulitan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tingkat</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => editingId ? handleCancelEdit() : setIsAdding(!isAdding)}
              className="bg-primary hover:bg-primary-dark text-background w-full lg:w-auto"
            >
              {isAdding ? "Batal" : "+ Tambah Materi"}
            </Button>
          </motion.div>
        </AnimatedSection>

        {/* Add/Edit Material Form */}
        <AnimatePresence>
          {isAdding && (
            <AnimatedSection delay={0.3} className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="p-6 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border shadow-2xl"
              >
                <h3 className="text-xl font-bold mb-4 text-foreground">
                  {editingId ? "Edit Materi" : "Tambah Materi Baru"}
                </h3>
                <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Judul</label>
                <Input
                  value={editingId ? editMaterial.title : newMaterial.title}
                  onChange={(e) => editingId
                    ? setEditMaterial({ ...editMaterial, title: e.target.value })
                    : setNewMaterial({ ...newMaterial, title: e.target.value })
                  }
                  placeholder="Judul materi"
                  className="bg-input border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Deskripsi</label>
                <textarea
                  value={editingId ? editMaterial.description : newMaterial.description}
                  onChange={(e) => editingId
                    ? setEditMaterial({ ...editMaterial, description: e.target.value })
                    : setNewMaterial({ ...newMaterial, description: e.target.value })
                  }
                  placeholder="Deskripsi materi"
                  className="w-full p-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Kategori</label>
                  <select
                    value={editingId ? editMaterial.category : newMaterial.category}
                    onChange={(e) => editingId
                      ? setEditMaterial({ ...editMaterial, category: e.target.value })
                      : setNewMaterial({ ...newMaterial, category: e.target.value })
                    }
                    className="w-full p-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>RPL</option>
                    <option>DKV</option>
                    <option>TKJ</option>
                    <option>TRANS/TELKO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tingkat Kesulitan</label>
                  <select
                    value={editingId ? editMaterial.difficulty : newMaterial.difficulty}
                    onChange={(e) => editingId
                      ? setEditMaterial({ ...editMaterial, difficulty: e.target.value })
                      : setNewMaterial({ ...newMaterial, difficulty: e.target.value })
                    }
                    className="w-full p-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Durasi (menit)</label>
                <Input
                  type="number"
                  value={editingId ? editMaterial.duration_minutes : newMaterial.duration_minutes}
                  onChange={(e) =>
                    editingId
                      ? setEditMaterial({ ...editMaterial, duration_minutes: Number.parseInt(e.target.value) })
                      : setNewMaterial({ ...newMaterial, duration_minutes: Number.parseInt(e.target.value) })
                  }
                  className="bg-input border-border"
                />
              </div>
                <div className="flex gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                    <Button onClick={editingId ? handleUpdateMaterial : handleAddMaterial} className="w-full bg-primary hover:bg-primary-dark text-background">
                      {editingId ? "Update Materi" : "Simpan Materi"}
                    </Button>
                  </motion.div>
                  {editingId && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button onClick={handleCancelEdit} variant="outline" className="w-full">
                        Batal Edit
                      </Button>
                    </motion.div>
                  )}
                </div>
                </div>
              </motion.div>
            </AnimatedSection>
          )}
        </AnimatePresence>

        {/* Materials Grid */}
        <AnimatedSection delay={0.4}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paginatedMaterials.map((material, index) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full bg-gradient-to-br from-muted/20 to-muted/5 border-border hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        variant="secondary"
                        className={`${
                          material.category === 'RPL' ? 'bg-blue-500/20 text-blue-600' :
                          material.category === 'DKV' ? 'bg-purple-500/20 text-purple-600' :
                          material.category === 'TKJ' ? 'bg-green-500/20 text-green-600' :
                          'bg-orange-500/20 text-orange-600'
                        }`}
                      >
                        {material.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`${
                          material.difficulty === 'Beginner' ? 'border-green-500 text-green-600' :
                          material.difficulty === 'Intermediate' ? 'border-yellow-500 text-yellow-600' :
                          'border-red-500 text-red-600'
                        }`}
                      >
                        {material.difficulty}
                      </Badge>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {material.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">{material.description}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>⏱️</span>
                        <span>{material.duration_minutes} menit</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {material.category}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button
                          onClick={() => handleEditMaterial(material)}
                          variant="outline"
                          className="w-full text-primary border-primary hover:bg-primary/10"
                        >
                          Edit
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button
                          onClick={() => handleDeleteMaterial(material.id)}
                          variant="destructive"
                          className="w-full"
                        >
                          Hapus
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
          <AnimatedSection delay={0.5} className="flex justify-center mt-8">
            <div className="flex gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  ← Sebelumnya
                </Button>
              </motion.div>
              <span className="px-4 py-2 text-sm text-muted-foreground">
                Halaman {currentPage} dari {totalPages}
              </span>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Selanjutnya →
                </Button>
              </motion.div>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  )
}
