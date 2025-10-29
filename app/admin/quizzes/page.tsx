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

interface Quiz {
  id: string
  title: string
  description: string
  total_questions: number
  passing_score: number
  category: string
}

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const quizzesPerPage = 9
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    description: "",
    total_questions: 20,
    passing_score: 70,
    category: "RPL",
  })
  const [editQuiz, setEditQuiz] = useState({
    title: "",
    description: "",
    total_questions: 20,
    passing_score: 70,
    category: "RPL",
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

      // Fetch quizzes
      const { data: quizzesData } = await supabase.from("quizzes").select("*")

      setQuizzes(quizzesData || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  // Filter and paginate quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(quiz => {
      const matchesSearch = quiz.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           quiz.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === "all" || quiz.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [quizzes, searchQuery, categoryFilter])

  const totalPages = Math.ceil(filteredQuizzes.length / quizzesPerPage)
  const paginatedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * quizzesPerPage,
    currentPage * quizzesPerPage
  )

  const handleAddQuiz = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from("quizzes")
      .insert([
        {
          ...newQuiz,
          total_questions: 20, // Always 20 questions
          created_by: user.id,
        },
      ])
      .select()

    if (!error && data) {
      setQuizzes([...quizzes, data[0]])
      setNewQuiz({
        title: "",
        description: "",
        total_questions: 20,
        passing_score: 70,
        category: "RPL",
      })
      setIsAdding(false)
    }
  }

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingId(quiz.id)
    setEditQuiz({
      title: quiz.title,
      description: quiz.description,
      total_questions: quiz.total_questions,
      passing_score: quiz.passing_score,
      category: quiz.category,
    })
    setIsAdding(true)
  }

  const handleUpdateQuiz = async () => {
    if (!editingId) return

    const { data, error } = await supabase
      .from("quizzes")
      .update({
        ...editQuiz,
        total_questions: 20, // Always 20 questions
      })
      .eq("id", editingId)
      .select()

    if (!error && data) {
      setQuizzes(quizzes.map((q) => (q.id === editingId ? data[0] : q)))
      setEditingId(null)
      setEditQuiz({
        title: "",
        description: "",
        total_questions: 20,
        passing_score: 70,
        category: "RPL",
      })
      setIsAdding(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditQuiz({
      title: "",
      description: "",
      total_questions: 20,
      passing_score: 70,
      category: "RPL",
    })
    setIsAdding(false)
  }

  const handleDeleteQuiz = async (id: string) => {
    await supabase.from("quizzes").delete().eq("id", id)
    setQuizzes(quizzes.filter((q) => q.id !== id))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading quizzes...</p>
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
        <AnimatedText className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-foreground">
          Kelola Quiz
        </AnimatedText>

        {/* Stats Cards */}
        <AnimatedSection delay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Total Quiz</p>
                  <p className="text-3xl font-bold text-foreground">{quizzes.length}</p>
                </div>
                <div className="text-4xl">📝</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">RPL</p>
                  <p className="text-3xl font-bold text-foreground">{quizzes.filter(q => q.category === 'RPL').length}</p>
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
                  <p className="text-3xl font-bold text-foreground">{quizzes.filter(q => q.category === 'DKV').length}</p>
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
                  <p className="text-3xl font-bold text-foreground">{quizzes.filter(q => q.category === 'TKJ').length}</p>
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
              placeholder="Cari quiz berdasarkan judul atau deskripsi..."
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
              <SelectItem value="TELKO/TRANS">TELKO/TRANS</SelectItem>
            </SelectContent>
          </Select>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => editingId ? handleCancelEdit() : setIsAdding(!isAdding)}
              className="bg-primary hover:bg-primary-dark text-background w-full lg:w-auto"
            >
              {isAdding ? "Batal" : "+ Tambah Quiz"}
            </Button>
          </motion.div>
        </AnimatedSection>

        {/* Add/Edit Quiz Form */}
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
                  {editingId ? "Edit Quiz" : "Tambah Quiz Baru"}
                </h3>
                <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Judul</label>
                <Input
                  value={editingId ? editQuiz.title : newQuiz.title}
                  onChange={(e) => editingId
                    ? setEditQuiz({ ...editQuiz, title: e.target.value })
                    : setNewQuiz({ ...newQuiz, title: e.target.value })
                  }
                  placeholder="Judul quiz"
                  className="bg-input border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Deskripsi</label>
                <textarea
                  value={editingId ? editQuiz.description : newQuiz.description}
                  onChange={(e) => editingId
                    ? setEditQuiz({ ...editQuiz, description: e.target.value })
                    : setNewQuiz({ ...newQuiz, description: e.target.value })
                  }
                  placeholder="Deskripsi quiz"
                  className="w-full p-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Total Soal</label>
                  <Input
                    type="number"
                    value={20}
                    disabled
                    className="bg-muted border-border cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Semua quiz harus memiliki tepat 20 soal</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nilai Lulus (%)</label>
                  <Input
                    type="number"
                    value={editingId ? editQuiz.passing_score : newQuiz.passing_score}
                    onChange={(e) =>
                      editingId
                        ? setEditQuiz({ ...editQuiz, passing_score: Number.parseInt(e.target.value) })
                        : setNewQuiz({ ...newQuiz, passing_score: Number.parseInt(e.target.value) })
                    }
                    className="bg-input border-border"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Kategori</label>
                <select
                  value={editingId ? editQuiz.category : newQuiz.category}
                  onChange={(e) => editingId
                    ? setEditQuiz({ ...editQuiz, category: e.target.value })
                    : setNewQuiz({ ...newQuiz, category: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="RPL">Rekayasa Perangkat Lunak</option>
                  <option value="DKV">Desain Komunikasi Visual</option>
                  <option value="TKJ">Teknik Komputer Jaringan</option>
                  <option value="TELKO/TRANS">Teknik Telekomunikasi/Transmisi</option>
                </select>
              </div>
                  <div className="flex gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button onClick={editingId ? handleUpdateQuiz : handleAddQuiz} className="w-full bg-primary hover:bg-primary-dark text-background">
                        {editingId ? "Update Quiz" : "Simpan Quiz"}
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

        {/* Quizzes Grid */}
        <AnimatedSection delay={0.4}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paginatedQuizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
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
                          quiz.category === 'RPL' ? 'bg-blue-500/20 text-blue-600' :
                          quiz.category === 'DKV' ? 'bg-purple-500/20 text-purple-600' :
                          quiz.category === 'TKJ' ? 'bg-green-500/20 text-green-600' :
                          'bg-orange-500/20 text-orange-600'
                        }`}
                      >
                        {quiz.category}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {quiz.total_questions} soal
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {quiz.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">{quiz.description}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>📊</span>
                        <span>Pass: {quiz.passing_score}%</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {quiz.category}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button
                          onClick={() => handleEditQuiz(quiz)}
                          variant="outline"
                          className="w-full text-primary border-primary hover:bg-primary/10"
                        >
                          Edit
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button
                          onClick={() => handleDeleteQuiz(quiz.id)}
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
