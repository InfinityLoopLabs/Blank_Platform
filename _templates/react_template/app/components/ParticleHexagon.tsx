'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  angle: number
}

interface ParticleHexagonProps {
  pulseTime?: number // Time in seconds when pulsation should occur
  size?: number // Size of the hexagon
  particleCount?: number // Number of particles to emit per frame
  color?: string // Color in hex format (e.g., "#00c8ff")
  className?: string
}

export function ParticleHexagon({
  pulseTime = 3,
  size = 150,
  particleCount = 3,
  color = '',
  className = '',
}: ParticleHexagonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const startTimeRef = useRef<number>(Date.now())

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : { r: 0,
g: 200,
b: 255 }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const rgb = hexToRgb(color)

    const drawHexagon = (pulse: number) => {
      const hexSize = size + pulse * 20
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.beginPath()

      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i
        const x = hexSize * Math.cos(angle)
        const y = hexSize * Math.sin(angle)
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.closePath()

      ctx.shadowBlur = 20 + pulse * 30
      ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.8 + pulse * 0.2})`
      ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.9 + pulse * 0.1})`
      ctx.lineWidth = 3 + pulse * 2
      ctx.stroke()

      ctx.shadowBlur = 40 + pulse * 40
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.1 + pulse * 0.2})`
      ctx.fill()

      ctx.restore()
    }

    const createParticle = (pulseStrength: number) => {
      const angle = Math.random() * Math.PI * 2
      const speed = 1 + Math.random() * 2 + pulseStrength * 3
      const hexAngle = Math.floor(Math.random() * 6) * (Math.PI / 3)
      const hexX = size * Math.cos(hexAngle)
      const hexY = size * Math.sin(hexAngle)

      return {
        x: centerX + hexX,
        y: centerY + hexY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 60 + Math.random() * 60,
        size: 2 + Math.random() * 3,
        angle: hexAngle,
      }
    }

    const animate = () => {
      const currentTime = (Date.now() - startTimeRef.current) / 1000
      const timeDiff = Math.abs(currentTime - pulseTime)
      const pulseStrength = timeDiff < 0.5 ? Math.max(0, 1 - timeDiff * 2) : 0

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      drawHexagon(pulseStrength)

      const particlesToCreate = particleCount + Math.floor(pulseStrength * 10)
      for (let i = 0; i < particlesToCreate; i++) {
        particlesRef.current.push(createParticle(pulseStrength))
      }

      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life++

        const alpha = 1 - particle.life / particle.maxLife
        if (alpha <= 0) {
          return false
        }

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.shadowBlur = 10
        ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        ctx.save()
        ctx.globalAlpha = alpha * 0.3
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(particle.x, particle.y)
        ctx.lineTo(particle.x - particle.vx * 3, particle.y - particle.vy * 3)
        ctx.stroke()
        ctx.restore()

        return true
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    startTimeRef.current = Date.now()
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [pulseTime, size, particleCount, color])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={800}
      className={`${className}`}
    />
  )
}
