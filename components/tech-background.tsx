"use client"

import { useEffect, useState } from "react"

export default function TechBackground() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Calculate opacity based on scroll position (fade out after 600px)
  const opacity = Math.max(0, 1 - scrollY / 600)

  return (
    <div
      className="fixed top-0 left-0 w-full h-screen pointer-events-none overflow-hidden"
      style={{
        opacity,
        zIndex: 0,
      }}
    >
      {/* Main gradient background with animated mesh - brighter and more vibrant */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 animate-gradient-shift opacity-40 dark:opacity-30" />

      {/* Enhanced animated circuit pattern overlay - brighter and more visible */}
      <div
        className="absolute inset-0 opacity-20 dark:opacity-15 animate-circuit-pulse"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.6) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.6) 2px, transparent 2px),
            linear-gradient(45deg, transparent 46%, rgba(59, 130, 246, 0.25) 49%, rgba(59, 130, 246, 0.25) 51%, transparent 54%),
            linear-gradient(-45deg, transparent 46%, rgba(147, 51, 234, 0.25) 49%, rgba(147, 51, 234, 0.25) 51%, transparent 54%)
          `,
          backgroundSize: "50px 50px, 50px 50px, 35px 35px, 35px 35px",
          backgroundPosition: "0 0, 25px 25px, 0 0, 0 0",
        }}
      />

      {/* Additional geometric patterns for more visual interest */}
      <div
        className="absolute inset-0 opacity-10 dark:opacity-8 animate-circuit-pulse"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, transparent 48%, rgba(16, 185, 129, 0.15) 50%, rgba(16, 185, 129, 0.15) 52%, transparent 54%),
            linear-gradient(0deg, transparent 48%, rgba(245, 158, 11, 0.15) 50%, rgba(245, 158, 11, 0.15) 52%, transparent 54%)
          `,
          backgroundSize: "80px 80px, 60px 60px, 60px 60px",
          backgroundPosition: "0 0, 0 0, 30px 30px",
          animationDelay: '1s',
        }}
      />

      {/* Light mode enhancements */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-50/20 via-transparent to-cyan-50/10 dark:from-transparent dark:via-transparent dark:to-transparent"></div>

      {/* Dark mode subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/5 dark:from-slate-950/10 dark:via-transparent dark:to-slate-950/20"></div>
    </div>
  )
}
