"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DateTimeDisplay } from "@/components/date-time-display"
import LanguageSwitcher from "@/components/language-switcher"
import { useLanguage } from "@/hooks/useLanguage"
import { useTranslation } from "react-i18next"
import { Menu, X, Sun, Moon } from "lucide-react"

export default function Navigation({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { language, changeLanguage } = useLanguage()
  const { t } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)

    // Load dark mode preference from localStorage
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark)
    setIsDarkMode(initialDarkMode)

    // Apply theme
    if (initialDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Fetch user role if user is logged in
    if (user) {
      const fetchUserRole = async () => {
        const { data: profileData } = await supabase.from("profiles").select("role").eq("id", user.id).single()
        setUserRole(profileData?.role || null)
      }
      fetchUserRole()
    }
  }, [user])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)

    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 md:hidden ${isOpen ? 'block transition-opacity duration-500 ease-out' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ease-out" onClick={() => setIsOpen(false)} />
        <div className={`fixed left-0 top-0 h-full w-64 bg-background border-r border-border shadow-2xl transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-4 border-b">
            <span className="text-xl font-bold">
              <span className="text-primary">Inno</span>
              <span className="text-accent">Verse</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-accent transition-all duration-200 rounded-full hover:scale-110"
            >
              <X className="h-5 w-5 transition-transform duration-200 hover:rotate-90" />
            </Button>
          </div>

          <div className="p-4 space-y-4">
            {/* Mobile Menu Links */}
            <div className="space-y-2">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm ${
                  pathname === "/"
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {t("Home")}
              </Link>
              <Link
                href="/materials"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm ${
                  pathname === "/materials"
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {t("materials")}
              </Link>
              <Link
                href="/quiz"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm ${
                  pathname === "/quiz"
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {t("Quiz")}
              </Link>
              <Link
                href="/news"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm ${
                  pathname === "/news"
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {t("News")}
              </Link>
              <Link
                href="/public-chat"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm ${
                  pathname === "/public-chat"
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {t("Public Chat")}
              </Link>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="border-t pt-4 space-y-2">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-primary hover:bg-primary-dark text-background">
                      {t("Dashboard")}
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full" onClick={() => { handleLogout(); setIsOpen(false); }}>
                    {t("Logout")}
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      {t("Login")}
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-primary hover:bg-primary-dark text-background">
                      {t("SignUp")}
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Language Switcher and Dark Mode */}
            <div className="border-t pt-4 space-y-4">
              <LanguageSwitcher currentLanguage={language} onLanguageChange={changeLanguage} />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dark Mode</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleDarkMode}
                  className="flex items-center gap-2"
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {isDarkMode ? 'Light' : 'Dark'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile Menu Button and Logo */}
            <div className="md:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="hover:bg-accent transition-all duration-200 rounded-full hover:scale-110"
              >
                <Menu className="h-5 w-5 transition-transform duration-200 hover:scale-110" />
              </Button>
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold">
                  <span className="text-primary">Inno</span>
                  <span className="text-accent">Verse</span>
                </span>
              </Link>
            </div>

            {/* Logo - positioned to the left */}
            <Link href="/" className="hidden md:flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold">
                <span className="text-primary">Inno</span>
                <span className="text-accent">Verse</span>
              </span>
            </Link>

            {/* Desktop Menu - centered */}
            <div className="hidden md:flex items-center gap-6 lg:gap-12 flex-1 justify-center">
              <Link
                href="/"
                className={`relative transition-all duration-300 group px-2 lg:px-3 py-2 rounded-md text-sm lg:text-base ${
                  pathname === "/"
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {t("Home")}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transition-all duration-500 ease-out transform ${
                  pathname === "/" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                } origin-left shadow-lg shadow-red-500/50`}></span>
              </Link>
              <Link
                href="/materials"
                className={`relative transition-all duration-300 group px-2 lg:px-3 py-2 rounded-md text-sm lg:text-base ${
                  pathname === "/materials"
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {t("Materials")}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transition-all duration-500 ease-out transform ${
                  pathname === "/materials" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                } origin-left shadow-lg shadow-red-500/50`}></span>
              </Link>
              <Link
                href="/quiz"
                className={`relative transition-all duration-300 group px-2 lg:px-3 py-2 rounded-md text-sm lg:text-base ${
                  pathname === "/quiz"
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {t("Quiz")}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transition-all duration-500 ease-out transform ${
                  pathname === "/quiz" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                } origin-left shadow-lg shadow-red-500/50`}></span>
              </Link>
              <Link
                href="/news"
                className={`relative transition-all duration-300 group px-2 lg:px-3 py-2 rounded-md text-sm lg:text-base ${
                  pathname === "/news"
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {t("News")}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transition-all duration-500 ease-out transform ${
                  pathname === "/news" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                } origin-left shadow-lg shadow-red-500/50`}></span>
              </Link>
              <Link
                href="/public-chat"
                className={`relative transition-all duration-300 group px-2 lg:px-3 py-2 rounded-md text-sm lg:text-base ${
                  pathname === "/public-chat"
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {t("Public Chat")}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transition-all duration-500 ease-out transform ${
                  pathname === "/public-chat" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                } origin-left shadow-lg shadow-red-500/50`}></span>
              </Link>
            </div>

            {/* Date/Time Display */}
            <div className="hidden lg:flex items-center">
              <DateTimeDisplay />
            </div>

            {/* Desktop Auth Buttons - positioned to the right */}
            <div className="hidden md:flex items-center gap-3 md:gap-4 ml-6">
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button size="sm" className="bg-primary hover:bg-primary-dark text-background text-xs md:text-sm">
                      {t("Dashboard")}
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline" onClick={handleLogout} className="text-xs md:text-sm">
                    {t("Logout")}
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button size="sm" variant="outline" className="text-xs md:text-sm">
                      {t("Login")}
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <Button size="sm" className="bg-primary hover:bg-primary-dark text-background text-xs md:text-sm">
                      {t("SignUp")}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
