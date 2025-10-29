"use client"

import { useState, useEffect } from "react"
import AnimatedSection from "@/components/animated-section"
import AnimatedText from "@/components/animated-text"
import { motion } from "framer-motion"

export default function FeaturesSection() {
  const [displayText, setDisplayText] = useState("")
  const texts = [
    "Media belajar kurang interaktif...?",
    "Mari belajar teknologi bersama!",
    "InnoVerse siap membantu Anda."
  ]
  const [isTyping, setIsTyping] = useState(true)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  useEffect(() => {
    let index = 0
    let isDeleting = false
    let isPaused = false

    const timer = setInterval(() => {
      if (isPaused) return // Skip if paused

      const currentFullText = texts[currentTextIndex]

      if (!isDeleting) {
        // Typing phase
        if (index < currentFullText.length) {
          setDisplayText(currentFullText.slice(0, index + 1))
          index++
        } else {
          // Finished typing, pause for 3 seconds before deleting
          isPaused = true
          setTimeout(() => {
            isDeleting = true
            isPaused = false
          }, 3000)
        }
      } else {
        // Deleting phase - slow deletion
        if (index > 0) {
          index--
          setDisplayText(currentFullText.slice(0, index))
        } else {
          // Finished deleting current text, switch to next text
          isPaused = true
          setTimeout(() => {
            setCurrentTextIndex((prev) => (prev + 1) % texts.length)
            isDeleting = false
            isPaused = false
            setIsTyping(true)
          }, 1000) // Short pause before switching texts
        }
      }
    }, isDeleting ? 200 : 100) // Slower deletion (200ms) vs typing (100ms)

    return () => clearInterval(timer)
  }, [currentTextIndex])

  const features = [
    {
      icon: "🎯",
      title: "Vision",
      description:
        "Menjadi platform edukasi teknologi terdepan yang menginspirasi generasi digital untuk berinovasi dan menciptakan solusi kreatif yang mengubah dunia.",
    },
    {
      icon: "🚀",
      title: "Mission",
      description:
        "Menyediakan materi pembelajaran teknologi yang up-to-date dan mudah dipahami. Membuka akses bagi semua kalangan untuk belajar teknologi secara interaktif. Mendorong kolaborasi dan komunitas pembelajar teknologi yang positif.",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Typing Text */}
        <AnimatedSection delay={0.1}>
          <div className="text-center mb-20 -mt-8">
            <AnimatedText
              type="characters"
              staggerChildren={0.05}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2"
            >
              {displayText}
            </AnimatedText>
            {isTyping && <span className="animate-pulse">|</span>}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              About <span className="text-primary" style={{color:'#007bffff'}}>Inno</span>
              <span className="text-primary" style={{color:'#ff0000ff'}}>Verse</span>
            </h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            />
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <AnimatedSection key={index} delay={0.5 + index * 0.2}>
              <motion.div
                className="p-8 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0, 217, 255, 0.1)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <motion.div
                  className="text-4xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
