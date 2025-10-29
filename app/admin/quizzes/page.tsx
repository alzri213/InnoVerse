"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Kelola Quiz</h2>
          <Button onClick={() => editingId ? handleCancelEdit() : setIsAdding(!isAdding)} className="bg-primary hover:bg-primary-dark text-background w-full sm:w-auto">
            {isAdding ? "Batal" : "+ Tambah Quiz"}
          </Button>
        </div>

        {/* Add/Edit Quiz Form */}
        {isAdding && (
          <div className="mb-8 p-6 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border">
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
                <Button onClick={editingId ? handleUpdateQuiz : handleAddQuiz} className="flex-1 bg-primary hover:bg-primary-dark text-background">
                  {editingId ? "Update Quiz" : "Simpan Quiz"}
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
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-4 sm:p-6 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border flex flex-col lg:flex-row justify-between items-start gap-4"
            >
              <div className="flex-1 w-full">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{quiz.title}</h3>
                <p className="text-muted-foreground mb-3 text-sm sm:text-base">{quiz.description}</p>
                <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span>{quiz.total_questions} soal</span>
                  <span>Pass: {quiz.passing_score}%</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    quiz.category === 'RPL' ? 'bg-blue-500/20 text-blue-600' :
                    quiz.category === 'DKV' ? 'bg-purple-500/20 text-purple-600' :
                    quiz.category === 'TKJ' ? 'bg-green-500/20 text-green-600' :
                    quiz.category === 'TELKO/TRANS' ? 'bg-orange-500/20 text-orange-600' :
                    'bg-gray-500/20 text-gray-600'
                  }`}>
                    {quiz.category}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 w-full lg:w-auto lg:ml-4">
                <Button
                  onClick={() => handleEditQuiz(quiz)}
                  variant="outline"
                  className="flex-1 lg:flex-initial text-primary border-primary hover:bg-primary/10"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteQuiz(quiz.id)}
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
