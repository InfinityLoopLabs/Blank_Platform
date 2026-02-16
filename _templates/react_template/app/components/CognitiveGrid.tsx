import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Flex } from '@infinityloop.labs/ui-kit'
import { useClickOutside } from '@infinityloop.labs/utils'

type OwnPropertyType = {
  isOpen: boolean
  onCloseHandler: VoidFunction
}

export const CognitiveGrid: FC<OwnPropertyType> = ({
  isOpen,
  onCloseHandler,
}) => {
  const [activeCell, setActiveCell] = useState(null)
  const [progress, setProgress] = useState([85, 72, 91, 68, 45, 78, 33, 95, 60])
  const [scanLine, setScanLine] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useClickOutside(containerRef, () => {
    if (isOpen) {
      onCloseHandler()
    }
  })
  // Scan line animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100)
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // Slowly increment random progress values
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev =>
        prev.map(p => {
          if (Math.random() > 0.7 && p < 100) {
            return Math.min(100, p + 1)
          }

          return p
        }),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const modules = [
    {
      id: 1,
      name: 'STRUCT-01',
      type: 'База знаний',
      status: 'active',
    },
    {
      id: 2,
      name: 'ACCUM-02',
      type: 'Накопление',
      status: 'active',
    },
    {
      id: 3,
      name: 'CHAIN-03',
      type: 'Связи',
      status: 'complete',
    },
    {
      id: 4,
      name: 'TRACK-04',
      type: 'Прогресс',
      status: 'active',
    },
    {
      id: 5,
      name: 'CORE-05',
      type: 'Ядро системы',
      status: 'locked',
    },
    {
      id: 6,
      name: 'COLL-06',
      type: 'Коллекция',
      status: 'active',
    },
    {
      id: 7,
      name: 'META-07',
      type: 'Мета-слой',
      status: 'locked',
    },
    {
      id: 8,
      name: 'EVOL-08',
      type: 'Эволюция',
      status: 'complete',
    },
    {
      id: 9,
      name: 'ARCH-09',
      type: 'Архитектура',
      status: 'active',
    },
  ]

  return (
    <Flex
      column
      className="min-h-screen bg-black flex items-center justify-center p-8">
      <div ref={containerRef} className="relative">
        {/* Outer frame with glow */}
        <div
          className="relative p-1 rounded-sm"
          style={{
            background:
              'linear-gradient(135deg, #ff6100 0%, #ff6100 50%, #331a00 100%)',
            boxShadow:
              '0 0 40px rgba(255, 97, 0, 0.3), inset 0 0 60px rgba(255, 97, 0, 0.1)',
          }}>
          {/* Inner container */}
          <div
            className="relative bg-black p-4 rounded-sm overflow-hidden"
            style={{
              background:
                'linear-gradient(180deg, #0a0500 0%, #000000 50%, #0a0500 100%)',
            }}>
            {/* Scan line effect */}
            <div
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent pointer-events-none z-20"
              style={{
                top: `${scanLine}%`,
                opacity: 0.6,
              }}
            />

            {/* CRT overlay effect */}
            <div
              className="absolute inset-0 pointer-events-none z-10 opacity-10"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,97,0,0.03) 2px, rgba(255,97,0,0.03) 4px)',
              }}
            />

            {/* Header */}
            <div className="flex justify-between items-center mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-orange-500 text-xs font-mono tracking-wider">
                  COGNITIVE PROFILE: ARCHITECT + COLLECTOR
                </span>
              </div>
              <div className="text-orange-500/60 text-xs font-mono">
                SYS.v2.4.1
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-1">
              {modules.map((module, index) => (
                <div
                  key={module.id}
                  onClick={() =>
                    // @ts-ignore
                    setActiveCell(activeCell === index ? null : index)
                  }
                  className={`
                    relative aspect-square cursor-pointer transition-all duration-300
                    border rounded-sm overflow-hidden
                    ${
                      activeCell === index
                        ? 'border-orange-500 z-10'
                        : 'border-orange-500/30 hover:border-orange-500/60'
                    }
                    ${module.status === 'complete' ? 'bg-orange-500/10' : 'bg-black'}
                    ${module.status === 'locked' ? 'opacity-50' : ''}
                  `}
                  style={{
                    boxShadow:
                      activeCell === index
                        ? '0 0 20px rgba(255, 97, 0, 0.4), inset 0 0 30px rgba(255, 97, 0, 0.1)'
                        : 'inset 0 0 20px rgba(255, 97, 0, 0.05)',
                  }}>
                  {/* Grid lines inside cell */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-2 border border-orange-500/20 rounded-sm" />
                    <div className="absolute top-1/2 left-2 right-2 h-px bg-orange-500/10" />
                    <div className="absolute left-1/2 top-2 bottom-2 w-px bg-orange-500/10" />
                  </div>

                  {/* Corner markers */}
                  <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-orange-500/50" />
                  <div className="absolute top-1 right-1 w-2 h-2 border-r border-t border-orange-500/50" />
                  <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-orange-500/50" />
                  <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-orange-500/50" />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between p-3">
                    {/* Top info */}
                    <div>
                      <div className="text-orange-500/60 text-xs font-mono">
                        {module.name}
                      </div>
                      <div className="text-orange-500 text-sm font-mono mt-1">
                        {module.type}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-orange-500/40">PROGRESS</span>
                        <span className="text-orange-500">
                          {progress[index]}%
                        </span>
                      </div>
                      <div className="h-1 bg-orange-500/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-1000"
                          style={{ width: `${progress[index]}%` }}
                        />
                      </div>
                    </div>

                    {/* Status indicator */}
                    <div className="absolute top-2 right-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          module.status === 'complete'
                            ? 'bg-orange-400'
                            : module.status === 'active'
                              ? 'bg-orange-500 animate-pulse'
                              : 'bg-orange-500/30'
                        }`}
                      />
                    </div>

                    {/* Lock overlay */}
                    {module.status === 'locked' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <span className="text-orange-500/50 text-2xl">⬡</span>
                      </div>
                    )}
                  </div>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/0 hover:from-orange-500/5 hover:to-transparent transition-all duration-300" />
                </div>
              ))}
            </div>

            {/* Footer stats */}
            <div className="flex justify-between items-center mt-4 px-2 pt-3 border-t border-orange-500/20">
              <div className="flex gap-6">
                <div>
                  <div className="text-orange-500/40 text-xs font-mono">
                    MODULES
                  </div>
                  <div className="text-orange-500 text-sm font-mono">
                    9 / 12
                  </div>
                </div>
                <div>
                  <div className="text-orange-500/40 text-xs font-mono">
                    COMPLETE
                  </div>
                  <div className="text-orange-500 text-sm font-mono">2</div>
                </div>
                <div>
                  <div className="text-orange-500/40 text-xs font-mono">
                    LOCKED
                  </div>
                  <div className="text-orange-500 text-sm font-mono">2</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-orange-500/40 text-xs font-mono">
                  TOTAL PROGRESS
                </div>
                <div className="text-orange-500 text-lg font-mono font-bold">
                  {Math.round(progress.reduce((a, b) => a + b, 0) / 9)}%
                </div>
              </div>
            </div>

            {/* Profile badges */}
            <div className="flex gap-2 mt-4 px-2">
              <div className="flex-1 p-2 border border-orange-500/30 rounded-sm bg-orange-500/5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border border-orange-500 rounded-sm flex items-center justify-center text-orange-500 text-xs">
                    A
                  </div>
                  <div>
                    <div className="text-orange-500 text-xs font-mono">
                      АРХИТЕКТОР
                    </div>
                    <div className="text-orange-500/50 text-xs font-mono">
                      Persistence + Structure
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-2 border border-orange-500/30 rounded-sm bg-orange-500/5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border border-orange-500 rounded-sm flex items-center justify-center text-orange-500 text-xs">
                    С
                  </div>
                  <div>
                    <div className="text-orange-500 text-xs font-mono uppercase">
                      Принять
                    </div>
                    <div className="text-orange-500/50 text-xs font-mono">
                      Completion + Collection
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom decorative elements */}
            <div className="flex justify-center gap-1 mt-4">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-1 rounded-full ${
                    i < 7 ? 'bg-orange-500' : 'bg-orange-500/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Outer corner decorations */}
        <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-orange-500" />
        <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-orange-500" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-orange-500" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-orange-500" />
      </div>
    </Flex>
  )
}
