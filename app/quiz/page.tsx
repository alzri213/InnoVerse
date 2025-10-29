"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Quiz {
  id: string
  title: string
  description: string
  total_questions: number
  passing_score: number
  category: string
}

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const supabase = createClient()

  const categories = [
    { id: 'all', name: 'Semua Kategori', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' },
    { id: 'RPL', name: 'Rekayasa Perangkat Lunak', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    { id: 'DKV', name: 'Desain Komunikasi Visual', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    { id: 'TKJ', name: 'Teknik Komputer Jaringan', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    { id: 'TELKO/TRANS', name: 'Teknik Telekomunikasi/Transmisi', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' }
  ]

  const filteredQuizzes = selectedCategory === 'all'
    ? quizzes
    : quizzes.filter(quiz => quiz.category === selectedCategory)

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser()
      setUser(userData.user)

      const { data } = await supabase.from("quizzes").select("*")
      setQuizzes(data || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Quiz</h1>
          <p className="text-lg text-muted-foreground mb-8">Uji pemahaman Anda dengan quiz interaktif kami</p>

          {/* Category Filter */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Pilih Kategori</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category.id
                      ? `${category.color} ring-2 ring-offset-2 ring-primary shadow-lg transform scale-105`
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quizzes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Loading quizzes...</p>
              </div>
            ) : filteredQuizzes.length > 0 ? (
              filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-6 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-foreground">{quiz.title}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{quiz.description}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${quiz.category === 'RPL' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          quiz.category === 'DKV' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                            quiz.category === 'TKJ' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              quiz.category === 'TELKO/TRANS' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}>
                        {quiz.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <span>{quiz.total_questions} soal</span>
                    <span>Pass: {quiz.passing_score}%</span>
                  </div>

                  {user ? (
                    <Link href={`/quiz/${quiz.id}`}>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-background h-12 font-semibold">Mulai Quiz</Button>
                    </Link>
                  ) : (
                    <Link href="/auth/login">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-background h-12 font-semibold">
                        Login untuk Mulai
                      </Button>
                    </Link>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  {selectedCategory === 'all' ? 'No quizzes available yet' : `Tidak ada quiz untuk kategori ${categories.find(c => c.id === selectedCategory)?.name}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
