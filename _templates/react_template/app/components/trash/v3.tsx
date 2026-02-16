import React, { useState } from 'react'
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import { PointTypography } from '@components/ui/PointTypography'
import { Typography } from '@components/ui/Typography'

// ============================================
// 1. CODE ARENA — интерактивный редактор кода
// ============================================
const CodeArena = ({
  initialCode = '',
  language = 'javascript',
  hints = [],
  badSmells = [],
  onRun,
  expectedOutput = null,
}) => {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [activeHint, setActiveHint] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [isCorrect, setIsCorrect] = useState(null)

  const runCode = async () => {
    setIsRunning(true)
    setAttempts(prev => prev + 1)

    // Simulate execution
    await new Promise(r => setTimeout(r, 800))

    try {
      // Simple eval for demo (in production use sandboxed execution)
      let result
      if (language === 'javascript') {
        const logs = []
        const mockConsole = { log: (...args) => logs.push(args.join(' ')) }
        const fn = new Function('console', code)
        fn(mockConsole)
        result = logs.join('\n') || 'undefined'
      } else {
        result = `// Output simulation for ${language}`
      }

      setOutput(result)

      if (expectedOutput && result.trim() === expectedOutput.trim()) {
        setIsCorrect(true)
      } else if (expectedOutput) {
        setIsCorrect(false)
      }

      if (onRun) {
        onRun({ code, result, attempts: attempts + 1 })
      }
    } catch (err) {
      setOutput(`Error: ${err.message}`)
      setIsCorrect(false)
    }

    setIsRunning(false)
  }

  const detectedSmells = badSmells.filter(smell =>
    code.toLowerCase().includes(smell.pattern.toLowerCase()),
  )

  return (
    <div className="bg-neutral-950 border border-orange-500/30 rounded-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black border-b border-orange-500/20">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-orange-500/80" />
            <div className="w-3 h-3 rounded-full bg-orange-500/40" />
            <div className="w-3 h-3 rounded-full bg-orange-500/20" />
          </div>
          <span className="text-orange-500 text-sm font-mono">CODE ARENA</span>
          <span className="text-orange-500/40 text-xs font-mono">
            // {language}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-orange-500/60 text-xs font-mono">
            ATTEMPTS: {attempts}
          </span>
          {isCorrect !== null && (
            <span
              className={`text-xs font-mono ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {isCorrect ? '✓ PASSED' : '✗ FAILED'}
            </span>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-black/50 border-r border-orange-500/10 flex flex-col items-end pr-2 pt-4 text-orange-500/30 text-xs font-mono">
          {code.split('\n').map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          className="w-full min-h-[200px] bg-transparent text-orange-100 font-mono text-sm p-4 pl-14 focus:outline-none resize-none leading-6"
          spellCheck={false}
          style={{ tabSize: 2 }}
        />
      </div>

      {/* Bad Smells Warning */}
      {detectedSmells.length > 0 && (
        <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/30">
          <div className="text-red-400 text-xs font-mono flex items-center gap-2">
            <span>⚠</span>
            <span>CODE SMELL DETECTED:</span>
          </div>
          {detectedSmells.map((smell, i) => (
            <div
              key={i}
              className="text-red-400/80 text-xs font-mono mt-1 pl-5">
              → {smell.message}
            </div>
          ))}
        </div>
      )}

      {/* Hints */}
      {hints.length > 0 && (
        <div className="border-t border-orange-500/20">
          <button
            onClick={() => setShowHints(!showHints)}
            className="w-full px-4 py-2 text-left text-orange-500/60 text-xs font-mono hover:bg-orange-500/5 transition-colors flex items-center gap-2">
            <span>{showHints ? '▼' : '▶'}</span>
            <span>HINTS ({hints.length})</span>
          </button>
          {showHints && (
            <div className="px-4 pb-3">
              <div className="flex gap-2 mb-2">
                {hints.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveHint(i)}
                    className={`w-6 h-6 text-xs font-mono border transition-all ${
                      i === activeHint
                        ? 'border-orange-500 text-orange-500 bg-orange-500/20'
                        : 'border-orange-500/30 text-orange-500/50 hover:border-orange-500/60'
                    }`}>
                    {i + 1}
                  </button>
                ))}
              </div>
              <div className="text-orange-400/80 text-sm font-mono p-3 bg-orange-500/5 border-l-2 border-orange-500/50">
                {hints[activeHint]}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Output */}
      <div className="border-t border-orange-500/20">
        <div className="px-4 py-2 bg-black/50 flex items-center justify-between">
          <span className="text-orange-500/60 text-xs font-mono">OUTPUT</span>
          <button
            onClick={runCode}
            disabled={isRunning}
            className={`px-4 py-1.5 font-mono text-sm transition-all ${
              isRunning
                ? 'bg-orange-500/20 text-orange-500/50'
                : 'bg-orange-500 text-black hover:bg-orange-400'
            }`}>
            {isRunning ? 'RUNNING...' : 'RUN ▶'}
          </button>
        </div>
        <div className="p-4 min-h-[80px] font-mono text-sm">
          {output ? (
            <pre
              className={`${isCorrect === false ? 'text-red-400' : isCorrect === true ? 'text-green-400' : 'text-orange-300'}`}>
              {output}
            </pre>
          ) : (
            <span className="text-orange-500/30">
              // Нажми RUN, чтобы выполнить код
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// 2. THINKING FLOW — когнитивная цепочка
// ============================================
const ThinkingFlow = ({ nodes = [], activeNode = null, onNodeClick }) => {
  const nodeTypes = {
    break: {
      color: 'red',
      icon: '⚡',
      label: 'СЛОМ',
    },
    control: {
      color: 'orange',
      icon: '⚙',
      label: 'КОНТРОЛЬ',
    },
    insight: {
      color: 'green',
      icon: '💡',
      label: 'ИНСАЙТ',
    },
    default: {
      color: 'gray',
      icon: '○',
      label: '',
    },
  }

  return (
    <div className="bg-neutral-950 border border-orange-500/30 rounded-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
        <span className="text-orange-500 text-sm font-mono">THINKING FLOW</span>
      </div>

      <div className="relative">
        {/* Connection lines */}
        <div className="absolute top-8 left-8 right-8 h-0.5 bg-gradient-to-r from-red-500/50 via-orange-500/50 to-green-500/50" />

        {/* Nodes */}
        <div className="relative flex justify-between">
          {nodes.map((node, index) => {
            const type = nodeTypes[node.type] || nodeTypes.default
            const isActive = activeNode === node.id

            return (
              <div
                key={node.id}
                onClick={() => onNodeClick && onNodeClick(node)}
                className={`
                  relative flex flex-col items-center cursor-pointer
                  transition-all duration-300 group
                  ${isActive ? 'scale-110' : 'hover:scale-105'}
                `}>
                {/* Node circle */}
                <div
                  className={`
                    w-16 h-16 rounded-full border-2 flex items-center justify-center
                    transition-all duration-300 z-10 bg-neutral-950
                    ${
                      isActive
                        ? `border-${type.color}-500 shadow-lg shadow-${type.color}-500/30`
                        : `border-${type.color}-500/50 group-hover:border-${type.color}-500`
                    }
                  `}
                  style={{
                    borderColor:
                      type.color === 'red'
                        ? '#ef4444'
                        : type.color === 'green'
                          ? '#22c55e'
                          : '#ff6100',
                    boxShadow: isActive
                      ? `0 0 20px ${type.color === 'red' ? '#ef444440' : type.color === 'green' ? '#22c55e40' : '#ff610040'}`
                      : 'none',
                  }}>
                  <span className="text-2xl">{type.icon}</span>
                </div>

                {/* Label */}
                <div className="mt-3 text-center">
                  <div className="text-orange-500/60 text-xs font-mono">
                    {type.label}
                  </div>
                  <div
                    className={`text-sm font-mono mt-1 ${isActive ? 'text-white' : 'text-orange-500/80'}`}>
                    {node.label}
                  </div>
                </div>

                {/* Step number */}
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-black text-xs font-bold">
                  {index + 1}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Active node content */}
      {activeNode && nodes.find(n => n.id === activeNode)?.content && (
        <div className="mt-8 p-4 bg-orange-500/5 border-l-2 border-orange-500 animate-pulse">
          <p className="text-orange-100 text-sm">
            {nodes.find(n => n.id === activeNode).content}
          </p>
        </div>
      )}
    </div>
  )
}

// ============================================
// 3. PROGRESS CHART — метрики прогресса
// ============================================
const ProgressChart = ({ data = [], title = 'PROGRESS', metric = 'score' }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black border border-orange-500/50 p-2 font-mono text-xs">
          <div className="text-orange-500">Попытка {label}</div>
          <div className="text-white">
            {metric}: {payload[0].value}
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="bg-neutral-950 border border-orange-500/30 rounded-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full" />
          <span className="text-orange-500 text-sm font-mono">{title}</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-orange-500/60">
            MIN: {Math.min(...data.map(d => d.value))}
          </span>
          <span className="text-orange-500/60">
            MAX: {Math.max(...data.map(d => d.value))}
          </span>
          <span className="text-orange-500">
            AVG:{' '}
            {Math.round(data.reduce((a, b) => a + b.value, 0) / data.length)}
          </span>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff6100" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ff6100" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="attempt"
              stroke="#ff6100"
              strokeOpacity={0.3}
              tick={{ fill: '#ff6100', opacity: 0.6, fontSize: 10 }}
              axisLine={{ stroke: '#ff6100', strokeOpacity: 0.2 }}
            />
            <YAxis
              stroke="#ff6100"
              strokeOpacity={0.3}
              tick={{ fill: '#ff6100', opacity: 0.6, fontSize: 10 }}
              axisLine={{ stroke: '#ff6100', strokeOpacity: 0.2 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#ff6100"
              strokeWidth={2}
              fill="url(#colorValue)"
              dot={{ fill: '#ff6100', strokeWidth: 0, r: 3 }}
              activeDot={{ fill: '#ff6100', strokeWidth: 0, r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-orange-500/20">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full" />
          <span className="text-orange-500/60 text-xs font-mono">
            Текущий результат
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-gradient-to-r from-orange-500/20 to-orange-500" />
          <span className="text-orange-500/60 text-xs font-mono">Тренд</span>
        </div>
      </div>
    </div>
  )
}

// ============================================
// 4. INSIGHT CARD — карточка инсайта
// ============================================
const InsightCard = ({
  summary = '',
  before = null,
  after = null,
  tags = [],
}) => {
  const [showComparison, setShowComparison] = useState(false)

  return (
    <div className="bg-neutral-950 border border-orange-500/30 rounded-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-orange-500/20 to-transparent border-b border-orange-500/20">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💡</span>
          <span className="text-orange-500 text-sm font-mono">INSIGHT</span>
        </div>
      </div>

      {/* Summary */}
      <div className="p-6">
        <p className="text-white text-lg leading-relaxed">{summary}</p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-mono">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Before/After comparison */}
      {(before || after) && (
        <div className="border-t border-orange-500/20">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="w-full px-4 py-2 text-left text-orange-500/60 text-xs font-mono hover:bg-orange-500/5 transition-colors flex items-center gap-2">
            <span>{showComparison ? '▼' : '▶'}</span>
            <span>BEFORE / AFTER</span>
          </button>

          {showComparison && (
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="p-3 bg-red-500/5 border border-red-500/30 rounded">
                <div className="text-red-400 text-xs font-mono mb-2">
                  BEFORE
                </div>
                <div className="text-red-300 text-sm font-mono">{before}</div>
              </div>
              <div className="p-3 bg-green-500/5 border border-green-500/30 rounded">
                <div className="text-green-400 text-xs font-mono mb-2">
                  AFTER
                </div>
                <div className="text-green-300 text-sm font-mono">{after}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// 5. FUTURE SKILLS — блок будущих навыков
// ============================================
const FutureSkills = ({
  symbol = 'ᚨ',
  title = 'Освоишь',
  skills = [],
  nextAction = null,
  onAction,
}) => (
  <div className="bg-neutral-950 border border-orange-500/30 rounded-sm overflow-hidden">
    {/* Header with symbol */}
    <div className="p-6 text-center bg-gradient-to-b from-orange-500/10 to-transparent">
      <div className="text-6xl mb-4 text-orange-500 opacity-80">{symbol}</div>
      <div className="text-orange-500 text-xl font-mono tracking-wider">
        {title}
      </div>
    </div>

    {/* Skills list */}
    <div className="p-6 space-y-3">
      {skills.map((skill, i) => (
        <div key={i} className="flex items-start gap-3 group">
          <div className="w-6 h-6 border border-orange-500/50 flex items-center justify-center text-orange-500 text-xs font-mono group-hover:bg-orange-500/20 transition-colors">
            {i + 1}
          </div>
          <div className="flex-1">
            <div className="text-white text-sm">{skill.name}</div>
            {skill.description && (
              <div className="text-orange-500/50 text-xs mt-1">
                {skill.description}
              </div>
            )}
          </div>
          {skill.unlocked && (
            <div className="text-green-500 text-xs font-mono">✓</div>
          )}
        </div>
      ))}
    </div>

    {/* Action button */}
    {nextAction && (
      <div className="p-4 border-t border-orange-500/20">
        <button
          onClick={onAction}
          className="w-full py-3 bg-orange-500 text-black font-mono text-sm hover:bg-orange-400 transition-colors flex items-center justify-center gap-2">
          <span>{nextAction}</span>
          <span>→</span>
        </button>
      </div>
    )}
  </div>
)

// ============================================
// 6. CONCEPT GRAPH — граф связей (простая версия)
// ============================================
const ConceptGraph = ({ nodes = [], edges = [], onNodeClick }) => {
  const [activeNode, setActiveNode] = useState(null)

  // Calculate node positions in a circle
  const centerX = 150
  const centerY = 150
  const radius = 100

  const nodePositions = nodes.map((node, i) => {
    const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2

    return {
      ...node,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  })

  return (
    <div className="bg-neutral-950 border border-orange-500/30 rounded-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-orange-500 rounded-full" />
        <span className="text-orange-500 text-sm font-mono">CONCEPT GRAPH</span>
      </div>

      <svg width="300" height="300" className="mx-auto">
        {/* Edges */}
        {edges.map((edge, i) => {
          const from = nodePositions.find(n => n.id === edge.from)
          const to = nodePositions.find(n => n.id === edge.to)
          if (!from || !to) {
            return null
          }

          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#ff6100"
              strokeOpacity={0.3}
              strokeWidth={1}
            />
          )
        })}

        {/* Nodes */}
        {nodePositions.map(node => (
          <g
            key={node.id}
            onClick={() => {
              setActiveNode(node.id)
              onNodeClick && onNodeClick(node)
            }}
            className="cursor-pointer">
            <circle
              cx={node.x}
              cy={node.y}
              r={activeNode === node.id ? 25 : 20}
              fill={activeNode === node.id ? '#ff6100' : '#1a1a1a'}
              stroke="#ff6100"
              strokeWidth={activeNode === node.id ? 2 : 1}
              className="transition-all duration-300"
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={activeNode === node.id ? '#000' : '#ff6100'}
              fontSize="10"
              fontFamily="monospace">
              {node.label.substring(0, 3)}
            </text>
          </g>
        ))}
      </svg>

      {/* Active node info */}
      {activeNode && (
        <div className="mt-4 p-3 bg-orange-500/10 border-l-2 border-orange-500">
          <div className="text-orange-500 font-mono text-sm">
            {nodes.find(n => n.id === activeNode)?.label}
          </div>
          <div className="text-orange-500/60 text-xs mt-1">
            {nodes.find(n => n.id === activeNode)?.description}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// MAIN DEMO — все блоки вместе
// ============================================
export const ThinkingArenaBlocks = () => {
  const [flowActiveNode, setFlowActiveNode] = useState('break')

  // Demo data
  const demoCode = `function fibonacci(n) {
  // Твой код здесь
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`

  const flowNodes = [
    {
      id: 'break',
      type: 'break',
      label: 'Рекурсия',
      content: 'Почему простая рекурсия работает медленно?',
    },
    {
      id: 'control',
      type: 'control',
      label: 'Мемоизация',
      content: 'Кэширование результатов ускоряет в разы.',
    },
    {
      id: 'insight',
      type: 'insight',
      label: 'O(n)',
      content: 'Понял! Мемоизация превращает O(2^n) в O(n).',
    },
  ]

  const progressData = [
    {
      attempt: 1,
      value: 23,
    },
    { attempt: 2, value: 45 },
    { attempt: 3, value: 38 },
    { attempt: 4, value: 67 },
    { attempt: 5, value: 72 },
    { attempt: 6, value: 85 },
    { attempt: 7, value: 91 },
  ]

  const skills = [
    {
      name: 'Рекурсия и мемоизация',
      description: 'Оптимизация рекурсивных алгоритмов',
      unlocked: true,
    },
    {
      name: 'Динамическое программирование',
      description: 'Bottom-up подход к задачам',
      unlocked: true,
    },
    {
      name: 'Сложность алгоритмов',
      description: 'Big O нотация и анализ',
      unlocked: false,
    },
    {
      name: 'Структуры данных',
      description: 'Выбор оптимальной структуры',
      unlocked: false,
    },
  ]

  const conceptNodes = [
    {
      id: 'rec',
      label: 'Рекурсия',
      description: 'Функция вызывает сама себя',
    },
    { id: 'mem', label: 'Мемоизация', description: 'Кэширование результатов' },
    { id: 'dp', label: 'Динамика', description: 'Bottom-up подход' },
    { id: 'big', label: 'Big O', description: 'Оценка сложности' },
    {
      id: 'opt',
      label: 'Оптимизация',
      description: 'Улучшение производительности',
    },
  ]

  const conceptEdges = [
    {
      from: 'rec',
      to: 'mem',
    },
    {
      from: 'mem',
      to: 'dp',
    },
    {
      from: 'dp',
      to: 'opt',
    },
    {
      from: 'rec',
      to: 'big',
    },
    {
      from: 'big',
      to: 'opt',
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <PointTypography label="THINKING ARENA" />
        <Typography variant="h1">Блоки для курса</Typography>
        <Typography variant="sub_h1">
          Интерактивные компоненты: код, цепочки, графики, инсайты
        </Typography>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Row 1: Code Arena (full width) */}
        <div>
          <div className="text-orange-500/60 text-xs font-mono mb-2">
            01 // CODE ARENA
          </div>
          <CodeArena
            initialCode={demoCode}
            language="javascript"
            hints={[
              'Попробуй добавить кэш для уже вычисленных значений',
              'Используй объект или Map для хранения результатов',
              'Проверяй кэш перед рекурсивным вызовом',
            ]}
            badSmells={[
              { pattern: 'var ', message: 'Используй let/const вместо var' },
            ]}
            expectedOutput="55"
          />
        </div>

        {/* Row 2: Thinking Flow */}
        <div>
          <div className="text-orange-500/60 text-xs font-mono mb-2">
            02 // THINKING FLOW
          </div>
          <ThinkingFlow
            nodes={flowNodes}
            activeNode={flowActiveNode}
            onNodeClick={node => setFlowActiveNode(node.id)}
          />
        </div>

        {/* Row 3: Two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="text-orange-500/60 text-xs font-mono mb-2">
              03 // PROGRESS CHART
            </div>
            <ProgressChart
              data={progressData}
              title="РЕЗУЛЬТАТЫ ПОПЫТОК"
              metric="score"
            />
          </div>
          <div>
            <div className="text-orange-500/60 text-xs font-mono mb-2">
              04 // CONCEPT GRAPH
            </div>
            <ConceptGraph nodes={conceptNodes} edges={conceptEdges} />
          </div>
        </div>

        {/* Row 4: Two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="text-orange-500/60 text-xs font-mono mb-2">
              05 // INSIGHT CARD
            </div>
            <InsightCard
              summary="Мемоизация превращает экспоненциальную сложность в линейную, сохраняя промежуточные результаты"
              before="O(2^n) — каждый вызов порождает два новых"
              after="O(n) — каждое значение вычисляется один раз"
              tags={['алгоритмы', 'оптимизация', 'рекурсия']}
            />
          </div>
          <div>
            <div className="text-orange-500/60 text-xs font-mono mb-2">
              06 // FUTURE SKILLS
            </div>
            <FutureSkills
              symbol="ᚨ"
              title="Освоишь"
              skills={skills}
              nextAction="Перейти к следующему заданию"
              onAction={() => alert('Next task!')}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-orange-500/20 text-center">
        <div className="text-orange-500 font-mono text-sm">
          THINKING ARENA v1.0
        </div>
        <div className="text-neutral-600 text-xs mt-1">
          Слом → Контроль → Инсайт
        </div>
      </div>
    </div>
  )
}
