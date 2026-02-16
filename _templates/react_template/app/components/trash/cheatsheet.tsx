import React, { useState, useEffect } from 'react'

// ============================================
// CHEATSHEET — Шпаргалка в стиле "Трамп-кейс"
// ============================================
const Cheatsheet = ({
  // Заголовок
  title = 'Твой новый навык',
  subtitle = '',

  // Блок 1: Суть инсайта
  insight = {
    condition: 'Если у тебя A',
    action: 'делай B',
    reason: 'И вот почему',
  },

  // Блок 2: Мини-схема
  schema = {
    problem: 'Проблема',
    mistake: 'Ошибка',
    principle: 'Принцип',
    solution: 'Решение',
  },

  // Блок 3: До/После
  beforeAfter = {
    before: { label: 'Делал так', example: '' },
    after: { label: 'Теперь так', example: '' },
  },

  // Блок 4: Ошибки
  mistakes = {
    dontDo: '',
    dontBelieve: '',
    dontConfuse: '',
  },

  // Блок 5: Мгновенное применение
  instantApply = {
    context: 'Посмотри на код',
    question: 'И задай один вопрос',
  },

  // Блок 6: Маркер-принцип
  principleMarker = '',

  // Тема/Категория
  category = 'SKILL',

  // Уникальный ID для сохранения
  id = 'cheatsheet-1',
}) => {
  const [isRevealed, setIsRevealed] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [activeSection, setActiveSection] = useState(null)

  // Reveal animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 100)

    return () => clearTimeout(timer)
  }, [])

  const saveToCollection = () => {
    setIsSaved(true)
    // In production: save to localStorage or API
  }

  return (
    <div
      className={`
      bg-neutral-950 border border-orange-500/30 rounded-sm overflow-hidden
      transition-all duration-700 transform
      ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
    `}>
      {/* ========== HEADER — Властный заголовок ========== */}
      <div className="relative px-6 py-8 bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent border-b border-orange-500/20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-orange-500/60 text-xs font-mono tracking-widest">
              {category}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white tracking-wide mb-2">
            {title}
          </h1>

          {subtitle && <p className="text-orange-500/70 text-sm">{subtitle}</p>}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* ========== БЛОК 1: Суть инсайта ========== */}
        <div
          className={`
            p-6 bg-black border-l-4 border-orange-500 
            transition-all duration-300 cursor-pointer
            ${activeSection === 'insight' ? 'bg-orange-500/5' : 'hover:bg-orange-500/5'}
          `}
          onClick={() =>
            setActiveSection(activeSection === 'insight' ? null : 'insight')
          }>
          <div className="text-orange-500/40 text-xs font-mono mb-3">СУТЬ</div>
          <p className="text-xl text-white leading-relaxed">
            <span className="text-orange-400">{insight.condition}</span>
            <span className="text-white"> — </span>
            <span className="text-white font-bold">{insight.action}</span>
            <span className="text-orange-500/60">.</span>
          </p>
          {insight.reason && (
            <p className="text-orange-500/70 text-sm mt-3 italic">
              {insight.reason}
            </p>
          )}
        </div>

        {/* ========== БЛОК 2: Мини-схема ========== */}
        <div
          className={`
            transition-all duration-300 cursor-pointer
            ${activeSection === 'schema' ? 'bg-orange-500/5 rounded' : ''}
          `}
          onClick={() =>
            setActiveSection(activeSection === 'schema' ? null : 'schema')
          }>
          <div className="text-orange-500/40 text-xs font-mono mb-4">
            КОГНИТИВНАЯ ПЕТЛЯ
          </div>

          <div className="relative flex items-center justify-between">
            {/* Schema nodes */}
            {[
              { key: 'problem', icon: '⚡', color: 'red' },
              { key: 'mistake', icon: '✗', color: 'yellow' },
              { key: 'principle', icon: '◈', color: 'orange' },
              { key: 'solution', icon: '✓', color: 'green' },
            ].map((node, i, arr) => (
              <React.Fragment key={node.key}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`
                    w-14 h-14 rounded-full border-2 flex items-center justify-center mb-2
                    transition-all duration-300
                    ${
                      node.color === 'red'
                        ? 'border-red-500/50 text-red-400'
                        : node.color === 'yellow'
                          ? 'border-yellow-500/50 text-yellow-400'
                          : node.color === 'orange'
                            ? 'border-orange-500 text-orange-500'
                            : 'border-green-500/50 text-green-400'
                    }
                    ${activeSection === 'schema' ? 'scale-110' : ''}
                  `}>
                    <span className="text-xl">{node.icon}</span>
                  </div>
                  <div
                    className={`
                    text-xs font-mono text-center px-2 py-1 rounded
                    ${
                      node.color === 'red'
                        ? 'text-red-400'
                        : node.color === 'yellow'
                          ? 'text-yellow-400'
                          : node.color === 'orange'
                            ? 'text-orange-500 bg-orange-500/10'
                            : 'text-green-400'
                    }
                  `}>
                    {schema[node.key]}
                  </div>
                </div>

                {i < arr.length - 1 && (
                  <div className="flex-shrink-0 mx-2">
                    <div className="text-orange-500/30 text-lg">→</div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ========== БЛОК 3: До/После ========== */}
        <div className="grid grid-cols-2 gap-4">
          {/* Before */}
          <div className="p-4 bg-red-500/5 border border-red-500/20 rounded relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-red-400 text-lg">✗</span>
                <span className="text-red-400/60 text-xs font-mono">ДО</span>
              </div>
              <div className="text-red-300/60 text-xs font-mono mb-2">
                {beforeAfter.before.label}
              </div>
              <p className="text-red-200 text-sm font-mono">
                {beforeAfter.before.example}
              </p>
            </div>
          </div>

          {/* After */}
          <div className="p-4 bg-green-500/5 border border-green-500/20 rounded relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-green-400 text-lg">✓</span>
                <span className="text-green-400/60 text-xs font-mono">
                  ПОСЛЕ
                </span>
              </div>
              <div className="text-green-300/60 text-xs font-mono mb-2">
                {beforeAfter.after.label}
              </div>
              <p className="text-green-200 text-sm font-mono">
                {beforeAfter.after.example}
              </p>
            </div>
          </div>
        </div>

        {/* ========== БЛОК 4: Ошибки ========== */}
        <div className="space-y-2">
          <div className="text-orange-500/40 text-xs font-mono mb-3">
            ИЗБЕГАЙ
          </div>

          {[
            { prefix: 'НЕ ДЕЛАЙ', value: mistakes.dontDo, icon: '⊘' },
            { prefix: 'НЕ ВЕРЬ', value: mistakes.dontBelieve, icon: '⊗' },
            { prefix: 'НЕ ПУТАЙ', value: mistakes.dontConfuse, icon: '≠' },
          ].map((mistake, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 bg-black/50 border border-neutral-800 rounded hover:border-red-500/30 transition-colors">
              <span className="text-red-500/60 text-lg">{mistake.icon}</span>
              <div>
                <span className="text-red-400 text-xs font-mono font-bold">
                  {mistake.prefix}:
                </span>
                <span className="text-neutral-300 text-sm ml-2">
                  {mistake.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ========== БЛОК 5: Мгновенное применение ========== */}
        <div className="p-5 bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/30 rounded">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-500/20 border border-orange-500/50 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-orange-500">⚡</span>
            </div>
            <div>
              <div className="text-orange-500 text-xs font-mono mb-2">
                ПРИМЕНИТЬ ЗА 30 СЕКУНД
              </div>
              <p className="text-white text-sm mb-2">{instantApply.context}</p>
              <p className="text-orange-400 text-sm font-medium">
                Задай себе вопрос:{' '}
                <span className="italic">«{instantApply.question}»</span>
              </p>
            </div>
          </div>
        </div>

        {/* ========== БЛОК 6: Маркер-принцип ========== */}
        <div className="relative py-8 text-center">
          {/* Decorative lines */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

          <div className="relative inline-block px-8 py-4 bg-neutral-950">
            <div className="text-orange-500/40 text-xs font-mono mb-3">
              ЗАПОМНИ
            </div>
            <p className="text-orange-500 text-xl font-bold tracking-wide">
              «{principleMarker}»
            </p>
          </div>
        </div>
      </div>

      {/* ========== FOOTER: Чувство владения ========== */}
      <div className="px-6 py-6 bg-black border-t border-orange-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-lg font-medium mb-1">
              Теперь это твоё.
            </p>
            <p className="text-orange-500/50 text-sm">
              Это не просто знание — это твоя новая мощь.
            </p>
          </div>

          <button
            onClick={saveToCollection}
            disabled={isSaved}
            className={`
              px-6 py-3 font-mono text-sm transition-all
              ${
                isSaved
                  ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                  : 'bg-orange-500 text-black hover:bg-orange-400'
              }
            `}>
            {isSaved ? '✓ СОХРАНЕНО' : 'ЗАБРАТЬ →'}
          </button>
        </div>
      </div>

      {/* Corner marks */}
      <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-orange-500/30" />
      <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-orange-500/30" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-orange-500/30" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-orange-500/30" />
    </div>
  )
}

// ============================================
// COMPACT CHEATSHEET — Компактная версия
// ============================================
const CompactCheatsheet = ({
  title,
  insight,
  principle,
  beforeAfter,
  category = 'SKILL',
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className="bg-neutral-950 border border-orange-500/30 rounded-sm overflow-hidden cursor-pointer hover:border-orange-500/60 transition-all"
      onClick={() => setIsExpanded(!isExpanded)}>
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500/20 border border-orange-500/50 rounded flex items-center justify-center">
            <span className="text-orange-500 text-sm">◈</span>
          </div>
          <div>
            <div className="text-orange-500/40 text-xs font-mono">
              {category}
            </div>
            <div className="text-white text-sm font-medium">{title}</div>
          </div>
        </div>
        <span
          className={`text-orange-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-orange-500/10 space-y-3">
          {/* Insight */}
          <div className="p-3 bg-black border-l-2 border-orange-500">
            <p className="text-white text-sm">{insight}</p>
          </div>

          {/* Before/After mini */}
          <div className="flex gap-2 text-xs font-mono">
            <div className="flex-1 p-2 bg-red-500/10 rounded">
              <span className="text-red-400">✗</span>
              <span className="text-red-300/80 ml-2">
                {beforeAfter?.before}
              </span>
            </div>
            <div className="flex-1 p-2 bg-green-500/10 rounded">
              <span className="text-green-400">✓</span>
              <span className="text-green-300/80 ml-2">
                {beforeAfter?.after}
              </span>
            </div>
          </div>

          {/* Principle */}
          <div className="text-center py-2">
            <span className="text-orange-500 text-sm font-mono">
              «{principle}»
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// CHEATSHEET COLLECTION — Коллекция шпаргалок
// ============================================
const CheatsheetCollection = ({ cheatsheets = [] }) => {
  const [view, setView] = useState('grid') // 'grid' | 'list'

  return (
    <div className="bg-neutral-950 border border-orange-500/30 rounded-sm overflow-hidden">
      <div className="px-4 py-3 bg-black border-b border-orange-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 text-lg">📋</span>
          <span className="text-orange-500 text-sm font-mono">
            ТВОЯ КОЛЛЕКЦИЯ
          </span>
          <span className="text-orange-500/40 text-xs font-mono ml-2">
            {cheatsheets.length} навыков
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setView('grid')}
            className={`p-2 ${view === 'grid' ? 'text-orange-500' : 'text-orange-500/40'}`}>
            ⊞
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 ${view === 'list' ? 'text-orange-500' : 'text-orange-500/40'}`}>
            ☰
          </button>
        </div>
      </div>

      <div
        className={`p-4 ${view === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-2'}`}>
        {cheatsheets.map((cs, i) => (
          <CompactCheatsheet key={i} {...cs} />
        ))}
      </div>

      {cheatsheets.length === 0 && (
        <div className="p-12 text-center">
          <div className="text-orange-500/30 text-4xl mb-4">◇</div>
          <p className="text-orange-500/50 text-sm">
            Пока пусто. Проходи уроки — собирай навыки.
          </p>
        </div>
      )}
    </div>
  )
}

// ============================================
// MAIN DEMO
// ============================================
export default function CheatsheetDemo() {
  // Example cheatsheet data
  const asyncAwaitCheatsheet = {
    title: 'Как думать об async/await',
    subtitle: 'JavaScript • Асинхронность',
    category: 'JAVASCRIPT',

    insight: {
      condition: 'Если функция возвращает Promise',
      action: 'ставь await и жди',
      reason: 'Иначе получишь Promise вместо данных',
    },

    schema: {
      problem: 'Данные не пришли',
      mistake: 'Забыл await',
      principle: 'Promise ≠ значение',
      solution: 'await + async',
    },

    beforeAfter: {
      before: {
        label: 'Получал Promise',
        example: 'const data = fetch(url)',
      },
      after: {
        label: 'Получаю данные',
        example: 'const data = await fetch(url)',
      },
    },

    mistakes: {
      dontDo: 'Использовать await без async в функции',
      dontBelieve: 'Что .then() лучше — это вкусовщина',
      dontConfuse: 'Promise (обещание) и resolved value (результат)',
    },

    instantApply: {
      context: 'Открой любой fetch-запрос в своём коде',
      question: 'Есть ли await перед каждым Promise?',
    },

    principleMarker: 'Await — это пауза до получения результата',
  }

  // Collection examples
  const collectionData = [
    {
      title: 'Async/Await',
      category: 'JS',
      insight: 'Если функция возвращает Promise — ставь await',
      principle: 'Await — это пауза до результата',
      beforeAfter: { before: 'fetch(url)', after: 'await fetch(url)' },
    },
    {
      title: 'Мемоизация',
      category: 'ALGO',
      insight: 'Если функция вызывается с теми же аргументами — кэшируй',
      principle: 'Не считай дважды то, что уже посчитал',
      beforeAfter: { before: 'O(2^n)', after: 'O(n)' },
    },
    {
      title: 'REST API',
      category: 'API',
      insight: 'GET читает, POST создаёт, PUT заменяет, PATCH меняет',
      principle: 'Глагол HTTP = намерение',
      beforeAfter: { before: 'POST /getUser', after: 'GET /users/:id' },
    },
    {
      title: 'Git Rebase',
      category: 'GIT',
      insight: 'Rebase перезаписывает историю — не делай на shared branches',
      principle: 'Чистая история vs безопасность',
      beforeAfter: {
        before: 'git rebase main (в shared)',
        after: 'git merge main',
      },
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-orange-500 font-mono tracking-widest">
              CHEATSHEET
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            Шпаргалка в стиле "Трамп-кейс"
          </h1>
          <p className="text-neutral-400">
            Открыл — понял — применил. Твой инструмент силы.
          </p>
        </div>

        {/* Main Cheatsheet */}
        <div className="mb-16">
          <div className="text-orange-500/60 text-xs font-mono mb-4">
            ПОЛНАЯ ВЕРСИЯ
          </div>
          <Cheatsheet {...asyncAwaitCheatsheet} />
        </div>

        {/* Collection */}
        <div>
          <div className="text-orange-500/60 text-xs font-mono mb-4">
            КОЛЛЕКЦИЯ НАВЫКОВ
          </div>
          <CheatsheetCollection cheatsheets={collectionData} />
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-orange-500/20 text-center">
          <div className="text-orange-500 font-mono text-sm">
            ТВОЯ СИЛА — ТВОИ ЗНАНИЯ
          </div>
          <div className="text-neutral-600 text-xs mt-1">
            Каждый урок = новый навык в коллекции
          </div>
        </div>
      </div>
    </div>
  )
}
