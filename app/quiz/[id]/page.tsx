"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import Link from "next/link"

interface QuizQuestion {
  id: string
  question_text: string
  options: Record<string, string>
  correct_answer: string
  explanation: string
}

interface Quiz {
  id: string
  title: string
  description: string
  total_questions: number
  passing_score: number
}

export default function QuizDetailPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [timeUp, setTimeUp] = useState(false)
  const [markedQuestions, setMarkedQuestions] = useState<Set<string>>(new Set())
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [showQuestionDrawer, setShowQuestionDrawer] = useState(false)
  const router = useRouter()
  const params = useParams()
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

      setUser(user)

      // Fetch quiz
      const { data: quizData } = await supabase.from("quizzes").select("*").eq("id", params.id).single()

      setQuiz(quizData)

      // Fetch questions
      const { data: questionsData } = await supabase.from("quiz_questions").select("*").eq("quiz_id", params.id)

      setQuestions(questionsData || [])
      setLoading(false)
    }

    fetchData()
  }, [params.id])

  // Timer effect
  useEffect(() => {
    if (loading || submitted || timeUp) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimeUp(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [loading, submitted, timeUp])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  const handleRestartQuiz = () => {
    setTimeLeft(25 * 60)
    setTimeUp(false)
    setCurrentQuestion(0)
    setAnswers({})
    setSubmitted(false)
    setScore(0)
    setMarkedQuestions(new Set())
  }

  const handleExitQuiz = () => {
    // Reset all quiz state when exiting
    setCurrentQuestion(0)
    setAnswers({})
    setSubmitted(false)
    setScore(0)
    setMarkedQuestions(new Set())
    setTimeLeft(25 * 60)
    setTimeUp(false)
    setShowExitDialog(false)
    router.push('/quiz')
  }

  const handleContinueQuiz = () => {
    setShowExitDialog(false)
  }

  const handleQuestionClick = (index: number) => {
    setCurrentQuestion(index)
  }

  const toggleMarkQuestion = (questionId: string) => {
    setMarkedQuestions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  const getQuestionStatus = (questionId: string, index: number) => {
    if (answers[questionId]) {
      return 'answered' // hijau
    }
    if (markedQuestions.has(questionId)) {
      return 'marked' // kuning
    }
    if (currentQuestion === index) {
      return 'current' // biru
    }
    return 'unanswered' // abu-abu
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    })
  }

  const handleSubmitQuiz = async () => {
    if (!user || !quiz) return

    // Calculate score
    let correctCount = 0
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) {
        correctCount++
      }
    })

    const calculatedScore = Math.round((correctCount / questions.length) * 100)
    setScore(calculatedScore)
    setSubmitted(true)

    // Save attempt
    await supabase.from("quiz_attempts").insert([
      {
        user_id: user.id,
        quiz_id: quiz.id,
        score: calculatedScore,
        passed: calculatedScore >= quiz.passing_score,
        answers,
        completed_at: new Date().toISOString(),
      },
    ])
  }

  const handleTimeUpSubmit = async () => {
    if (!user || !quiz) return

    // Calculate score with current answers
    let correctCount = 0
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) {
        correctCount++
      }
    })

    const calculatedScore = Math.round((correctCount / questions.length) * 100)
    setScore(calculatedScore)
    setSubmitted(true)

    // Save attempt
    await supabase.from("quiz_attempts").insert([
      {
        user_id: user.id,
        quiz_id: quiz.id,
        score: calculatedScore,
        passed: calculatedScore >= quiz.passing_score,
        answers,
        completed_at: new Date().toISOString(),
      },
    ])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading quiz...</p>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Quiz not found</p>
      </div>
    )
  }

  if (submitted) {
    const passed = score >= quiz.passing_score
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/quiz">
              <h1 className="text-2xl font-bold cursor-pointer">
                <span className="text-primary">Inno</span>
                <span className="text-accent">Verse</span>
              </h1>
            </Link>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className={`text-6xl mb-6 ${passed ? "text-success" : "text-error"}`}>{passed ? "🎉" : "📚"}</div>
          <h2 className="text-4xl font-bold mb-4 text-foreground">{passed ? "Selamat!" : "Coba Lagi"}</h2>
          <p className="text-2xl font-bold mb-2">
            Skor Anda: <span className={passed ? "text-success" : "text-error"}>{score}%</span>
          </p>
          <p className="text-muted-foreground mb-8">Nilai Kelulusan: {quiz.passing_score}%</p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/quiz">
              <Button className="bg-primary hover:bg-primary-dark text-background">Kembali ke Quiz</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Ke Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (timeUp) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/quiz">
              <h1 className="text-2xl font-bold cursor-pointer">
                <span className="text-primary">Inno</span>
                <span className="text-accent">Verse</span>
              </h1>
            </Link>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="text-6xl mb-6 text-error animate-bounce">⏰</div>
          <h2 className="text-4xl font-bold mb-4 text-foreground">Waktu Kamu Habis!</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Waktu 25 menit untuk mengerjakan quiz telah berakhir
          </p>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-6 rounded-lg border border-red-200 dark:border-red-800 mb-8">
            <p className="text-sm text-muted-foreground mb-4">
              Jawaban yang telah Anda isi akan dinilai secara otomatis
            </p>
            <Button
              onClick={handleTimeUpSubmit}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Lihat Hasil
            </Button>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button onClick={handleRestartQuiz} className="bg-primary hover:bg-primary-dark text-background">
              Mulai Ulang Quiz
            </Button>
            <Link href="/quiz">
              <Button variant="outline">Kembali ke Quiz</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No questions found for this quiz</p>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Link href="/quiz">
              <h1 className="text-xl sm:text-2xl font-bold cursor-pointer">
                <span className="text-primary">Inno</span>
                <span className="text-accent">Verse</span>
              </h1>
            </Link>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="text-sm text-muted-foreground">
                Soal {currentQuestion + 1} dari {questions.length}
              </div>
              {/* Timer */}
              <div className={`text-base sm:text-lg font-mono px-2 sm:px-3 py-1 rounded-lg ${timeLeft <= 300 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse' :
                  timeLeft <= 600 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                ⏱️ {formatTime(timeLeft)}
              </div>

              {/* Exit Button */}
              <Button
                onClick={() => setShowExitDialog(true)}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/20 animate-pulse w-full sm:w-auto"
              >
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Question Numbers Sidebar - Hidden on mobile, shown as drawer */}
          <div className="hidden lg:block w-96 flex-shrink-0">
            <div className="bg-gradient-to-br from-card to-card/80 border border-border rounded-xl p-8 sticky top-24 shadow-xl">
              <h3 className="text-2xl font-bold mb-8 text-foreground text-center">Daftar Soal</h3>
              <div className="grid grid-cols-5 gap-4 mb-8">
                {questions.map((q, index) => {
                  const status = getQuestionStatus(q.id, index)
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleQuestionClick(index)}
                      className={`w-14 h-14 rounded-xl font-bold text-lg transition-all transform hover:scale-110 hover:rotate-3 ${status === 'answered'
                          ? 'bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-xl ring-2 ring-green-300'
                          : status === 'marked'
                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600 shadow-xl ring-2 ring-yellow-300'
                            : status === 'current'
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-4 ring-blue-300 shadow-2xl animate-pulse'
                              : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400 dark:from-gray-700 dark:to-gray-600 dark:text-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 shadow-lg'
                        }`}
                    >
                      {index + 1}
                    </button>
                  )
                })}
              </div>
              <div className="border-t border-border/50 pt-6">
                <h4 className="text-base font-bold mb-4 text-foreground text-center">Keterangan Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md ring-1 ring-green-300"></div>
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">Sudah dijawab</span>
                  </div>
                  <div className="flex items-center gap-4 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                    <div className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg shadow-md ring-1 ring-yellow-300"></div>
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Ragu-ragu</span>
                  </div>
                  <div className="flex items-center gap-4 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg ring-2 ring-blue-300 animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Sedang dikerjakan</span>
                  </div>
                  <div className="flex items-center gap-4 p-2 rounded-lg bg-gray-50 dark:bg-gray-950/20">
                    <div className="w-5 h-5 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg shadow-md"></div>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Belum dijawab</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Question List Button */}
          <div className="lg:hidden mb-4">
            <Drawer open={showQuestionDrawer} onOpenChange={setShowQuestionDrawer}>
              <DrawerTrigger asChild>
                <Button variant="outline" className="w-full">
                  📋 Daftar Soal ({Object.keys(answers).length}/{questions.length} dijawab)
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Daftar Soal</DrawerTitle>
                  <DrawerDescription>
                    Klik nomor soal untuk navigasi
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-8">
                    {questions.map((q, index) => {
                      const status = getQuestionStatus(q.id, index)
                      return (
                        <button
                          key={q.id}
                          onClick={() => {
                            handleQuestionClick(index)
                            setShowQuestionDrawer(false)
                          }}
                          className={`w-16 h-16 rounded-xl font-bold text-lg transition-all transform hover:scale-110 ${status === 'answered'
                              ? 'bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-xl ring-2 ring-green-300'
                              : status === 'marked'
                                ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600 shadow-xl ring-2 ring-yellow-300'
                                : status === 'current'
                                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-4 ring-blue-300 shadow-2xl animate-pulse'
                                  : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400 dark:from-gray-700 dark:to-gray-600 dark:text-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 shadow-lg'
                            }`}
                        >
                          {index + 1}
                        </button>
                      )
                    })}
                  </div>
                  <div className="border-t border-border/50 pt-6">
                    <h4 className="text-base font-bold mb-4 text-foreground text-center">Keterangan Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
                        <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md ring-1 ring-green-300"></div>
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">Sudah dijawab</span>
                      </div>
                      <div className="flex items-center gap-4 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                        <div className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg shadow-md ring-1 ring-yellow-300"></div>
                        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Ragu-ragu</span>
                      </div>
                      <div className="flex items-center gap-4 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                        <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg ring-2 ring-blue-300 animate-pulse"></div>
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Sedang dikerjakan</span>
                      </div>
                      <div className="flex items-center gap-4 p-2 rounded-lg bg-gray-50 dark:bg-gray-950/20">
                        <div className="w-5 h-5 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg shadow-md"></div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Belum dijawab</span>
                      </div>
                    </div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-2xl mx-auto lg:mx-0">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-8 p-4 sm:p-6 lg:p-8 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border">
              <div className="flex items-center gap-3 sm:gap-4 mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-base sm:text-lg shadow-lg">
                  {currentQuestion + 1}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground flex-1">{question?.question_text}</h2>
              </div>

              {/* Options */}
              <div className="space-y-3 sm:space-y-4">
                {question?.options && Object.entries(question.options).map(([key, value], index) => {
                  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F']
                  const isSelected = answers[question.id] === key
                  return (
                    <button
                      key={key}
                      onClick={() => handleAnswerChange(question.id, key)}
                      className={`w-full p-4 sm:p-5 rounded-xl border-2 transition-all text-left ${isSelected
                          ? 'border-primary bg-primary/10 shadow-lg ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50 hover:bg-primary/5'
                        }`}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 transition-all ${isSelected
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background text-muted-foreground border-border'
                          }`}>
                          {optionLabels[index]}
                        </div>
                        <span className={`text-foreground leading-relaxed text-sm sm:text-base ${isSelected ? 'font-medium' : ''}`}>
                          {value}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Mark as Doubtful Button */}
              <div className="mt-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
                <Button
                  onClick={() => toggleMarkQuestion(question.id)}
                  variant={markedQuestions.has(question.id) ? "default" : "outline"}
                  className={`w-full sm:w-auto ${markedQuestions.has(question.id) ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""}`}
                >
                  {markedQuestions.has(question.id) ? "✓ Ditandai Ragu-ragu" : "Ragu-ragu"}
                </Button>

                {currentQuestion === questions.length - 1 ? (
                  <Button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(answers).length !== questions.length}
                    className="bg-primary hover:bg-primary-dark text-background w-full sm:w-auto"
                  >
                    Selesaikan Quiz
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    className="bg-primary hover:bg-primary-dark text-background w-full sm:w-auto"
                  >
                    Selanjutnya →
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi Keluar Quiz</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin keluar dari quiz? Progress Anda akan hilang dan quiz akan dimulai ulang saat masuk lagi.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleContinueQuiz}
              className="flex-1"
            >
              Lanjut Quiz
            </Button>
            <Button
              variant="destructive"
              onClick={handleExitQuiz}
              className="flex-1 animate-pulse"
            >
              Keluar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
