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
import AnimatedSection from "@/components/animated-section"
import { motion } from "framer-motion"

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
      <AnimatedSection delay={0.2}>
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-4xl font-bold mb-6 text-foreground"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {t("ReadyToStart")}
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {t("joinThousands")}
            </motion.p>
            <motion.div
              className="flex gap-4 justify-center flex-wrap"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              {user ? (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/dashboard">
                      <Button size="lg" className="bg-primary hover:bg-primary-dark text-background">
                        {t("GoToDashboard")}
                      </Button>
                    </Link>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/auth/sign-up">
                      <Button size="lg" className="bg-primary hover:bg-primary-dark text-background">
                        {t("signup")}
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/auth/login">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary/10 bg-transparent"
                      >
                        {t("login")}
                      </Button>
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* News and Materials Section - Only for logged-in users */}
      {user && (
        <AnimatedSection delay={0.3}>
          <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border relative z-10">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                className="text-3xl font-bold mb-12 text-center text-foreground"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {t("latestUpdates")}
              </motion.h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* News Section */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl font-bold mb-6 text-foreground">📰 {t("latestNews")}</h3>
                  <div className="space-y-4">
                    {[
                      { title: t("techUpdate"), desc: t("techUpdateDesc"), date: "2025-01-20" },
                      { title: t("learningTips"), desc: t("learningTipsDesc"), date: "2025-01-18" },
                      { title: t("innovations"), desc: t("innovationsDesc"), date: "2025-01-15" }
                    ].map((news, index) => (
                      <motion.div
                        key={index}
                        className="p-4 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border hover:border-primary/50 transition-all duration-300"
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 10px 30px rgba(0, 217, 255, 0.1)"
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <h4 className="font-semibold text-foreground mb-2">{news.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{news.desc}</p>
                        <p className="text-xs text-muted-foreground">{news.date}</p>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    className="mt-6"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/news">
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                        {t("viewAllNews")} →
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Materials Section */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl font-bold mb-6 text-foreground">📚 {t("learningMaterials")}</h3>
                  <div className="space-y-4">
                    {[
                      { icon: "💻", title: "RPL Fundamentals", desc: "Dasar-dasar pemrograman untuk pemula.", level: "Beginner • 45 min" },
                      { icon: "🎨", title: "DKV Design Principles", desc: "Prinsip-prinsip desain untuk multimedia.", level: "Intermediate • 60 min" },
                      { icon: "🌐", title: "TKJ Networking Basics", desc: "Konsep dasar jaringan komputer.", level: "Beginner • 30 min" }
                    ].map((material, index) => (
                      <motion.div
                        key={index}
                        className="p-4 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border hover:border-primary/50 transition-all duration-300"
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 10px 30px rgba(0, 217, 255, 0.1)"
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{material.icon}</span>
                          <div>
                            <h4 className="font-semibold text-foreground">{material.title}</h4>
                            <p className="text-xs text-muted-foreground">{material.level}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{material.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    className="mt-6"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/materials">
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                        {t("viewAllMaterials")} →
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Footer */}
      <motion.footer
        className="border-t border-border py-12 px-4 sm:px-6 lg:px-8 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <span className="text-xl font-bold text-primary mb-4" style={{color:'#00d9ffff'}}>Inno</span>
            <span className="text-xl font-bold text-primary mb-4" style={{color:'#ff0000ff'}}>Verse</span>
            <p className="text-muted-foreground">Platform pembelajaran teknologi untuk siswa Indonesia</p>
          </motion.div>
          {[
            { title: t("quickLinks"), links: [t("home"), t("materials"), t("quiz")] },
            { title: t("resources"), links: [t("documentation"), t("blog"), t("support")] },
            { title: t("followUs"), links: [t("twitter"), t("linkedin"), t("github")] }
          ].map((section, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + sectionIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-muted-foreground">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={linkIndex}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <a href="#" className="hover:text-primary transition-colors">
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="border-t border-border mt-8 pt-8 text-center text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <p>&copy; 2025 InnoVerse. {t("allRightsReserved")}</p>
        </motion.div>
      </motion.footer>
    </div>
  )
}
