import React from 'react'

type OwnPropertyType = {}

export const LaserBackground: FC<OwnPropertyType> = ({ children }) => (
  <div className="relative min-h-screen w-full overflow-hidden bg-background">
    {/* Animated laser stripes background */}
    <div className="absolute inset-0 pointer-events-none">
      {/* Horizontal laser stripes */}
      <div
        className="absolute top-[15%] left-0 h-[2px] w-full laser-stripe"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--neon-main), transparent)',
          animationDelay: '0s',
        }}
      />
      <div
        className="absolute top-[35%] left-0 h-[1px] w-full laser-stripe"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--neon-main-bright), transparent)',
          animationDelay: '1s',
        }}
      />
      <div
        className="absolute top-[55%] left-0 h-[2px] w-full laser-stripe"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--neon-main), transparent)',
          animationDelay: '2s',
        }}
      />
      <div
        className="absolute top-[75%] left-0 h-[1px] w-full laser-stripe"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--neon-main-dim), transparent)',
          animationDelay: '0.5s',
        }}
      />
      <div
        className="absolute top-[85%] left-0 h-[2px] w-full laser-stripe"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--neon-main-bright), transparent)',
          animationDelay: '1.5s',
        }}
      />

      {/* Moving laser beams */}
      <div
        className="absolute top-[25%] h-[1px] w-[200px] laser-move"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--neon-main-bright), transparent)',
          animationDelay: '0s',
        }}
      />
      <div
        className="absolute top-[65%] h-[2px] w-[150px] laser-move"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--neon-main), transparent)',
          animationDelay: '3s',
          animationDuration: '10s',
        }}
      />

      {/* Vertical accent lines */}
      <div
        className="absolute left-[10%] top-0 w-[1px] h-full laser-stripe"
        style={{
          background:
            'linear-gradient(180deg, transparent, var(--neon-main-dim), transparent)',
          animationDelay: '2.5s',
        }}
      />
      <div
        className="absolute right-[15%] top-0 w-[1px] h-full laser-stripe"
        style={{
          background:
            'linear-gradient(180deg, transparent, var(--neon-main-dim), transparent)',
          animationDelay: '1.8s',
        }}
      />
    </div>

    {/* Grid overlay for cyberpunk aesthetic */}
    <div
      className="absolute inset-0 pointer-events-none opacity-10"
      style={{
        backgroundImage: `
            linear-gradient(var(--neon-main-dim) 1px, transparent 1px),
            linear-gradient(90deg, var(--neon-main-dim) 1px, transparent 1px)
          `,
        backgroundSize: '50px 50px',
      }}
    />

    {/* Main content */}
    <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
      {children}
    </div>
  </div>
)
