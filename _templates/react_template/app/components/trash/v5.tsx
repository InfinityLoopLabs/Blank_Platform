import React, { useState, useEffect } from 'react'
import { ComparisonTable } from '@components/ui/ComparisonTable'

// ============================================
// 2. FORMULA BLOCK — Формульный рендер
// ============================================
const FormulaBlock = ({
  formula = '',
  explanation = '',
  variables = [],
  interactive = false,
  onVariableChange,
}) => {
  const [values, setValues] = useState(
    variables.reduce((acc, v) => ({ ...acc,
[v.symbol]: v.default || 0 }), {}),
  )
  const [result, setResult] = useState(null)
  const [showBreakdown, setShowBreakdown] = useState(false)

  // Simple formula parser for demo (in production use math.js or similar)
  const calculateResult = () => {
    try {
      let evalFormula = formula
      variables.forEach(v => {
        evalFormula = evalFormula.replace(
          new RegExp(v.symbol, 'g'),
          values[v.symbol],
        )
      })
      // Remove LaTeX formatting for eval
      evalFormula = evalFormula.replace(
        /\\frac\{([^}]+)\}\{([^}]+)\}/g,
        '($1)/($2)',
      )
      evalFormula = evalFormula.replace(/\\sqrt\{([^}]+)\}/g, 'Math.sqrt($1)')
      evalFormula = evalFormula.replace(/\^/g, '**')
      evalFormula = evalFormula.replace(/\\times/g, '*')
      const res = eval(evalFormula)
      setResult(typeof res === 'number' ? res.toFixed(2) : res)
    } catch {
      setResult('Error')
    }
  }

  useEffect(() => {
    if (interactive) {
      calculateResult()
    }
  }, [values])

  const updateValue = (symbol, value) => {
    const newValues = {
      ...values,
      [symbol]: parseFloat(value) || 0,
    }
    setValues(newValues)
    onVariableChange && onVariableChange(newValues)
  }

  // Render formula with highlighting
  const renderFormula = () => {
    let rendered = formula

    // Highlight variables
    variables.forEach(v => {
      rendered = rendered.replace(
        new RegExp(`(${v.symbol})`, 'g'),
        `<span class="text-orange-400 font-bold">${v.symbol}</span>`,
      )
    })

    // Style LaTeX-like syntax
    rendered = rendered
      .replace(
        /\\frac\{([^}]+)\}\{([^}]+)\}/g,
        '<span class="inline-flex flex-col items-center"><span class="border-b border-orange-500/50 px-1">$1</span><span class="px-1">$2</span></span>',
      )
      .replace(
        /\\sqrt\{([^}]+)\}/g,
        '√<span class="border-t border-orange-500/50">$1</span>',
      )
      .replace(/\^(\d+)/g, '<sup>$1</sup>')
      .replace(/\\times/g, '×')
      .replace(/\\div/g, '÷')
      .replace(/\\pm/g, '±')
      .replace(/\\infty/g, '∞')
      .replace(/\\sum/g, '∑')
      .replace(/\\pi/g, 'π')

    return rendered
  }

  return (
    <div className="bg-neutral-950 border border-orange-500/30 rounded-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-black border-b border-orange-500/20">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 text-lg">∑</span>
          <span className="text-orange-500 text-sm font-mono">FORMULA</span>
          {interactive && (
            <span className="text-green-500/60 text-xs font-mono ml-2">
              // INTERACTIVE
            </span>
          )}
        </div>
      </div>

      {/* Formula display */}
      <div className="p-8 text-center">
        <div
          className="text-3xl text-white font-mono tracking-wide"
          dangerouslySetInnerHTML={{ __html: renderFormula() }}
        />

        {explanation && (
          <p className="text-orange-500/60 text-sm mt-4 max-w-md mx-auto">
            {explanation}
          </p>
        )}
      </div>

      {/* Variables */}
      {variables.length > 0 && (
        <div className="px-6 pb-4 border-t border-orange-500/10 pt-4">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="text-orange-500/60 text-xs font-mono mb-3 hover:text-orange-500 flex items-center gap-2">
            <span>{showBreakdown ? '▼' : '▶'}</span>
            <span>ПЕРЕМЕННЫЕ ({variables.length})</span>
          </button>

          {showBreakdown && (
            <div className="grid grid-cols-2 gap-4">
              {variables.map(v => (
                <div key={v.symbol} className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-orange-500/50 flex items-center justify-center text-orange-400 font-mono text-lg">
                    {v.symbol}
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm">{v.name}</div>
                    {interactive ? (
                      <input
                        type="number"
                        value={values[v.symbol]}
                        onChange={e => updateValue(v.symbol, e.target.value)}
                        className="w-full bg-black border border-orange-500/30 px-2 py-1 text-orange-500 font-mono text-sm mt-1 focus:outline-none focus:border-orange-500"
                      />
                    ) : (
                      <div className="text-orange-500/50 text-xs">
                        {v.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Result */}
      {interactive && result !== null && (
        <div className="px-6 pb-6">
          <div className="p-4 bg-orange-500/10 border-l-2 border-orange-500">
            <div className="text-orange-500/60 text-xs font-mono mb-1">
              РЕЗУЛЬТАТ
            </div>
            <div className="text-orange-500 text-2xl font-mono">{result}</div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// 3. ERROR BREAKDOWN — Разбор ошибки
// ============================================
const ErrorBreakdown = ({
  error = {},
  userAnswer = '',
  correctAnswer = '',
  steps = [],
  principle = '',
  onRetry,
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [understood, setUnderstood] = useState(false)
  const [reflection, setReflection] = useState('')

  const phases = [
    { id: 'what',
label: 'ЧТО',
title: 'Что произошло?' },
    { id: 'why',
label: 'ПОЧЕМУ',
title: 'Почему это неверно?' },
    { id: 'how',
label: 'КАК',
title: 'Как это починить?' },
    { id: 'principle',
label: 'ПРИНЦИП',
title: 'Какой принцип за этим?' },
  ]

  return (
    <div className="bg-neutral-950 border border-orange-500/30 rounded-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-red-500/10 to-transparent border-b border-orange-500/20">
        <div className="flex items-center gap-2">
          <span className="text-red-400 text-lg">⚠</span>
          <span className="text-orange-500 text-sm font-mono">
            ERROR BREAKDOWN
          </span>
          <span className="text-red-400/60 text-xs font-mono ml-2">
            // БЕЗ ОСУЖДЕНИЯ
          </span>
        </div>
      </div>

      {/* Error comparison */}
      <div className="p-4 border-b border-orange-500/10">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-red-500/5 border border-red-500/20 rounded">
            <div className="text-red-400/60 text-xs font-mono mb-2">
              ТВОЙ ОТВЕТ
            </div>
            <div className="text-red-300 font-mono">{userAnswer}</div>
          </div>
          <div className="p-3 bg-green-500/5 border border-green-500/20 rounded">
            <div className="text-green-400/60 text-xs font-mono mb-2">
              ВЕРНЫЙ ОТВЕТ
            </div>
            <div className="text-green-300 font-mono">{correctAnswer}</div>
          </div>
        </div>
      </div>

      {/* Phase navigation */}
      <div className="px-4 pt-4">
        <div className="flex gap-2">
          {phases.map((phase, i) => (
            <button
              key={phase.id}
              onClick={() => setCurrentStep(i)}
              className={`flex-1 py-2 text-xs font-mono border transition-all ${
                i === currentStep
                  ? 'border-orange-500 bg-orange-500/20 text-orange-500'
                  : i < currentStep
                    ? 'border-green-500/30 bg-green-500/10 text-green-500'
                    : 'border-neutral-700 text-neutral-500'
              }`}>
              {phase.label}
            </button>
          ))}
        </div>
      </div>

      {/* Phase content */}
      <div className="p-6">
        <div className="text-orange-500 font-mono text-sm mb-4">
          {phases[currentStep].title}
        </div>

        {currentStep === 0 && (
          <div className="space-y-4">
            <div className="p-4 bg-black/50 border-l-2 border-red-500/50">
              <p className="text-white">
                {error.what || 'Ответ не соответствует ожидаемому результату.'}
              </p>
            </div>
            <div className="text-orange-500/60 text-sm">
              <span className="text-red-400">→</span> Разница:{' '}
              {error.difference || 'Логическая ошибка в рассуждении'}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="p-4 bg-black/50 border-l-2 border-orange-500/50">
              <p className="text-white">
                {error.why || 'Была нарушена причинно-следственная связь.'}
              </p>
            </div>
            {error.misconception && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
                <div className="text-yellow-400/60 text-xs font-mono mb-1">
                  ТИПИЧНОЕ ЗАБЛУЖДЕНИЕ
                </div>
                <p className="text-yellow-300 text-sm">{error.misconception}</p>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 border border-orange-500/50 flex items-center justify-center text-orange-500 text-xs font-mono">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm">{step.action}</div>
                  {step.code && (
                    <pre className="mt-2 p-2 bg-black/50 text-orange-300 text-xs font-mono rounded overflow-x-auto">
                      {step.code}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="p-6 bg-orange-500/10 border border-orange-500/30 rounded text-center">
              <div className="text-orange-500/60 text-xs font-mono mb-2">
                ПРИНЦИП
              </div>
              <p className="text-orange-400 text-lg font-mono">"{principle}"</p>
            </div>

            <div>
              <div className="text-orange-500/60 text-xs font-mono mb-2">
                КАК БЫ ТЫ ОБЪЯСНИЛ ЭТО ДРУГОМУ?
              </div>
              <textarea
                value={reflection}
                onChange={e => setReflection(e.target.value)}
                placeholder="Напиши своими словами..."
                className="w-full bg-black border border-orange-500/30 p-3 text-white text-sm resize-none focus:outline-none focus:border-orange-500"
                rows={3}
              />
            </div>

            {reflection.length > 20 && !understood && (
              <button
                onClick={() => setUnderstood(true)}
                className="w-full py-3 bg-orange-500 text-black font-mono text-sm hover:bg-orange-400 transition-colors">
                ✓ ПОНЯЛ ПРИНЦИП
              </button>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-6 pb-6 flex gap-2">
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-4 py-2 border border-orange-500/30 text-orange-500 font-mono text-sm hover:bg-orange-500/10">
            ← Назад
          </button>
        )}
        {currentStep < phases.length - 1 && (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="flex-1 py-2 bg-orange-500 text-black font-mono text-sm hover:bg-orange-400">
            Далее →
          </button>
        )}
        {understood && (
          <button
            onClick={onRetry}
            className="flex-1 py-2 bg-green-500 text-black font-mono text-sm hover:bg-green-400">
            ПОПРОБОВАТЬ СНОВА →
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================
// 4. MICRO SIM — Мини-симулятор
// ============================================
const MicroSim = ({
  title = '',
  description = '',
  parameters = [],
  simulate,
  visualize,
}) => {
  const [values, setValues] = useState(
    parameters.reduce((acc, p) => ({ ...acc,
[p.key]: p.default }), {}),
  )
  const [output, setOutput] = useState(null)
  const [history, setHistory] = useState([])
  const [isRunning, setIsRunning] = useState(false)

  const runSimulation = async () => {
    setIsRunning(true)
    await new Promise(r => setTimeout(r, 300))

    const result = simulate
      ? simulate(values)
      : {
          value: Object.values(values).reduce((a, b) => a * b, 1),
          status: 'ok',
        }

    setOutput(result)
    setHistory([
      ...history,
      { values: { ...values }, result, timestamp: Date.now() },
    ])
    setIsRunning(false)
  }

  const updateParam = (key, value) => {
    setValues({ ...values,
[key]: value })
  }

  // Auto-run on parameter change
  useEffect(() => {
    const timer = setTimeout(runSimulation, 500)

    return () => clearTimeout(timer)
  }, [values])

  return (
    <div className="bg-neutral-950 border border-orange-500/30 rounded-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-orange-500/10 to-transparent border-b border-orange-500/20">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 text-lg">⚙</span>
          <span className="text-orange-500 text-sm font-mono">MICRO SIM</span>
          {title && (
            <span className="text-orange-500/50 text-sm font-mono">
              // {title}
            </span>
          )}
        </div>
      </div>

      {description && (
        <div className="px-4 py-3 border-b border-orange-500/10">
          <p className="text-orange-500/70 text-sm">{description}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-0">
        {/* Controls */}
        <div className="p-4 border-r border-orange-500/10 space-y-4">
          <div className="text-orange-500/60 text-xs font-mono mb-2">
            ПАРАМЕТРЫ
          </div>

          {parameters.map(param => (
            <div key={param.key}>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-orange-500/60">{param.label}</span>
                <span className="text-orange-500">
                  {values[param.key]}
                  {param.unit || ''}
                </span>
              </div>

              {param.type === 'range' && (
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step || 1}
                  value={values[param.key]}
                  onChange={e =>
                    updateParam(param.key, parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              )}

              {param.type === 'select' && (
                <select
                  value={values[param.key]}
                  onChange={e => updateParam(param.key, e.target.value)}
                  className="w-full bg-black border border-orange-500/30 px-3 py-2 text-orange-500 font-mono text-sm focus:outline-none">
                  {param.options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {param.type === 'toggle' && (
                <button
                  onClick={() => updateParam(param.key, !values[param.key])}
                  className={`w-full py-2 border font-mono text-sm transition-colors ${
                    values[param.key]
                      ? 'border-orange-500 bg-orange-500/20 text-orange-500'
                      : 'border-neutral-700 text-neutral-500'
                  }`}>
                  {values[param.key] ? 'ON' : 'OFF'}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Visualization */}
        <div className="p-4 flex flex-col">
          <div className="text-orange-500/60 text-xs font-mono mb-2">
            РЕЗУЛЬТАТ
          </div>

          <div className="flex-1 bg-black/50 rounded p-4 flex items-center justify-center min-h-[150px]">
            {isRunning ? (
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <div
                  className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"
                  style={{ animationDelay: '0.2s' }}
                />
                <div
                  className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"
                  style={{ animationDelay: '0.4s' }}
                />
              </div>
            ) : output ? (
              visualize ? (
                visualize(output, values)
              ) : (
                <div className="text-center">
                  <div
                    className={`text-4xl font-bold ${
                      output.status === 'ok'
                        ? 'text-green-500'
                        : output.status === 'warning'
                          ? 'text-yellow-500'
                          : output.status === 'error'
                            ? 'text-red-500'
                            : 'text-orange-500'
                    }`}>
                    {output.value}
                  </div>
                  {output.message && (
                    <div className="text-orange-500/60 text-xs font-mono mt-2">
                      {output.message}
                    </div>
                  )}
                </div>
              )
            ) : (
              <span className="text-orange-500/30 font-mono text-sm">
                Измени параметры
              </span>
            )}
          </div>

          {/* Mini history */}
          {history.length > 1 && (
            <div className="mt-3">
              <div className="text-orange-500/40 text-xs font-mono mb-1">
                ИСТОРИЯ
              </div>
              <div className="flex gap-1 h-6">
                {history.slice(-15).map((h, i) => {
                  const val =
                    typeof h.result.value === 'number' ? h.result.value : 50
                  const height = Math.min(100, Math.max(20, val))

                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-t transition-all ${
                        h.result.status === 'ok'
                          ? 'bg-green-500/40'
                          : h.result.status === 'warning'
                            ? 'bg-yellow-500/40'
                            : h.result.status === 'error'
                              ? 'bg-red-500/40'
                              : 'bg-orange-500/40'
                      }`}
                      style={{ height: `${height}%`,
alignSelf: 'flex-end' }}
                    />
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      {output?.insight && (
        <div className="px-4 pb-4">
          <div className="p-3 bg-orange-500/10 border-l-2 border-orange-500">
            <div className="text-orange-500/60 text-xs font-mono mb-1">
              💡 ИНСАЙТ
            </div>
            <p className="text-orange-400 text-sm">{output.insight}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// 5. MODEL DIFF — Сравнение моделей
// ============================================

// ============================================
// MAIN DEMO
// ============================================
export default function ThinkingToolsDemo() {
  // Demo data for ComparisonTable
  const comparisonData = {
    items: [
      {
        id: 'react',
        name: 'React',
        subtitle: 'Meta',
        values: { speed: 85, learning: 3, ecosystem: 5, size: 42, ssr: true },
      },
      {
        id: 'vue',
        name: 'Vue',
        subtitle: 'Evan You',
        values: { speed: 90, learning: 4, ecosystem: 4, size: 33, ssr: true },
      },
      {
        id: 'svelte',
        name: 'Svelte',
        subtitle: 'Vercel',
        values: { speed: 95, learning: 5, ecosystem: 3, size: 2, ssr: true },
      },
      {
        id: 'angular',
        name: 'Angular',
        subtitle: 'Google',
        values: { speed: 75, learning: 2, ecosystem: 4, size: 90, ssr: true },
      },
    ],
    criteria: [
      {
        key: 'speed',
        label: 'Производительность',
        type: 'number',
        higherIsBetter: true,
        description: 'Benchmark score',
      },
      {
        key: 'learning',
        label: 'Простота изучения',
        type: 'rating',
        higherIsBetter: true,
      },
      {
        key: 'ecosystem',
        label: 'Экосистема',
        type: 'rating',
        higherIsBetter: true,
      },
      {
        key: 'size',
        label: 'Размер бандла',
        type: 'number',
        higherIsBetter: false,
        description: 'KB (gzipped)',
      },
      {
        key: 'ssr',
        label: 'SSR из коробки',
        type: 'boolean',
        higherIsBetter: true,
      },
    ],
  }

  // Demo data for FormulaBlock
  const formulaData = {
    formula: 'E = m \\times c^2',
    explanation: 'Энергия равна массе, умноженной на квадрат скорости света',
    variables: [
      {
        symbol: 'E',
        name: 'Энергия',
        description: 'Джоули (J)',
        default: 0,
      },
      {
        symbol: 'm',
        name: 'Масса',
        description: 'Килограммы (kg)',
        default: 1,
      },
      {
        symbol: 'c',
        name: 'Скорость света',
        description: '299,792,458 м/с',
        default: 299792458,
      },
    ],
  }

  // Demo data for ErrorBreakdown
  const errorData = {
    error: {
      what: 'Функция вернула undefined вместо массива',
      why: 'Забыл return внутри .map() — стрелочная функция с фигурными скобками требует явного return',
      difference: 'undefined !== [1, 2, 3]',
      misconception:
        'Многие путают () => x и () => { x } — второй вариант НЕ возвращает x автоматически',
    },
    userAnswer: 'arr.map(x => { x * 2 })',
    correctAnswer: 'arr.map(x => x * 2)',
    steps: [
      { action: 'Убери фигурные скобки',
code: 'arr.map(x => x * 2)' },
      { action: 'Или добавь return',
code: 'arr.map(x => { return x * 2 })' },
    ],
    principle:
      'Стрелочные функции с () возвращают неявно, с {} — требуют return',
  }

  // Demo data for MicroSim
  const simParams = [
    {
      key: 'users',
      label: 'Пользователей',
      type: 'range',
      min: 10,
      max: 10000,
      default: 100,
    },
    {
      key: 'requestsPerUser',
      label: 'Запросов/юзер',
      type: 'range',
      min: 1,
      max: 100,
      default: 10,
    },
    {
      key: 'cacheEnabled',
      label: 'Кэширование',
      type: 'toggle',
      default: false,
    },
  ]

  const simulateLoad = params => {
    const totalRequests = params.users * params.requestsPerUser
    const cacheMultiplier = params.cacheEnabled ? 0.3 : 1
    const load = totalRequests * cacheMultiplier

    let status = 'ok'
    let message = 'Система стабильна'
    let insight = null

    if (load > 50000) {
      status = 'error'
      message = 'Перегрузка!'
      insight = 'При такой нагрузке нужно горизонтальное масштабирование'
    } else if (load > 20000) {
      status = 'warning'
      message = 'Высокая нагрузка'
      insight = params.cacheEnabled
        ? 'Кэш помогает, но на пределе'
        : 'Попробуй включить кэширование'
    }

    return { value: Math.round(load),
status,
message,
insight }
  }

  // Demo data for ModelDiff
  const diffData = {
    title: 'Async refactor diff',
    before: `function fetchData() {
  const response = fetch(url);
  const data = response.json();
  return data;
}

// Использование
const result = fetchData();
console.log(result);`,
    after: `async function fetchData() {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Использование
const result = await fetchData();
console.log(result);`,
    beforeLine: 0,
    afterLine: 0,
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-orange-500 font-mono tracking-widest">
              THINKING TOOLS
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">5 Essential Components</h1>
          <p className="text-neutral-400">
            Инструменты мышления, а не украшения интерфейса
          </p>
        </div>

        <div className="space-y-12">
          {/* 1. Comparison Table */}
          <div>
            <div className="text-orange-500/60 text-xs font-mono mb-2">
              01 // COMPARISON TABLE
            </div>
            <ComparisonTable
              title="Frontend Frameworks"
              items={comparisonData.items}
              criteria={comparisonData.criteria}
            />
          </div>

          {/* 2. Formula Block */}
          <div>
            <div className="text-orange-500/60 text-xs font-mono mb-2">
              02 // FORMULA BLOCK
            </div>
            <FormulaBlock
              formula={formulaData.formula}
              explanation={formulaData.explanation}
              variables={formulaData.variables}
              interactive={true}
            />
          </div>

          {/* 3. Error Breakdown */}
          <div>
            <div className="text-orange-500/60 text-xs font-mono mb-2">
              03 // ERROR BREAKDOWN
            </div>
            <ErrorBreakdown
              error={errorData.error}
              userAnswer={errorData.userAnswer}
              correctAnswer={errorData.correctAnswer}
              steps={errorData.steps}
              principle={errorData.principle}
            />
          </div>

          {/* 4. Micro Sim */}
          <div>
            <div className="text-orange-500/60 text-xs font-mono mb-2">
              04 // MICRO SIM
            </div>
            <MicroSim
              title="Load Simulator"
              description="Меняй параметры и смотри, как система реагирует на нагрузку"
              parameters={simParams}
              simulate={simulateLoad}
            />
          </div>

          {/* 5. Model Diff */}
          <div>
            <div className="text-orange-500/60 text-xs font-mono mb-2">
              05 // MODEL DIFF
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-orange-500/20 text-center">
          <div className="text-orange-500 font-mono text-sm">
            THINKING TOOLS
          </div>
          <div className="text-neutral-600 text-xs mt-1">
            Каждый компонент — инструмент, который делает работу
          </div>
        </div>
      </div>
    </div>
  )
}
