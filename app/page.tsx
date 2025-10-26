"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import NavigationWrapper from "@/components/navigation-wrapper"
import GradientBackground from "@/components/gradient-background"
import TechBackground from "@/components/tech-background"
import StarfallBackground from "@/components/starfall-background"
import LoadingScreen from "@/components/loading-screen"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/hooks/useLanguage"
import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"

export default function Home() {
  const { user, loading } = useAuth()
  const { t } = useTranslation()
  const [showLoading, setShowLoading] = useState(true)

  const handleLoadingComplete = () => {
    setShowLoading(false)
  }

  if (loading || showLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  return (
    <div className="min-h-screen bg-background relative">
      <TechBackground />
      <StarfallBackground />
      <GradientBackground />
      <NavigationWrapper />
      <HeroSection />
      <FeaturesSection />

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-foreground">{t("ReadyToStart")}</h2>
          <p className="text-lg text-muted-foreground mb-8">{t("joinThousands")}</p>
          <div className="flex gap-4 justify-center flex-wrap">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button size="lg" className="bg-primary hover:bg-primary-dark text-background">
                    {t("GoToDashboard")}
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/sign-up">
                  <Button size="lg" className="bg-primary hover:bg-primary-dark text-background">
                    {t("signup")}
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10 bg-transparent"
                  >
                    {t("login")}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* News and Materials Section - Only for logged-in users */}
      {user && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border relative z-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">{t("latestUpdates")}</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* News Section */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-foreground">📰 {t("latestNews")}</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border hover:border-primary/50 transition-all duration-300">
                    <h4 className="font-semibold text-foreground mb-2">{t("techUpdate")}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{t("techUpdateDesc")}</p>
                    <p className="text-xs text-muted-foreground">2025-01-20</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border hover:border-primary/50 transition-all duration-300">
                    <h4 className="font-semibold text-foreground mb-2">{t("learningTips")}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{t("learningTipsDesc")}</p>
                    <p className="text-xs text-muted-foreground">2025-01-18</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border hover:border-primary/50 transition-all duration-300">
                    <h4 className="font-semibold text-foreground mb-2">{t("innovations")}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{t("innovationsDesc")}</p>
                    <p className="text-xs text-muted-foreground">2025-01-15</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/news">
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                      {t("viewAllNews")} →
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Materials Section */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-foreground">📚 {t("learningMaterials")}</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border hover:border-primary/50 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">💻</span>
                      <div>
                        <h4 className="font-semibold text-foreground">RPL Fundamentals</h4>
                        <p className="text-xs text-muted-foreground">Beginner • 45 min</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Dasar-dasar pemrograman untuk pemula.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border hover:border-primary/50 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🎨</span>
                      <div>
                        <h4 className="font-semibold text-foreground">DKV Design Principles</h4>
                        <p className="text-xs text-muted-foreground">Intermediate • 60 min</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Prinsip-prinsip desain untuk multimedia.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border hover:border-primary/50 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🌐</span>
                      <div>
                        <h4 className="font-semibold text-foreground">TKJ Networking Basics</h4>
                        <p className="text-xs text-muted-foreground">Beginner • 30 min</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Konsep dasar jaringan komputer.</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/materials">
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                      {t("viewAllMaterials")} →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-xl font-bold text-primary mb-4" style={{color:'#00d9ffff'}}>Inno</span>
            <span className="text-xl font-bold text-primary mb-4" style={{color:'#ff0000ff'}}>Verse</span>
            <p className="text-muted-foreground">Platform pembelajaran teknologi untuk siswa Indonesia</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("quickLinks")}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link href="/materials" className="hover:text-primary">
                  {t("materials")}
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="hover:text-primary">
                  {t("quiz")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("resources")}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary">
                  {t("documentation")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  {t("blog")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  {t("support")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("followUs")}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary">
                  {t("twitter")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  {t("linkedin")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  {t("github")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 InnoVerse. {t("allRightsReserved")}</p>
        </div>
      </footer>
    </div>
  )
}