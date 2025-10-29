"use client"

import { useEffect, useState } from "react"

export default function GradientBackground() {
  const [scrollY, setScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      {/* Technology-themed animated background - only for hero section */}
      <div
        className="absolute top-0 left-0 w-full h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden transition-transform duration-75 ease-out"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        {/* Circuit pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(0, 217, 255, 0.3) 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, rgba(255, 0, 255, 0.3) 2px, transparent 2px),
              linear-gradient(45deg, transparent 46%, rgba(0, 217, 255, 0.1) 49%, rgba(0, 217, 255, 0.1) 51%, transparent 54%),
              linear-gradient(-45deg, transparent 46%, rgba(255, 0, 255, 0.1) 49%, rgba(255, 0, 255, 0.1) 51%, transparent 54%)
            `,
            backgroundSize: "60px 60px, 60px 60px, 40px 40px, 40px 40px",
            backgroundPosition: "0 0, 30px 30px, 0 0, 0 0",
          }}
        />

        {/* Floating tech elements */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-cyan-400/30 rounded-lg rotate-12 animate-float">
          <div className="absolute inset-2 border border-cyan-400/50 rounded"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
        </div>

        <div className="absolute top-40 right-20 w-24 h-24 border border-pink-400/30 rounded-full animate-float-delayed">
          <div className="absolute inset-1 border border-pink-400/50 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
        </div>

        <div className="absolute bottom-32 left-1/4 w-20 h-20 border border-purple-400/30 rotate-45 animate-float-slow">
          <div className="absolute inset-1 border border-purple-400/50 rotate-45"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
        </div>

        {/* Binary code rain effect */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-cyan-400/20 text-xs font-mono animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </div>
          ))}
        </div>

        {/* Glowing particles - reduced for performance */}
        {!isMobile && (
          <>
            <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
            <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-80" style={{ animationDelay: '1s' }}></div>
          </>
        )}

        {/* Data flow lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 1000">
          <defs>
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(0, 217, 255, 0.5)" />
              <stop offset="50%" stopColor="rgba(255, 0, 255, 0.5)" />
              <stop offset="100%" stopColor="rgba(0, 217, 255, 0.5)" />
            </linearGradient>
          </defs>
          <path
            d="M100,200 Q300,100 500,200 T900,200"
            stroke="url(#flowGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M200,400 Q400,300 600,400 T1000,400"
            stroke="url(#flowGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '1s' }}
          />
          <path
            d="M50,600 Q250,500 450,600 T850,600"
            stroke="url(#flowGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '2s' }}
          />
        </svg>
      </div>

      {/* Fade out effect at bottom - more gradual */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
    </div>
  )
}
