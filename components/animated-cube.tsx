"use client"

import { useEffect, useRef, useState } from "react"

export default function AnimatedCube() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [lastMouseX, setLastMouseX] = useState(0)
  const [lastMouseY, setLastMouseY] = useState(0)
  const rotationXRef = useRef(0)
  const rotationYRef = useRef(0)
  const orbitRotationRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth * 1.5
    canvas.height = canvas.offsetHeight * 1.5

    let animationId: number

    const drawCube = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()

      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.scale(0.9, 0.9 * 0.866)

      const size = 150
      const vertices = [
        [-size, -size, -size],
        [size, -size, -size],
        [size, size, -size],
        [-size, size, -size],
        [-size, -size, size],
        [size, -size, size],
        [size, size, size],
        [-size, size, size],
      ]

      const rotated = vertices.map(([x, y, z]) => {
        // Rotate around Y axis (left-right)
        let cosY = Math.cos(rotationYRef.current)
        let sinY = Math.sin(rotationYRef.current)
        let x1 = x * cosY + z * sinY
        let z1 = -x * sinY + z * cosY

        // Rotate around X axis (up-down)
        let cosX = Math.cos(rotationXRef.current)
        let sinX = Math.sin(rotationXRef.current)
        let y1 = y * cosX - z1 * sinX
        let z2 = y * sinX + z1 * cosX

        return [x1, y1, z2]
      })

      ctx.strokeStyle = "#00d9ff"
      ctx.lineWidth = 4
      ctx.shadowColor = "#00d9ff"
      ctx.shadowBlur = 30

      const edges = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 4],
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7],
      ]

      edges.forEach(([a, b]) => {
        ctx.beginPath()
        ctx.moveTo(rotated[a][0], rotated[a][1])
        ctx.lineTo(rotated[b][0], rotated[b][1])
        ctx.stroke()
      })

      ctx.fillStyle = "#ff3366"
      ctx.shadowColor = "#ff3366"
      rotated.forEach(([x, y]) => {
        ctx.beginPath()
        ctx.arc(x, y, 6, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw orbiting icons
      const orbitRadius = 260
      const iconSize = 30
      for (let i = 0; i < 4; i++) {
        const angle = orbitRotationRef.current + (i * Math.PI / 2)
        const x = Math.cos(angle) * orbitRadius
        const y = Math.sin(angle) * orbitRadius

        ctx.fillStyle = "#00d9ff"
        ctx.shadowColor = "#00d9ff"
        ctx.shadowBlur = 10

        // Draw a simple rotating icon (triangle)
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle * 2)
        ctx.beginPath()
        ctx.moveTo(0, -iconSize / 2)
        ctx.lineTo(iconSize / 2, iconSize / 2)
        ctx.lineTo(-iconSize / 2, iconSize / 2)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }

      ctx.restore()

      // Auto-rotate when not dragging
      if (!isDragging) {
        rotationYRef.current += 0.005
        rotationXRef.current += 0.002
      }
      orbitRotationRef.current += 0.02

      animationId = requestAnimationFrame(drawCube)
    }

    drawCube()

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true)
      setLastMouseX(e.clientX)
      setLastMouseY(e.clientY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaX = e.clientX - lastMouseX
      const deltaY = e.clientY - lastMouseY
      rotationYRef.current += deltaX * 0.01
      rotationXRef.current += deltaY * 0.01
      setLastMouseX(e.clientX)
      setLastMouseY(e.clientY)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("mouseleave", handleMouseUp)

    return () => {
      cancelAnimationFrame(animationId)
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("mouseleave", handleMouseUp)
    }
  }, [isDragging, lastMouseX, lastMouseY])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full animate-float cursor-grab active:cursor-grabbing"
      style={{ filter: "drop-shadow(0 0 60px rgba(0, 217, 255, 0.5)) brightness(1.2)" }}
    />
  )
}
