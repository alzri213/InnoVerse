"use client"

import { useEffect, useState } from "react"

interface Star {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  trail: number[]
}

export default function StarfallBackground() {
  const [stars, setStars] = useState<Star[]>([])
  const [scrollY, setScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [mounted])

  useEffect(() => {
    if (!mounted) return

    const createStars = () => {
      const newStars: Star[] = []
      const numStars = isMobile ? 10 : 20 // Reduced from 50 to 20 on desktop, 10 on mobile
      for (let i = 0; i < numStars; i++) {
        newStars.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight - 100,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 2 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          trail: []
        })
      }
      setStars(newStars)
    }

    createStars()

    const animateStars = () => {
      setStars(prevStars =>
        prevStars.map(star => {
          let newY = star.y + star.speed
          let newTrail = [...star.trail, star.y]

          // Reset star when it goes off screen
          if (newY > window.innerHeight + 100) {
            newY = -100
            newTrail = []
          }

          // Keep trail length limited
          if (newTrail.length > 10) {
            newTrail = newTrail.slice(-10)
          }

          return {
            ...star,
            y: newY,
            trail: newTrail
          }
        })
      )
    }

    const interval = setInterval(animateStars, 50)
    return () => clearInterval(interval)
  }, [mounted, isMobile])

  // Calculate opacity based on scroll position (fade out after 800px)
  const opacity = Math.max(0, 1 - scrollY / 800)

  if (!mounted) {
    return null
  }

  return (
    <div
      className="fixed top-0 left-0 w-full h-screen pointer-events-none overflow-hidden"
      style={{
        opacity,
        zIndex: 1,
      }}
    >
      {stars.map(star => (
        <div key={star.id}>
          {/* Star trail */}
          {star.trail.map((trailY, index) => (
            <div
              key={`${star.id}-trail-${index}`}
              className="absolute rounded-full bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-600"
              style={{
                left: star.x,
                top: trailY,
                width: star.size * (0.3 + index * 0.1),
                height: star.size * (0.3 + index * 0.1),
                opacity: (star.opacity * (index + 1)) / star.trail.length * 0.6,
                filter: 'blur(0.5px)',
              }}
            />
          ))}

          {/* Main star */}
          <div
            className="absolute rounded-full bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-500 shadow-lg"
            style={{
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              boxShadow: `0 0 ${star.size * 2}px rgba(0, 217, 255, 0.6), 0 0 ${star.size * 4}px rgba(0, 217, 255, 0.3)`,
            }}
          />

          {/* Star glow effect */}
          <div
            className="absolute rounded-full bg-cyan-400"
            style={{
              left: star.x - star.size,
              top: star.y - star.size,
              width: star.size * 3,
              height: star.size * 3,
              opacity: star.opacity * 0.1,
              filter: 'blur(8px)',
            }}
          />
        </div>
      ))}

      {/* Additional ambient particles - reduced for performance */}
      {!isMobile && Array.from({ length: 10 }, (_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute rounded-full bg-gradient-to-r from-cyan-200 to-purple-300 animate-pulse"
          style={{
            left: Math.random() * window.innerWidth,
            top: Math.random() * window.innerHeight,
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            opacity: Math.random() * 0.3 + 0.1,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 4 + 2}s`,
          }}
        />
      ))}
    </div>
  )
}
