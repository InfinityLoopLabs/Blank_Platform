import React, { useState, useEffect, useCallback, useRef } from 'react'

// ============================================
// 1. BREAKPOINT ARENA — ломаем стабильность
// ============================================
const BreakpointArena = ({
  initialState = {},
  breakConditions = [],
  onBreak,
  onFix,
}) => {
  const [state, setState] = useState(initialState)
  const [isBroken, setIsBroken] = useState(false)
  const [breakReason, setBreakReason] = useState('')
  const [history, setHistory] = useState([])
  const [showDiagnosis, setShowDiagnosis] = useState(false)

  const parameters = [
    { key: 'load', label: 'Нагрузка', min: 0, max: 100, unit: '%' },
    { key: 'memory', label: 'Память', min: 0, max: 100, unit: 'MB' },
    { key: 'connections', label: 'Соединения', min: 1, max: 1000, unit: '' },
    { key: 'timeout', label: 'Таймаут', min: 100, max: 10000, unit: 'ms' },
  ]

  useEffect(() => {
    // Check break conditions
    for (const condition of breakConditions) {
      if (condition.check(state)) {
        setIsBroken(true)
        setBreakReason(condition.reason)
        onBreak && onBreak(condition)

        return
      }
    }
    setIsBroken(false)
    setBreakReason('')
  }, [state])

  const updateParam = (key, value) => {
    const newState = { ...state, [key]: value }
    setHistory([...history, { ...state, timestamp: Date.now() }])
    setState(newState)
  }

  const reset = () => {
    setState(initialState)
    setHistory([])
    setIsBroken(false)
  }

  return (
    <div
      className={`bg-neutral-950 border rounded-sm overflow-hidden transition-all duration-500 ${
        isBroken
          ? 'border-red-500 shadow-lg shadow-red-500/20'
          : 'border-orange-500/30'
      }`}>
      {/* Header */}
      <div
        className={`px-4 py-3 border-b transition-colors ${
          isBroken
            ? 'bg-red-500/10 border-red-500/30'
            : 'bg-black border-orange-500/20'
        }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${isBroken ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}
            />
            <span
              className={`text-sm font-mono ${isBroken ? 'text-red-500' : 'text-orange-500'}`}>
              BREAKPOINT ARENA
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono ${isBroken ? 'text-red-400' : 'text-green-400'}`}>
              {isBroken ? '⚠ SYSTEM FAILURE' : '● STABLE'}
            </span>
          </div>
        </div>
      </div>

      {/* Parameters */}
      <div className="p-6 space-y-4">
        {parameters.map(param => (
          <div key={param.key}>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-orange-500/60">{param.label}</span>
              <span className="text-orange-500">
                {state[param.key] || param.min}
                {param.unit}
              </span>
            </div>
            <input
              type="range"
              min={param.min}
              max={param.max}
              value={state[param.key] || param.min}
              onChange={e => updateParam(param.key, parseInt(e.target.value))}
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>
        ))}
      </div>

      {/* Break Alert */}
      {isBroken && (
        <div className="mx-6 mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded animate-pulse">
          <div className="flex items-start gap-3">
            <span className="text-red-500 text-2xl">💥</span>
            <div>
              <div className="text-red-400 font-mono text-sm font-bold">
                СБОЙ СИСТЕМЫ
              </div>
              <div className="text-red-400/80 text-sm mt-1">{breakReason}</div>
              <button
                onClick={() => setShowDiagnosis(!showDiagnosis)}
                className="text-red-400 text-xs font-mono mt-2 hover:text-red-300 flex items-center gap-1">
                <span>{showDiagnosis ? '▼' : '▶'}</span>
                <span>Диагностика</span>
              </button>
              {showDiagnosis && (
                <div className="mt-3 p-3 bg-black/50 rounded text-xs font-mono text-red-300">
                  <div>Что пошло не так?</div>
                  <ul className="mt-2 space-y-1 text-red-400/70">
                    <li>→ Проверь соотношение load / connections</li>
                    <li>→ Память достаточна для нагрузки?</li>
                    <li>→ Таймаут адекватен количеству соединений?</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* History Timeline */}
      {history.length > 0 && (
        <div className="px-6 pb-4">
          <div className="text-orange-500/40 text-xs font-mono mb-2">
            ИСТОРИЯ ИЗМЕНЕНИЙ
          </div>
          <div className="flex gap-1">
            {history.slice(-20).map((h, i) => (
              <div
                key={i}
                className={`w-2 h-8 rounded-sm ${
                  h.load > 80 || h.memory > 90
                    ? 'bg-red-500/50'
                    : 'bg-orange-500/30'
                }`}
                title={`Load: ${h.load}%, Memory: ${h.memory}MB`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-6 pb-6 flex gap-2">
        <button
          onClick={reset}
          className="flex-1 py-2 border border-orange-500/30 text-orange-500 font-mono text-sm hover:bg-orange-500/10 transition-colors">
          RESET
        </button>
        {isBroken && (
          <button
            onClick={() => onFix && onFix()}
            className="flex-1 py-2 bg-orange-500 text-black font-mono text-sm hover:bg-orange-400 transition-colors">
            ПОЧИНИТЬ →
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================
// 2. VARIANT TRIALS — варианты без ответа
// ============================================
const VariantTrials = ({ variants = [], onSelect, question = '' }) => {
  const [selected, setSelected] = useState(null)
  const [results, setResults] = useState({})
  const [showAnalysis, setShowAnalysis] = useState(false)

  const runVariant = variant => {
    setSelected(variant.id)
    // Simulate running the variant
    setTimeout(() => {
      setResults(prev => ({
        ...prev,
        [variant.id]: variant.outcome,
      }))
    }, 500)
    onSelect && onSelect(variant)
  }

  const testedCount = Object.keys(results).length

  return (
    <div className="bg-neutral-950 border border-orange-500/30 rounded-sm overflow-hidden">
      <div className="px-4 py-3 bg-black border-b border-orange-500/20">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 text-lg">⚔</span>
          <span className="text-orange-500 text-sm font-mono">
            VARIANT TRIALS
          </span>
        </div>
      </div>

      {question && (
        <div className="p-4 border-b border-orange-500/10">
          <p className="text-white text-lg">{question}</p>
          <p className="text-orange-500/50 text-xs font-mono mt-2">
            Протестируй варианты и найди закономерность
          </p>
        </div>
      )}

      <div className="p-4 grid grid-cols-2 gap-3">
        {variants.map(variant => (
          <div
            key={variant.id}
            onClick={() => runVariant(variant)}
            className={`
              p-4 border rounded cursor-pointer transition-all
              ${
                selected === variant.id
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-orange-500/20 hover:border-orange-500/50'
              }
            `}>
            <div className="flex items-start justify-between mb-2">
              <span className="text-orange-500 font-mono text-sm">
                {variant.label}
              </span>
              {results[variant.id] && (
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded ${
                    variant.outcome.success
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                  {variant.outcome.success ? 'OK' : 'PARTIAL'}
                </span>
              )}
            </div>
            <pre className="text-orange-300 text-xs font-mono bg-black/50 p-2 rounded overflow-x-auto">
              {variant.code}
            </pre>
            {results[variant.id] && (
              <div className="mt-3 pt-3 border-t border-orange-500/20">
                <div className="text-orange-500/60 text-xs font-mono mb-1">
                  РЕЗУЛЬТАТ:
                </div>
                <div className="text-white text-sm">
                  {variant.outcome.result}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Analysis */}
      {testedCount >= 2 && (
        <div className="px-4 pb-4">
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="w-full py-3 border border-dashed border-orange-500/30 text-orange-500 font-mono text-sm hover:bg-orange-500/5 transition-colors">
            {showAnalysis
              ? '▼ Скрыть анализ'
              : `▶ Проанализировать ${testedCount} варианта`}
          </button>
          {showAnalysis && (
            <div className="mt-3 p-4 bg-orange-500/5 border-l-2 border-orange-500">
              <div className="text-orange-500 font-mono text-sm mb-2">
                💡 ЧТО ТЫ ЗАМЕТИЛ?
              </div>
              <textarea
                placeholder="Запиши свои наблюдения..."
                className="w-full bg-black/50 border border-orange-500/20 p-3 text-white text-sm resize-none focus:outline-none focus:border-orange-500/50"
                rows={3}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// 3. PATTERN HUNTER — поиск закономерностей
// ============================================
const PatternHunter = ({ items = [], correctPattern = '', onSolve }) => {
  const [selected, setSelected] = useState([])
  const [guess, setGuess] = useState('')
  const [solved, setSolved] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const toggleItem = item => {
    if (selected.includes(item.id)) {
      setSelected(selected.filter(id => id !== item.id))
    } else {
      setSelected([...selected, item.id])
    }
  }

  const checkPattern = () => {
    setAttempts(prev => prev + 1)
    if (guess.toLowerCase().includes(correctPattern.toLowerCase())) {
      setSolved(true)
      onSolve && onSolve({ attempts: attempts + 1, guess })
    }
  }

  return (
    <div className="bg-neutral-950 border border-orange-500/30 rounded-sm overflow-hidden">
      <div className="px-4 py-3 bg-black border-b border-orange-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 text-lg">🔍</span>
          <span className="text-orange-500 text-sm font-mono">
            PATTERN HUNTER
          </span>
        </div>
        <div className="text-orange-500/60 text-xs font-mono">
          ВЫБРАНО: {selected.length} | ПОПЫТКИ: {attempts}
        </div>
      </div>

      <div className="p-4">
        <p className="text-orange-500/60 text-xs font-mono mb-4">
          Найди закономерность. Выбирай элементы, сравнивай, делай вывод.
        </p>

        {/* Items grid */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => toggleItem(item)}
              className={`
                aspect-square flex items-center justify-center text-xs font-mono
                border rounded cursor-pointer transition-all
                ${
                  selected.includes(item.id)
                    ? 'border-orange-500 bg-orange-500/20 text-orange-500'
                    : item.hasPattern
                      ? 'border-orange-500/30 text-orange-400 hover:border-orange-500/60'
                      : 'border-neutral-700 text-neutral-500 hover:border-neutral-600'
                }
              `}>
              {item.value}
            </div>
          ))}
        </div>

        {/* Selected items detail */}
        {selected.length > 0 && (
          <div className="p-3 bg-black/50 rounded mb-4">
            <div className="text-orange-500/60 text-xs font-mono mb-2">
              ВЫБРАННЫЕ:
            </div>
            <div className="flex flex-wrap gap-2">
              {selected.map(id => {
                const item = items.find(i => i.id === id)

                return (
                  <span
                    key={id}
                    className="px-2 py-1 bg-orange-500/20 text-orange-500 text-xs font-mono rounded">
                    {item?.value}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* Guess input */}
        {!solved ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={guess}
              onChange={e => setGuess(e.target.value)}
              placeholder="Какая закономерность?"
              className="flex-1 bg-black border border-orange-500/30 px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-orange-500"
            />
            <button
              onClick={checkPattern}
              disabled={!guess}
              className="px-6 py-2 bg-orange-500 text-black font-mono text-sm hover:bg-orange-400 disabled:opacity-50 transition-colors">
              ПРОВЕРИТЬ
            </button>
          </div>
        ) : (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded">
            <div className="flex items-center gap-2 text-green-400">
              <span className="text-xl">🎯</span>
              <span className="font-mono">ПАТТЕРН НАЙДЕН!</span>
            </div>
            <p className="text-green-400/80 text-sm mt-2">
              Ты разгадал закономерность за {attempts} попыток
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// 4. STRESS CHECK — стресс-тест решения
// ============================================
const StressCheck = ({ solution = '', tests = [], onComplete }) => {
  const [running, setRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState(0)
  const [results, setResults] = useState([])
  const [failed, setFailed] = useState(false)

  const runStressTest = async () => {
    setRunning(true)
    setResults([])
    setFailed(false)

    for (let i = 0; i < tests.length; i++) {
      setCurrentTest(i)
      await new Promise(r => setTimeout(r, 600))

      const passed = Math.random() > tests[i].failChance
      setResults(prev => [...prev, { ...tests[i], passed }])

      if (!passed) {
        setFailed(true)
        setRunning(false)

        return
      }
    }

    setRunning(false)
    onComplete && onComplete({ passed: true, results })
  }

  return (
    <div className="bg-neutral-950 border border-orange-500/30 rounded-sm overflow-hidden">
      <div className="px-4 py-3 bg-black border-b border-orange-500/20">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 text-lg">⚡</span>
          <span className="text-orange-500 text-sm font-mono">
            STRESS CHECK
          </span>
        </div>
      </div>

      <div className="p-4">
        {/* Test list */}
        <div className="space-y-2 mb-6">
          {tests.map((test, i) => {
            const result = results[i]
            const isActive = running && currentTest === i

            return (
              <div
                key={i}
                className={`
                  flex items-center justify-between p-3 border rounded transition-all
                  ${
                    isActive
                      ? 'border-orange-500 bg-orange-500/10'
                      : result
                        ? result.passed
                          ? 'border-green-500/50 bg-green-500/5'
                          : 'border-red-500/50 bg-red-500/5'
                        : 'border-neutral-800'
                  }
                `}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono ${
                      result
                        ? result.passed
                          ? 'border-green-500 text-green-500'
                          : 'border-red-500 text-red-500'
                        : isActive
                          ? 'border-orange-500 text-orange-500 animate-pulse'
                          : 'border-neutral-600 text-neutral-600'
                    }`}>
                    {result ? (result.passed ? '✓' : '✗') : i + 1}
                  </div>
                  <div>
                    <div
                      className={`text-sm font-mono ${
                        result
                          ? result.passed
                            ? 'text-green-400'
                            : 'text-red-400'
                          : isActive
                            ? 'text-orange-500'
                            : 'text-neutral-400'
                      }`}>
                      {test.name}
                    </div>
                    <div className="text-xs text-neutral-600">
                      {test.description}
                    </div>
                  </div>
                </div>
                {isActive && (
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                    <div
                      className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Failed state */}
        {failed && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded mb-4">
            <div className="text-red-400 font-mono text-sm mb-2">
              💥 РЕШЕНИЕ СЛОМАЛОСЬ
            </div>
            <p className="text-red-400/70 text-sm">
              {results[results.length - 1]?.failReason ||
                'Система не выдержала нагрузку'}
            </p>
            <button
              onClick={() => {
                setFailed(false)
                setResults([])
              }}
              className="mt-3 text-red-400 text-xs font-mono hover:text-red-300">
              → Попробовать снова
            </button>
          </div>
        )}

        {/* Run button */}
        {!running && !failed && (
          <button
            onClick={runStressTest}
            className="w-full py-3 bg-orange-500 text-black font-mono text-sm hover:bg-orange-400 transition-colors">
            ЗАПУСТИТЬ СТРЕСС-ТЕСТ
          </button>
        )}

        {/* Progress */}
        {running && (
          <div className="text-center">
            <div className="text-orange-500 font-mono text-sm">
              Тест {currentTest + 1} / {tests.length}
            </div>
            <div className="w-full h-1 bg-neutral-800 rounded mt-2">
              <div
                className="h-full bg-orange-500 rounded transition-all duration-300"
                style={{
                  width: `${((currentTest + 1) / tests.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// 5. FORKING PATH — разветвлённый путь
// ============================================
const ForkingPath = ({ paths = [], currentPath = [], onChoice }) => {
  const [history, setHistory] = useState(currentPath)
  const [currentNode, setCurrentNode] = useState(paths[0])

  const makeChoice = choice => {
    const newHistory = [...history, choice]
    setHistory(newHistory)

    const nextNode = paths.find(p => p.id === choice.next)
    if (nextNode) {
      setCurrentNode(nextNode)
    }

    onChoice && onChoice({ choice, history: newHistory, currentNode: nextNode })
  }

  return (
    <div className="bg-neutral-950 border border-orange-500/30 rounded-sm overflow-hidden">
      <div className="px-4 py-3 bg-black border-b border-orange-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-orange-500 text-lg">⑂</span>
            <span className="text-orange-500 text-sm font-mono">
              FORKING PATH
            </span>
          </div>
          <div className="text-orange-500/40 text-xs font-mono">
            ШАГ {history.length + 1}
          </div>
        </div>
      </div>

      {/* Path visualization */}
      {history.length > 0 && (
        <div className="px-4 pt-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {history.map((h, i) => (
              <React.Fragment key={i}>
                <div className="px-2 py-1 bg-orange-500/20 text-orange-500 text-xs font-mono rounded whitespace-nowrap">
                  {h.label}
                </div>
                {i < history.length - 1 && (
                  <span className="text-orange-500/40">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Current node */}
      <div className="p-6">
        <div className="text-white text-lg mb-2">{currentNode?.title}</div>
        <p className="text-orange-500/70 text-sm mb-6">
          {currentNode?.description}
        </p>

        {/* Choices */}
        {currentNode?.choices && (
          <div className="space-y-2">
            {currentNode.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => makeChoice(choice)}
                className="w-full p-4 border border-orange-500/30 text-left hover:border-orange-500 hover:bg-orange-500/5 transition-all group">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-orange-500 font-mono text-sm">
                      {choice.label}
                    </div>
                    {choice.hint && (
                      <div className="text-orange-500/40 text-xs mt-1">
                        {choice.hint}
                      </div>
                    )}
                  </div>
                  <span className="text-orange-500/40 group-hover:text-orange-500 transition-colors">
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* End state */}
        {currentNode?.isEnd && (
          <div className="p-4 bg-orange-500/10 border-l-2 border-orange-500">
            <div className="text-orange-500 font-mono text-sm mb-2">
              🏁 ПУТЬ ЗАВЕРШЁН
            </div>
            <p className="text-white text-sm">{currentNode.conclusion}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// 6. DEAD-END DETECTOR — ложный путь
// ============================================
const DeadEndDetector = ({ scenario = {}, onDeadEnd, onInsight }) => {
  const [step, setStep] = useState(0)
  const [isDeadEnd, setIsDeadEnd] = useState(false)
  const [showInsight, setShowInsight] = useState(false)

  const steps = scenario.steps || []
  const currentStep = steps[step]

  const proceed = () => {
    if (currentStep?.isDeadEnd) {
      setIsDeadEnd(true)
      onDeadEnd && onDeadEnd(currentStep)
    } else if (step < steps.length - 1) {
      setStep(step + 1)
    }
  }

  const revealInsight = () => {
    setShowInsight(true)
    onInsight && onInsight(currentStep?.insight)
  }

  return (
    <div
      className={`bg-neutral-950 border rounded-sm overflow-hidden transition-all ${
        isDeadEnd ? 'border-yellow-500/50' : 'border-orange-500/30'
      }`}>
      <div
        className={`px-4 py-3 border-b ${
          isDeadEnd
            ? 'bg-yellow-500/10 border-yellow-500/20'
            : 'bg-black border-orange-500/20'
        }`}>
        <div className="flex items-center gap-2">
          <span
            className={`text-lg ${isDeadEnd ? 'text-yellow-500' : 'text-orange-500'}`}>
            {isDeadEnd ? '🚧' : '🛤'}
          </span>
          <span
            className={`text-sm font-mono ${isDeadEnd ? 'text-yellow-500' : 'text-orange-500'}`}>
            {isDeadEnd ? 'DEAD END' : 'PATH EXPLORER'}
          </span>
        </div>
      </div>

      <div className="p-6">
        {!isDeadEnd ? (
          <>
            <div className="text-orange-500/60 text-xs font-mono mb-2">
              ШАГ {step + 1} / {steps.length}
            </div>
            <div className="text-white text-lg mb-4">{currentStep?.title}</div>
            <p className="text-orange-500/70 text-sm mb-6">
              {currentStep?.description}
            </p>

            <button
              onClick={proceed}
              className="w-full py-3 bg-orange-500 text-black font-mono text-sm hover:bg-orange-400 transition-colors">
              Продолжить →
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded">
              <div className="text-yellow-400 font-mono text-lg mb-2">
                ⚠ ТУПИК
              </div>
              <p className="text-yellow-400/80 text-sm">
                {currentStep?.deadEndMessage}
              </p>
            </div>

            {!showInsight ? (
              <button
                onClick={revealInsight}
                className="w-full py-3 border border-yellow-500/50 text-yellow-500 font-mono text-sm hover:bg-yellow-500/10 transition-colors">
                💡 Почему это тупик?
              </button>
            ) : (
              <div className="p-4 bg-orange-500/10 border-l-2 border-orange-500">
                <div className="text-orange-500 font-mono text-sm mb-2">
                  ИНСАЙТ
                </div>
                <p className="text-white text-sm">{currentStep?.insight}</p>
                <button
                  onClick={() => {
                    setIsDeadEnd(false)
                    setStep(0)
                    setShowInsight(false)
                  }}
                  className="mt-4 text-orange-500 text-xs font-mono hover:text-orange-400">
                  → Начать заново с этим знанием
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// 7. MODEL BUILDER — конструктор моделей
// ============================================
const ModelBuilder = ({ components = [], connections = [], onBuild }) => {
  const [placed, setPlaced] = useState([])
  const [links, setLinks] = useState([])
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [linkMode, setLinkMode] = useState(false)
  const [linkStart, setLinkStart] = useState(null)

  const placeComponent = comp => {
    if (!placed.find(p => p.id === comp.id)) {
      setPlaced([
        ...placed,
        {
          ...comp,
          x: 50 + (placed.length % 3) * 100,
          y: 50 + Math.floor(placed.length / 3) * 80,
        },
      ])
    }
  }

  const startLink = comp => {
    if (linkMode) {
      if (linkStart) {
        if (linkStart.id !== comp.id) {
          setLinks([...links, { from: linkStart.id, to: comp.id }])
        }
        setLinkStart(null)
        setLinkMode(false)
      } else {
        setLinkStart(comp)
      }
    }
  }

  const validateModel = () => {
    // Check if all required connections exist
    const isValid = connections.every(req =>
      links.some(
        link =>
          (link.from === req.from && link.to === req.to) ||
          (link.from === req.to && link.to === req.from),
      ),
    )
    onBuild && onBuild({ placed, links, isValid })
  }

  return (
    <div className="bg-neutral-950 border border-orange-500/30 rounded-sm overflow-hidden">
      <div className="px-4 py-3 bg-black border-b border-orange-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 text-lg">🔧</span>
          <span className="text-orange-500 text-sm font-mono">
            MODEL BUILDER
          </span>
        </div>
        <button
          onClick={() => setLinkMode(!linkMode)}
          className={`px-3 py-1 text-xs font-mono border transition-colors ${
            linkMode
              ? 'border-orange-500 bg-orange-500/20 text-orange-500'
              : 'border-orange-500/30 text-orange-500/60'
          }`}>
          {linkMode ? '🔗 LINKING...' : '🔗 LINK MODE'}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 p-4 border-b border-orange-500/10">
        {components.map(comp => (
          <div
            key={comp.id}
            onClick={() => placeComponent(comp)}
            className={`p-2 border rounded text-center cursor-pointer transition-all ${
              placed.find(p => p.id === comp.id)
                ? 'border-green-500/50 bg-green-500/10 text-green-500'
                : 'border-orange-500/30 text-orange-500 hover:border-orange-500/60'
            }`}>
            <div className="text-lg">{comp.icon}</div>
            <div className="text-xs font-mono mt-1">{comp.name}</div>
          </div>
        ))}
      </div>

      {/* Canvas */}
      <div className="relative h-64 bg-black/50 m-4 rounded border border-orange-500/10 overflow-hidden">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle, #ff6100 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Links */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {links.map((link, i) => {
            const from = placed.find(p => p.id === link.from)
            const to = placed.find(p => p.id === link.to)
            if (!from || !to) {
              return null
            }

            return (
              <line
                key={i}
                x1={from.x + 30}
                y1={from.y + 25}
                x2={to.x + 30}
                y2={to.y + 25}
                stroke="#ff6100"
                strokeWidth={2}
                strokeDasharray="5,5"
              />
            )
          })}
        </svg>

        {/* Placed components */}
        {placed.map(comp => (
          <div
            key={comp.id}
            onClick={() => startLink(comp)}
            className={`absolute w-16 h-14 border rounded flex flex-col items-center justify-center cursor-pointer transition-all ${
              linkStart?.id === comp.id
                ? 'border-orange-500 bg-orange-500/30'
                : 'border-orange-500/50 bg-neutral-900 hover:border-orange-500'
            }`}
            style={{ left: comp.x, top: comp.y }}>
            <div className="text-xl">{comp.icon}</div>
            <div className="text-orange-500 text-xs font-mono">{comp.name}</div>
          </div>
        ))}

        {placed.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-orange-500/30 font-mono text-sm">
            Добавь компоненты сверху
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={() => {
            setPlaced([])
            setLinks([])
          }}
          className="flex-1 py-2 border border-orange-500/30 text-orange-500 font-mono text-sm hover:bg-orange-500/10 transition-colors">
          ОЧИСТИТЬ
        </button>
        <button
          onClick={validateModel}
          disabled={placed.length < 2}
          className="flex-1 py-2 bg-orange-500 text-black font-mono text-sm hover:bg-orange-400 disabled:opacity-50 transition-colors">
          ПРОВЕРИТЬ МОДЕЛЬ
        </button>
      </div>
    </div>
  )
}

// ============================================
// 8. STRESS-FREE SANDBOX — песочница
// ============================================
const Sandbox = ({ initialState = {}, parameters = [], visualizer }) => {
  const [state, setState] = useState(initialState)
  const [history, setHistory] = useState([initialState])

  const updateParam = (key, value) => {
    const newState = { ...state, [key]: value }
    setState(newState)
    setHistory([...history, newState])
  }

  const reset = () => {
    setState(initialState)
    setHistory([initialState])
  }

  const undo = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1)
      setHistory(newHistory)
      setState(newHistory[newHistory.length - 1])
    }
  }

  return (
    <div className="bg-neutral-950 border border-orange-500/30 rounded-sm overflow-hidden">
      <div className="px-4 py-3 bg-gradient-to-r from-orange-500/10 to-transparent border-b border-orange-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-orange-500 text-lg">🎮</span>
            <span className="text-orange-500 text-sm font-mono">SANDBOX</span>
            <span className="text-green-500/60 text-xs font-mono ml-2">
              // БЕЗ ОЦЕНКИ
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={undo}
              disabled={history.length <= 1}
              className="px-2 py-1 text-xs font-mono text-orange-500/60 hover:text-orange-500 disabled:opacity-30">
              ↩ UNDO
            </button>
            <button
              onClick={reset}
              className="px-2 py-1 text-xs font-mono text-orange-500/60 hover:text-orange-500">
              ↺ RESET
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4">
        {/* Controls */}
        <div className="space-y-4">
          {parameters.map(param => (
            <div key={param.key}>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-orange-500/60">{param.label}</span>
                <span className="text-orange-500">
                  {state[param.key]}
                  {param.unit}
                </span>
              </div>
              {param.type === 'range' ? (
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step || 1}
                  value={state[param.key]}
                  onChange={e =>
                    updateParam(param.key, parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              ) : param.type === 'toggle' ? (
                <button
                  onClick={() => updateParam(param.key, !state[param.key])}
                  className={`w-full py-2 border font-mono text-sm transition-colors ${
                    state[param.key]
                      ? 'border-orange-500 bg-orange-500/20 text-orange-500'
                      : 'border-neutral-700 text-neutral-500'
                  }`}>
                  {state[param.key] ? 'ON' : 'OFF'}
                </button>
              ) : null}
            </div>
          ))}
        </div>

        {/* Visualization */}
        <div className="bg-black/50 rounded p-4 flex items-center justify-center min-h-[200px]">
          {visualizer ? (
            visualizer(state)
          ) : (
            <div className="text-center">
              <div className="text-orange-500 text-4xl mb-2">
                {Math.round((state.x || 0) * (state.y || 1))}
              </div>
              <div className="text-orange-500/40 text-xs font-mono">OUTPUT</div>
            </div>
          )}
        </div>
      </div>

      {/* History mini-chart */}
      <div className="px-4 pb-4">
        <div className="text-orange-500/40 text-xs font-mono mb-2">
          ИСТОРИЯ ({history.length})
        </div>
        <div className="flex gap-0.5 h-8">
          {history.slice(-30).map((h, i) => {
            const value = Object.values(h).reduce(
              (a, b) => a + (typeof b === 'number' ? b : 0),
              0,
            )
            const height = Math.min(100, Math.max(10, value / 2))

            return (
              <div
                key={i}
                className="flex-1 bg-orange-500/30 rounded-t"
                style={{ height: `${height}%`, alignSelf: 'flex-end' }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============================================
// 9. PRESTIGE WALL — стена достижений
// ============================================
const PrestigeWall = ({ insights = [], achievements = [] }) => {
  const [selectedInsight, setSelectedInsight] = useState(null)

  const categories = {
    understanding: { icon: '💡', label: 'ПОНИМАНИЕ', color: 'orange' },
    building: { icon: '🏗', label: 'СОЗДАНИЕ', color: 'blue' },
    discovery: { icon: '🔍', label: 'ОТКРЫТИЕ', color: 'green' },
    mastery: { icon: '⚔', label: 'МАСТЕРСТВО', color: 'purple' },
  }

  return (
    <div className="bg-neutral-950 border border-orange-500/30 rounded-sm overflow-hidden">
      <div className="px-4 py-3 bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-transparent border-b border-orange-500/20">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 text-lg">🏆</span>
          <span className="text-orange-500 text-sm font-mono">
            PRESTIGE WALL
          </span>
        </div>
      </div>

      {/* Insights grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {insights.map((insight, i) => {
            const cat = categories[insight.category] || categories.understanding

            return (
              <div
                key={i}
                onClick={() =>
                  setSelectedInsight(selectedInsight === i ? null : i)
                }
                className={`
                  p-4 border rounded cursor-pointer transition-all
                  ${
                    selectedInsight === i
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-orange-500/20 hover:border-orange-500/40'
                  }
                `}>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{cat.icon}</div>
                  <div className="flex-1">
                    <div className="text-orange-500/60 text-xs font-mono">
                      {cat.label}
                    </div>
                    <div className="text-white text-sm mt-1">
                      {insight.title}
                    </div>
                    {selectedInsight === i && (
                      <p className="text-orange-500/70 text-xs mt-2">
                        {insight.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-orange-500/30 text-xs font-mono mt-2">
                  {insight.date}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Achievement badges */}
      {achievements.length > 0 && (
        <div className="px-4 pb-4 pt-2 border-t border-orange-500/10">
          <div className="text-orange-500/40 text-xs font-mono mb-3">
            ДОСТИЖЕНИЯ
          </div>
          <div className="flex gap-2 flex-wrap">
            {achievements.map((ach, i) => (
              <div
                key={i}
                className="px-3 py-2 bg-orange-500/10 border border-orange-500/30 rounded flex items-center gap-2"
                title={ach.description}>
                <span>{ach.icon}</span>
                <span className="text-orange-500 text-xs font-mono">
                  {ach.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="px-4 pb-4 flex justify-around text-center">
        <div>
          <div className="text-orange-500 text-2xl font-bold">
            {insights.length}
          </div>
          <div className="text-orange-500/40 text-xs font-mono">ИНСАЙТОВ</div>
        </div>
        <div>
          <div className="text-orange-500 text-2xl font-bold">
            {achievements.length}
          </div>
          <div className="text-orange-500/40 text-xs font-mono">ДОСТИЖЕНИЙ</div>
        </div>
        <div>
          <div className="text-orange-500 text-2xl font-bold">
            {insights.filter(i => i.category === 'mastery').length}
          </div>
          <div className="text-orange-500/40 text-xs font-mono">МАСТЕРСТВО</div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// 10. TRANSFER GATE — перенос в другую область
// ============================================
const TransferGate = ({
  originalDomain = {},
  targetDomain = {},
  principle = '',
  onTransfer,
}) => {
  const [step, setStep] = useState(0)
  const [userMapping, setUserMapping] = useState('')
  const [transferred, setTransferred] = useState(false)

  const steps = [
    { id: 'original', label: 'Исходная область' },
    { id: 'principle', label: 'Принцип' },
    { id: 'transfer', label: 'Перенос' },
    { id: 'apply', label: 'Применение' },
  ]

  const completeTransfer = () => {
    setTransferred(true)
    onTransfer && onTransfer({ originalDomain, targetDomain, userMapping })
  }

  return (
    <div className="bg-neutral-950 border border-orange-500/30 rounded-sm overflow-hidden">
      <div className="px-4 py-3 bg-black border-b border-orange-500/20">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 text-lg">🌉</span>
          <span className="text-orange-500 text-sm font-mono">
            TRANSFER GATE
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 pt-4">
        <div className="flex justify-between">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-mono ${
                  i <= step
                    ? 'border-orange-500 bg-orange-500/20 text-orange-500'
                    : 'border-neutral-700 text-neutral-600'
                }`}>
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 ${i < step ? 'bg-orange-500' : 'bg-neutral-700'}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        {step === 0 && (
          <div>
            <div className="text-orange-500/60 text-xs font-mono mb-2">
              ИСХОДНАЯ ОБЛАСТЬ: {originalDomain.name}
            </div>
            <div className="p-4 bg-orange-500/5 border-l-2 border-orange-500 mb-4">
              <p className="text-white">{originalDomain.example}</p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="w-full py-3 bg-orange-500 text-black font-mono text-sm">
              ВЫДЕЛИТЬ ПРИНЦИП →
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="text-orange-500/60 text-xs font-mono mb-2">
              УНИВЕРСАЛЬНЫЙ ПРИНЦИП
            </div>
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded mb-4 text-center">
              <p className="text-orange-500 text-lg font-mono">"{principle}"</p>
            </div>
            <p className="text-orange-500/60 text-sm mb-4">
              Этот принцип работает не только в {originalDomain.name}...
            </p>
            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-orange-500 text-black font-mono text-sm">
              ПЕРЕНЕСТИ В НОВУЮ ОБЛАСТЬ →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 border border-orange-500/30 rounded">
                <div className="text-orange-500/60 text-xs font-mono mb-2">
                  {originalDomain.name}
                </div>
                <div className="text-white text-sm">
                  {originalDomain.concept}
                </div>
              </div>
              <div className="p-4 border border-orange-500/30 rounded bg-orange-500/5">
                <div className="text-orange-500/60 text-xs font-mono mb-2">
                  {targetDomain.name}
                </div>
                <div className="text-orange-500 text-sm">?</div>
              </div>
            </div>
            <div className="text-orange-500/60 text-xs font-mono mb-2">
              КАК ПРИНЦИП ПРИМЕНЯЕТСЯ В {targetDomain.name}?
            </div>
            <textarea
              value={userMapping}
              onChange={e => setUserMapping(e.target.value)}
              placeholder="Опиши аналогию..."
              className="w-full bg-black border border-orange-500/30 p-3 text-white text-sm resize-none focus:outline-none focus:border-orange-500 mb-4"
              rows={3}
            />
            <button
              onClick={() => setStep(3)}
              disabled={!userMapping}
              className="w-full py-3 bg-orange-500 text-black font-mono text-sm disabled:opacity-50">
              ПРОВЕРИТЬ ПЕРЕНОС →
            </button>
          </div>
        )}

        {step === 3 && !transferred && (
          <div>
            <div className="text-orange-500/60 text-xs font-mono mb-2">
              ТВОЙ ПЕРЕНОС
            </div>
            <div className="p-4 bg-orange-500/10 border-l-2 border-orange-500 mb-4">
              <p className="text-white">{userMapping}</p>
            </div>
            <div className="p-4 border border-orange-500/30 rounded mb-4">
              <div className="text-orange-500/60 text-xs font-mono mb-2">
                ЭТАЛОННЫЙ ОТВЕТ
              </div>
              <p className="text-orange-500/80 text-sm">
                {targetDomain.example}
              </p>
            </div>
            <button
              onClick={completeTransfer}
              className="w-full py-3 bg-orange-500 text-black font-mono text-sm">
              ЗАВЕРШИТЬ ТРАНСФЕР ✓
            </button>
          </div>
        )}

        {transferred && (
          <div className="text-center">
            <div className="text-4xl mb-4">🌉</div>
            <div className="text-orange-500 font-mono text-lg mb-2">
              ТРАНСФЕР ЗАВЕРШЁН
            </div>
            <p className="text-orange-500/60 text-sm">
              Ты перенёс принцип из {originalDomain.name} в {targetDomain.name}
            </p>
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded">
              <span className="text-green-400 text-sm font-mono">
                +1 МЕТАНАВЫК: Трансфер знаний
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// MAIN DEMO
// ============================================
export const AdvancedThinkingArena = () => {
  // Demo data
  const breakConditions = [
    {
      check: s => s.load > 80 && s.connections > 500,
      reason: 'Слишком много соединений при высокой нагрузке',
    },
    {
      check: s => s.memory < 20 && s.load > 50,
      reason: 'Недостаточно памяти для текущей нагрузки',
    },
    {
      check: s => s.timeout < 500 && s.connections > 200,
      reason: 'Таймаут слишком мал для количества соединений',
    },
  ]

  const variants = [
    {
      id: 1,
      label: 'Вариант A',
      code: 'arr.filter(x => x > 0)',
      outcome: { success: true,
result: 'O(n), создаёт новый массив' },
    },
    {
      id: 2,
      label: 'Вариант B',
      code: 'arr.forEach((x,i) => {\n  if(x <= 0) arr.splice(i,1)\n})',
      outcome: { success: false,
result: 'Баг! Пропускает элементы' },
    },
    {
      id: 3,
      label: 'Вариант C',
      code: 'for(let i=arr.length-1; i>=0; i--) {\n  if(arr[i] <= 0) arr.splice(i,1)\n}',
      outcome: { success: true,
result: 'O(n²), но работает корректно' },
    },
    {
      id: 4,
      label: 'Вариант D',
      code: 'arr.reduce((a,x) => x > 0 ? [...a,x] : a, [])',
      outcome: { success: true,
result: 'O(n), функциональный стиль' },
    },
  ]

  const patternItems = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    value: (i + 1) * (i % 3 === 0 ? 2 : 1),
    hasPattern: i % 3 === 0,
  }))

  const stressTests = [
    { name: '10 запросов', description: 'Базовая нагрузка', failChance: 0.1 },
    { name: '100 запросов', description: 'Средняя нагрузка', failChance: 0.2 },
    {
      name: '1000 запросов',
      description: 'Высокая нагрузка',
      failChance: 0.4,
      failReason: 'Memory overflow при 1000+ запросах',
    },
    { name: 'Spike test', description: 'Резкий всплеск', failChance: 0.5 },
  ]

  const forkPaths = [
    {
      id: 'start',
      title: 'Оптимизация запроса',
      description: 'База данных работает медленно. Что будешь делать?',
      choices: [
        {
          label: 'Добавить индекс',
          hint: 'Классический подход',
          next: 'index',
        },
        {
          label: 'Кэшировать результат',
          hint: 'Быстрое решение',
          next: 'cache',
        },
        {
          label: 'Денормализовать данные',
          hint: 'Радикальный подход',
          next: 'denorm',
        },
      ],
    },
    {
      id: 'index',
      title: 'Индексация',
      description: 'Индекс создан. Запрос ускорился в 10 раз.',
      choices: [
        { label: 'Отлично, готово', next: 'end_good' },
        { label: 'А если данные изменятся?', next: 'index_update' },
      ],
    },
    {
      id: 'cache',
      title: 'Кэширование',
      description: 'Кэш работает, но...',
      choices: [{ label: 'Данные устарели!',
next: 'cache_stale' }],
    },
    {
      id: 'end_good',
      isEnd: true,
      title: 'Успех!',
      conclusion: 'Индексация — правильный выбор для этого случая.',
    },
  ]

  const deadEndScenario = {
    steps: [
      {
        title: 'Ускорить приложение',
        description: 'Пользователи жалуются на медленную загрузку.',
      },
      {
        title: 'Добавить больше серверов',
        description: 'Логично: больше мощности = быстрее работа.',
      },
      {
        title: 'Масштабирование',
        description: 'Добавляем ещё 5 серверов...',
        isDeadEnd: true,
        deadEndMessage:
          'Проблема не в мощности. Узкое место — база данных, которая одна для всех серверов.',
        insight:
          'Горизонтальное масштабирование не помогает, если bottleneck в другом месте. Сначала найди узкое место, потом масштабируй.',
      },
    ],
  }

  const modelComponents = [
    { id: 'api', name: 'API', icon: '🔌' },
    { id: 'db', name: 'DB', icon: '🗄' },
    { id: 'cache', name: 'Cache', icon: '⚡' },
    { id: 'queue', name: 'Queue', icon: '📬' },
    { id: 'worker', name: 'Worker', icon: '⚙' },
    { id: 'lb', name: 'LB', icon: '⚖' },
  ]

  const sandboxParams = [
    {
      key: 'x',
      label: 'Параметр X',
      type: 'range',
      min: 0,
      max: 100,
      unit: '',
    },
    { key: 'y', label: 'Параметр Y', type: 'range', min: 1, max: 10, unit: '' },
    { key: 'enabled', label: 'Активировать', type: 'toggle' },
  ]

  const prestigeInsights = [
    {
      category: 'understanding',
      title: 'Понял разницу O(n) и O(n²)',
      description: 'Квадратичная сложность убивает производительность',
      date: '2 дня назад',
    },
    {
      category: 'building',
      title: 'Построил кэширующий слой',
      description: 'Первый самостоятельный архитектурный компонент',
      date: '5 дней назад',
    },
    {
      category: 'discovery',
      title: 'Обнаружил race condition',
      description: 'Нашёл баг, который проявлялся только под нагрузкой',
      date: '1 неделю назад',
    },
    {
      category: 'mastery',
      title: 'Оптимизировал запрос в 100 раз',
      description: 'От 2 секунд до 20мс',
      date: '2 недели назад',
    },
  ]

  const prestigeAchievements = [
    { icon: '🔥', name: 'First Blood', description: 'Первый сломанный тест' },
    { icon: '🏗', name: 'Architect', description: 'Построил 5 моделей' },
    { icon: '🎯', name: 'Pattern Master', description: 'Нашёл 10 паттернов' },
  ]

  const transferData = {
    originalDomain: {
      name: 'React',
      concept: 'Virtual DOM',
      example:
        'React не обновляет весь DOM, а сравнивает виртуальное дерево с реальным и применяет минимальные изменения.',
    },
    targetDomain: {
      name: 'Бизнес',
      concept: '?',
      example:
        'Не переделывай весь процесс — найди минимальные изменения, которые дадут максимальный эффект.',
    },
    principle: 'Минимальные изменения для максимального эффекта',
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-orange-500 font-mono tracking-widest">
              THINKING ARENA
            </span>
            <span className="text-orange-500/40 font-mono">v2.0</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Advanced Blocks</h1>
          <p className="text-neutral-400">
            Когнитивные цепочки в стиле Guild Wars 2
          </p>
        </div>

        <div className="space-y-12">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="text-orange-500/60 text-xs font-mono mb-2">
                01 // BREAKPOINT ARENA
              </div>
              <BreakpointArena
                initialState={{
                  load: 30,
                  memory: 60,
                  connections: 100,
                  timeout: 2000,
                }}
                breakConditions={breakConditions}
              />
            </div>
            <div>
              <div className="text-orange-500/60 text-xs font-mono mb-2">
                02 // VARIANT TRIALS
              </div>
              <VariantTrials
                question="Как удалить отрицательные числа из массива?"
                variants={variants}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="text-orange-500/60 text-xs font-mono mb-2">
                03 // PATTERN HUNTER
              </div>
              <PatternHunter items={patternItems} correctPattern="кратные 3" />
            </div>
            <div>
              <div className="text-orange-500/60 text-xs font-mono mb-2">
                04 // STRESS CHECK
              </div>
              <StressCheck tests={stressTests} />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="text-orange-500/60 text-xs font-mono mb-2">
                05 // FORKING PATH
              </div>
              <ForkingPath paths={forkPaths} />
            </div>
            <div>
              <div className="text-orange-500/60 text-xs font-mono mb-2">
                06 // DEAD-END DETECTOR
              </div>
              <DeadEndDetector scenario={deadEndScenario} />
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="text-orange-500/60 text-xs font-mono mb-2">
                07 // MODEL BUILDER
              </div>
              <ModelBuilder components={modelComponents} />
            </div>
            <div>
              <div className="text-orange-500/60 text-xs font-mono mb-2">
                08 // SANDBOX
              </div>
              <Sandbox
                initialState={{ x: 50, y: 5, enabled: false }}
                parameters={sandboxParams}
              />
            </div>
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="text-orange-500/60 text-xs font-mono mb-2">
                09 // PRESTIGE WALL
              </div>
              <PrestigeWall
                insights={prestigeInsights}
                achievements={prestigeAchievements}
              />
            </div>
            <div>
              <div className="text-orange-500/60 text-xs font-mono mb-2">
                10 // TRANSFER GATE
              </div>
              <TransferGate {...transferData} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-orange-500/20 text-center">
          <div className="text-orange-500 font-mono text-sm">
            THINKING ARENA — ADVANCED
          </div>
          <div className="text-neutral-600 text-xs mt-1">
            Деградация → Разрыв → Поиск → Модель → Применение → Метасдвиг
          </div>
        </div>
      </div>
    </div>
  )
}
