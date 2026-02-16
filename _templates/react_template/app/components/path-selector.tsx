import { useEffect, useRef, useState } from 'react'
import { Loader } from '@components/loader'

const hexToRgb = (
  value: string,
): { r: number; g: number; b: number } | null => {
  const normalized = value.trim().replace(/^#/, '')

  if (normalized.length !== 3 && normalized.length !== 6) {
    return null
  }

  const hex =
    normalized.length === 3
      ? normalized
          .split('')
          .map(char => char.repeat(2))
          .join('')
      : normalized

  const asNumber = Number.parseInt(hex, 16)

  if (Number.isNaN(asNumber)) {
    return null
  }

  return {
    r: (asNumber >> 16) & 255,
    g: (asNumber >> 8) & 255,
    b: asNumber & 255,
  }
}

interface PathOption {
  id: string
  label: string
  description: string
}

interface PathSelectorProps {
  title?: string
  subtitle?: string
  options: PathOption[]
  onSelect?: (optionId: string) => void
  color?: string
  onClickSelectHandler?: (optionId: string) => void
  selectDelayMs?: number
}

export const PathSelector = ({
  title = 'Куда двигаться дальше?',
  subtitle = 'Выбери направление, которое поможет тебе понять тему глубже.',
  options,
  onSelect,
  color = '#ff6b35',
  onClickSelectHandler,
  selectDelayMs = 200,
}: PathSelectorProps) => {
  const accentRgb = hexToRgb(color)
  const accentRgba = (opacity: number) =>
    accentRgb
      ? `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, ${opacity})`
      : color

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [isRevealing, setIsRevealing] = useState(false)
  const pendingCallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSelect = (id: string) => {
    if (selectedId) {
      return
    }

    setSelectedId(id)
    setIsRevealing(true)
    onSelect?.(id)

    if (pendingCallbackRef.current) {
      clearTimeout(pendingCallbackRef.current)
      pendingCallbackRef.current = null
    }

    if (onClickSelectHandler) {
      pendingCallbackRef.current = setTimeout(() => {
        onClickSelectHandler(id)
        pendingCallbackRef.current = null
      }, selectDelayMs)
    }
  }

  useEffect(
    () => () => {
      if (pendingCallbackRef.current) {
        clearTimeout(pendingCallbackRef.current)
      }
    },
    [],
  )

  return (
    <div
      className={`relative w-full max-w-[800px] mx-auto px-8 py-14  min-h-screen flex flex-col items-center justify-center gap-[60px] overflow-hidden ${isRevealing ? 'path-selector--revealing' : ''}`}>
      {/* Частицы в фоне */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        aria-hidden="true">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="path-selector__header">
        {/* Куб Метатрона с пульсацией */}
        <div className="logo-container">
          <div className="path-selector__logo">
            <Loader duration={1} color={color} />
          </div>

          <div className="logo-rings" style={{ borderColor: color }} />
        </div>

        <h2
          className="m-0 text-[2.5rem] leading-[1.1] font-semibold text-white max-md:text-[2rem]"
          style={{ textShadow: `0 0 30px ${accentRgba(0.3)}` }}>
          {title}
        </h2>
        <p className="m-0 text-[1.1rem] text-[#999] max-w-[600px]">
          {subtitle}
        </p>
      </div>

      <div className="path-selector__grid">
        {options.map((option, index) => {
          const isSelected = selectedId === option.id
          const isMuted = Boolean(selectedId) && !isSelected
          const isHovered = hoveredId === option.id

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option.id)}
              onMouseEnter={() => setHoveredId(option.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`relative block w-full p-10 px-[30px] border rounded-xl bg-[rgba(15,15,15,0.8)] backdrop-blur-[10px] text-left transition-all duration-[400ms] cursor-pointer text-white overflow-hidden path-card${isSelected ? ' path-card--selected' : ''}${
                isMuted ? ' path-card--muted' : ''
              }${!selectedId && isHovered ? ' path-card--hovered' : ''}`}
              disabled={Boolean(selectedId)}
              style={{
                borderColor: isSelected || isHovered ? color : '#333',
                animationDelay: `${index * 0.1}s`,
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              }}>
              {/* Энергетические линии при ховере */}
              <div
                className="path-card__energy"
                style={{ background: color }}
              />

              {/* Угловые маркеры */}
              <div className="path-card__corners" style={{ color: color }}>
                <span className="corner corner--tl" />
                <span className="corner corner--tr" />
                <span className="corner corner--bl" />
                <span className="corner corner--br" />
              </div>

              {/* Гекс-паттерн фон */}
              {(isHovered || isSelected) && (
                <svg
                  className="hex-pattern"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none">
                  <defs>
                    <pattern
                      id={`hex-${option.id}`}
                      width="20"
                      height="17.32"
                      patternUnits="userSpaceOnUse">
                      <path
                        d="M10 0 L15 8.66 L10 17.32 L5 8.66 Z"
                        fill="none"
                        stroke={color}
                        strokeOpacity="0.15"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect
                    width="100%"
                    height="100%"
                    fill={`url(#hex-${option.id})`}
                  />
                </svg>
              )}

              <div className="relative z-[2]">
                <h3
                  className="m-0 mb-3 text-[1.4rem] font-semibold transition-all duration-300 path-card__label"
                  style={{ color: isSelected ? color : '#fff' }}>
                  {option.label}
                </h3>
                <p className="m-0 text-[0.95rem] leading-[1.5] text-[#888] transition-colors duration-300 path-card__description">
                  {option.description}
                </p>
              </div>

              {/* Индикатор выбора */}
              {isSelected && (
                <div
                  className="path-card__checkmark"
                  style={{ borderColor: color, color }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8L6.5 11.5L13 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {selectedId && (
        <div
          className="mt-5 px-10 py-1 border-2 rounded-[50px] text-[1.1rem] font-semibold text-center flex items-center gap-3 justify-center path-selector__confirmation"
          style={{
            borderColor: color,
            background: accentRgba(0.1),
            color,
            boxShadow: `0 10px 40px ${accentRgba(0.3)}`,
          }}>
          Принять
        </div>
      )}

      <style>{`
        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: ${color};
          border-radius: 50%;
          opacity: 0;
          animation: particleFloat linear infinite;
        }

        @keyframes particleFloat {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0);
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-100vh) scale(1.5);
          }
        }

        /* Логотип */
        .path-selector__header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
          text-align: center;
          animation: fadeInDown 0.8s ease;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .logo-container {
          position: relative;
          animation: logoFloat 4s ease-in-out infinite;
        }

        @keyframes logoFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .path-selector__logo {
          width: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 280px;
          filter: drop-shadow(0 0 20px ${accentRgba(0.3)});
          animation: logoPulse 3s ease-in-out infinite;
        }

        @keyframes logoPulse {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }

        .logo-rings {
          position: absolute;
          inset: -20px;
          border: 1px solid;
          border-radius: 50%;
          opacity: 0.3;
          animation: ringExpand 3s ease-in-out infinite;
        }

        @keyframes ringExpand {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.1;
          }
        }

        /* Сетка карточек */
        .path-selector__grid {
          display: grid;
          gap: 20px;
          width: 100%;
          animation: fadeInUp 0.8s ease 0.2s backwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (min-width: 768px) {
          .path-selector__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Карточки */
        .path-card {
          animation: cardAppear 0.6s ease backwards;
        }

        @keyframes cardAppear {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .path-card:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px ${color};
        }

        .path-card:disabled {
          cursor: default;
        }

        .path-card--hovered {
          transform: translateY(-6px) scale(1.02);
          border-color: ${color};
          box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.5),
            0 0 30px ${accentRgba(0.3)};
        }

        .path-card--muted {
          opacity: 0.3;
          filter: grayscale(0.5);
          transform: scale(0.95);
        }

        .path-card--selected {
          transform: scale(1.05);
          border-color: ${color};
          background: radial-gradient(
            circle at 50% 50%,
            ${accentRgba(0.15)},
            rgba(15, 15, 15, 0.9)
          );
          box-shadow:
            0 30px 60px rgba(0, 0, 0, 0.6),
            0 0 40px ${accentRgba(0.5)},
            inset 0 0 60px ${accentRgba(0.1)};
          animation: selectedPulse 2s ease-in-out infinite;
        }

        @keyframes selectedPulse {
          0%,
          100% {
            box-shadow:
              0 30px 60px rgba(0, 0, 0, 0.6),
              0 0 40px ${accentRgba(0.5)},
              inset 0 0 60px ${accentRgba(0.1)};
          }
          50% {
            box-shadow:
              0 30px 60px rgba(0, 0, 0, 0.6),
              0 0 50px ${accentRgba(0.7)},
              inset 0 0 80px ${accentRgba(0.15)};
          }
        }

        /* Энергетические линии */
        .path-card__energy {
          position: absolute;
          inset: -2px;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .path-card--hovered .path-card__energy {
          opacity: 0.15;
          animation: energyPulse 1.5s ease-in-out infinite;
        }

        .path-card--selected .path-card__energy {
          opacity: 0.2;
          animation: energyPulse 1s ease-in-out infinite;
        }

        @keyframes energyPulse {
          0%,
          100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.25;
          }
        }

        /* Угловые маркеры */
        .path-card__corners {
          position: absolute;
          inset: 8px;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .path-card--hovered .path-card__corners,
        .path-card--selected .path-card__corners {
          opacity: 1;
        }

        .corner {
          position: absolute;
          width: 12px;
          height: 12px;
          border: 2px solid currentColor;
        }

        .corner--tl {
          top: 0;
          left: 0;
          border-right: none;
          border-bottom: none;
        }

        .corner--tr {
          top: 0;
          right: 0;
          border-left: none;
          border-bottom: none;
        }

        .corner--bl {
          bottom: 0;
          left: 0;
          border-right: none;
          border-top: none;
        }

        .corner--br {
          bottom: 0;
          right: 0;
          border-left: none;
          border-top: none;
        }

        /* Гекс-паттерн */
        .hex-pattern {
          position: absolute;
          inset: 0;
          opacity: 0;
          animation: hexFadeIn 0.6s ease forwards;
          pointer-events: none;
        }

        @keyframes hexFadeIn {
          to {
            opacity: 1;
          }
        }

        /* Контент карточки */
        .path-card--selected .path-card__label {
          text-shadow: 0 0 20px ${accentRgba(0.6)};
        }

        .path-card--selected .path-card__description {
          color: #aaa;
        }

        /* Чекмарк */
        .path-card__checkmark {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          border: 2px solid;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
          animation: checkmarkAppear 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          z-index: 3;
        }

        @keyframes checkmarkAppear {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        /* Подтверждение */
        .path-selector__confirmation {
          opacity: 0;
          transform: translateY(20px) scale(0.9);
          animation: confirmationAppear 0.6s
            cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s forwards;
        }

        @keyframes confirmationAppear {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

   


        /* Revealing эффект */
        .path-selector--revealing {
          animation: revealing 0.8s ease;
        }

        @keyframes revealing {
          0% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.3);
          }
          100% {
            filter: brightness(1);
          }
        }

        @media (max-width: 768px) {
          .path-card {
            padding: 30px 24px;
          }
        }
      `}</style>
    </div>
  )
}
