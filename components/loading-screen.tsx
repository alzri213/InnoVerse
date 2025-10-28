"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

interface LoadingScreenProps {
  onComplete: () => void
}

interface ClickParticle {
  id: number
  x: number
  y: number
  createdAt: number
  color: string
  size: number
  velocity: { x: number; y: number }
}

interface FallingStar {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  trail: { x: number; y: number }[]
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const [clickParticles, setClickParticles] = useState<ClickParticle[]>([])
  const [fallingStars, setFallingStars] = useState<FallingStar[]>([])
  const [particleId, setParticleId] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)

  // Generate falling stars
  useEffect(() => {
    const createFallingStars = () => {
      const stars: FallingStar[] = []
      const numStars = Math.floor(Math.random() * 6) + 8 // 8-13 stars

      for (let i = 0; i < numStars; i++) {
        const speed = Math.random() * 4 + 0.3 // Speed between 0.3-4.3 (even more variation)
        stars.push({
          id: i,
          x: Math.random() * window.innerWidth * 0.5, // Start from left 50%
          y: Math.random() * window.innerHeight * 0.5, // Start from top 50%
          size: Math.random() * 8 + 6, // Even larger size: 6-14px
          speed: speed,
          opacity: Math.random() * 0.3 + 0.7, // Even higher opacity: 0.7-1.0
          trail: []
        })
      }
      setFallingStars(stars)
    }

    createFallingStars()

    // Animate falling stars
    const animateStars = () => {
      setFallingStars(prev => prev.map(star => {
        const newX = star.x + star.speed * 3 // Move diagonally right (even faster)
        const newY = star.y + star.speed * 2.5 // Move diagonally down (even faster)

        // Reset star when it goes off screen
        let resetStar = false
        if (newX > window.innerWidth + 100 || newY > window.innerHeight + 100) {
          resetStar = true
        }

        if (resetStar) {
          return {
            ...star,
            x: Math.random() * window.innerWidth * 0.5,
            y: Math.random() * window.innerHeight * 0.5,
            trail: []
          }
        }

        // Update trail
        const newTrail = [...star.trail, { x: star.x, y: star.y }]
        if (newTrail.length > 20) newTrail.shift() // Keep only last 20 positions for even longer trails

        return {
          ...star,
          x: newX,
          y: newY,
          trail: newTrail
        }
      }))
    }

    const starInterval = setInterval(animateStars, 30) // Even faster animation
    return () => clearInterval(starInterval)
  }, [])

  // Handle click particles
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now()
    const cooldown = 500 // Longer cooldown to prevent spamming and reduce lag

    if (now - lastClickTime < cooldown) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const colors = ['#00ffff', '#ff00ff', '#ffff00', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7']
    const numParticles = Math.floor(Math.random() * 3) + 2 // Create only 2-4 particles per click (reduced)

    const newParticles: ClickParticle[] = []
    for (let i = 0; i < numParticles; i++) {
      const newParticle: ClickParticle = {
        id: particleId + i,
        x: x + (Math.random() - 0.5) * 30, // Smaller spread area
        y: y + (Math.random() - 0.5) * 30,
        createdAt: now,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4, // Smaller particles (4-12px)
        velocity: {
          x: (Math.random() - 0.5) * 4, // Slower movement
          y: (Math.random() - 0.5) * 4
        }
      }
      newParticles.push(newParticle)
    }

    setClickParticles(prev => [...prev, ...newParticles])
    setParticleId(prev => prev + numParticles)
    setLastClickTime(now)

    // Remove particles after shorter duration for better performance
    newParticles.forEach(particle => {
      setTimeout(() => {
        setClickParticles(prev => prev.filter(p => p.id !== particle.id))
      }, 1500) // Shorter duration (1.5s instead of 3s)
    })
  }

  useEffect(() => {
    // Fade in after component mounts
    const fadeInTimer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    // Progress animation with smoother progression
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        const increment = Math.random() * 8 + 2 // More consistent progress
        return Math.min(prev + increment, 100)
      })
    }, 150)

    // Start fade out after 5 seconds
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false)
    }, 5000)

    // Complete after 6 seconds total
    const completeTimer = setTimeout(() => {
      onComplete()
    }, 6000)

    return () => {
      clearTimeout(fadeInTimer)
      clearInterval(progressTimer)
      clearTimeout(fadeOutTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-1000 cursor-pointer overflow-hidden ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
      }`}
      onClick={handleClick}
    >
      {/* Falling stars background */}
      <div className="absolute inset-0 pointer-events-none">
        {fallingStars.map((star) => (
          <div key={star.id}>
            {/* Star trail */}
            {star.trail.map((trailPoint, index) => (
              <div
                key={`trail-${index}`}
                className="absolute rounded-full"
                style={{
                  left: `${trailPoint.x}px`,
                  top: `${trailPoint.y}px`,
                  width: `${star.size * (1 - index * 0.1)}px`,
                  height: `${star.size * (1 - index * 0.1)}px`,
                  backgroundColor: '#ffffff',
                  opacity: star.opacity * (1 - index * 0.1) * 0.3,
                  boxShadow: `0 0 ${star.size * 2}px #ffffff`,
                }}
              />
            ))}
            {/* Main star */}
            <div
              className="absolute rounded-full animate-pulse"
              style={{
                left: `${star.x}px`,
                top: `${star.y}px`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: '#ffffff',
                opacity: star.opacity,
                boxShadow: `0 0 ${star.size * 6}px #ffffff, 0 0 ${star.size * 12}px #ffffff80, 0 0 ${star.size * 18}px #ffffff40`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Central loading content */}
      <div className="text-center relative z-10">
        {/* Logo/Brand with enhanced glow and 3D animation */}
        <div className="mb-8 md:mb-12 relative" style={{ perspective: '1000px' }}>
          <div className="text-6xl md:text-8xl lg:text-9xl font-bold mb-4 relative animate-3d-rotate">
            <span className="text-blue-300 drop-shadow-2xl animate-pulse-glow-blue">Inno</span>
            <span className="text-red-300 drop-shadow-2xl animate-pulse-glow-red">Verse</span>
          </div>
          {/* Logo glow effect */}
          <div className="absolute inset-0 text-6xl md:text-8xl lg:text-9xl font-bold blur-xl opacity-50 animate-3d-rotate-delayed">
            <span className="text-blue-400">Inno</span>
            <span className="text-red-400">Verse</span>
          </div>
          {/* Additional glow layers */}
          <div className="absolute inset-0 text-6xl md:text-8xl lg:text-9xl font-bold blur-2xl opacity-30 animate-3d-rotate-reverse">
            <span className="text-blue-500">Inno</span>
            <span className="text-red-500">Verse</span>
          </div>
        </div>

        {/* Enhanced loading animation */}
        <div className="relative mb-8">
          {/* Multiple rotating rings with different speeds */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 border-4 border-cyan-400/30 rounded-full animate-spin-slow mx-auto relative">
            <div className="absolute inset-2 border-3 border-pink-400/40 rounded-full animate-spin-reverse-slow"></div>
            <div className="absolute inset-4 border-2 border-purple-400/50 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-6 border-2 border-yellow-400/40 rounded-full animate-spin-reverse-slow"></div>

            {/* Center pulsing core with multiple layers */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 rounded-full animate-pulse-luxury shadow-lg shadow-cyan-400/50"></div>
              <div className="absolute w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border-2 border-cyan-400/30 rounded-full animate-ping-luxury"></div>
              <div className="absolute w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 border border-pink-400/20 rounded-full animate-ping-luxury" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>

          {/* Enhanced orbiting elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 sm:-translate-y-5 md:-translate-y-6 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-cyan-400 rounded-full animate-orbit-loading shadow-lg shadow-cyan-400/60"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4 sm:translate-y-5 md:translate-y-6 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3 md:h-3 bg-pink-400 rounded-full animate-orbit-loading-reverse shadow-lg shadow-pink-400/60"></div>
            <div className="absolute left-0 top-1/2 transform -translate-x-4 sm:-translate-x-5 md:-translate-x-6 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-3.5 md:h-3.5 bg-purple-400 rounded-full animate-orbit-loading-slow shadow-lg shadow-purple-400/60"></div>
            <div className="absolute right-0 top-1/2 transform translate-x-4 sm:translate-x-5 md:translate-x-6 -translate-y-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-2.5 md:h-2.5 bg-yellow-400 rounded-full animate-orbit-loading-reverse-slow shadow-lg shadow-yellow-400/60"></div>
            {/* Additional orbiting elements */}
            <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-orbit-loading-fast shadow-lg shadow-blue-400/60"></div>
            <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-orbit-loading-reverse-fast shadow-lg shadow-green-400/60"></div>
          </div>
        </div>

        {/* Enhanced progress bar */}
        <div className="w-full max-w-96 mx-auto mb-6 px-4">
          <div className="h-4 bg-gray-700/50 border-2 border-blue-400/30 rounded-full overflow-hidden shadow-2xl backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-blue-400 via-red-400 via-purple-400 to-yellow-400 rounded-full transition-all duration-500 ease-out animate-shimmer shadow-inner relative"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              {/* Progress bar glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-slow rounded-full"></div>
            </div>
          </div>
          <div className="text-center mt-4 text-blue-300 text-lg sm:text-xl font-bold drop-shadow-lg animate-pulse-glow-blue">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Enhanced loading text */}
        <div className="text-blue-300/80 text-base sm:text-lg font-medium drop-shadow-lg animate-pulse-glow-blue px-4">
          {t("loading.initializing")}
        </div>
        <div className="text-sm text-red-300/60 mt-2 animate-pulse-glow-red px-4">
          {t("loading.preparing")}
        </div>
      </div>

      {/* Optimized click particles */}
      <div className="absolute inset-0 pointer-events-none">
        {clickParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: 'click-particle-simple 1.5s ease-out forwards',
            }}
          >
            {/* Simple main particle */}
            <div
              className="rounded-full animate-pulse"
              style={{
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}60`,
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Subtle vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20 pointer-events-none"></div>
    </div>
  )
}
