import React, { useState, useEffect } from 'react'

const Block = ({ number, title, children }) => (
  <div className="relative mb-20">
    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-orange-500 to-transparent" />
    <div className="flex items-center gap-4 mb-6">
      <span className="text-6xl font-bold text-orange-500">{number}</span>
      <h2 className="text-2xl font-bold tracking-wider text-white uppercase">
        {title}
      </h2>
    </div>
    <div className="pl-4">{children}</div>
  </div>
)

// 1. Ritual In
const RitualIn = () => {
  const [entered, setEntered] = useState(false)

  if (!entered) {
    return (
      <div
        onClick={() => setEntered(true)}
        className="bg-neutral-900 border border-orange-500/30 p-12 text-center cursor-pointer hover:border-orange-500 transition-all duration-500">
        <div className="text-orange-500 text-sm mb-4 opacity-60 font-mono">
          НАЖМИ, ЧТОБЫ ВОЙТИ
        </div>
        <div className="text-4xl text-white tracking-widest font-bold">
          RITUAL IN
        </div>
        <div className="w-16 h-0.5 bg-orange-500 mx-auto mt-6 hover:w-32 transition-all" />
      </div>
    )
  }

  return (
    <div className="bg-black border-l-4 border-orange-500 p-12">
      <div className="text-orange-500/60 text-xs mb-4 font-mono">
        МОМЕНТ ПЕРЕХОДА
      </div>
      <p className="text-2xl text-white leading-relaxed mb-2">«Хаос позади.</p>
      <p className="text-2xl text-orange-500 leading-relaxed">
        Сейчас — только ясность.»
      </p>
      <div className="mt-8 flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
        <span className="text-sm text-neutral-500 font-mono">
          Фокус активирован
        </span>
      </div>
    </div>
  )
}

// 2. Micro-Conflict
const MicroConflict = () => {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="bg-neutral-950 border border-neutral-800 p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl" />
      <div className="text-orange-500 text-xs mb-6 flex items-center gap-2 font-mono">
        <span className="w-2 h-2 bg-orange-500 rounded-full" />
        СЛОМ СТАРОГО ПОНИМАНИЯ
      </div>
      <div className="space-y-4">
        <p className="text-xl text-neutral-500 line-through">
          «Чтобы научиться — нужно запомнить.»
        </p>
        {revealed && (
          <div className="animate-pulse">
            <p className="text-xl text-white border-l-2 border-orange-500 pl-4">
              Но если понимание — это не память...
            </p>
            <p className="text-xl text-orange-500 pl-4 mt-2">
              То что тогда вообще значит «понять»?
            </p>
          </div>
        )}
      </div>
      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          className="mt-6 text-sm text-neutral-500 hover:text-orange-500 transition-colors flex items-center gap-2 font-mono">
          <span>Показать конфликт</span>
          <span>→</span>
        </button>
      )}
      {revealed && (
        <div className="mt-8 p-4 bg-orange-500/10 border border-orange-500/30">
          <p className="text-sm text-orange-500 font-mono">
            ⚡ Когнитивный диссонанс активирован
          </p>
        </div>
      )}
    </div>
  )
}

// 3. Cognitive Chain
const CognitiveChain = () => {
  const [step, setStep] = useState(0)
  const steps = [
    {
      phase: 'СЛОМ',
      text: 'Ты думал, что понимание = информация. Но информация без структуры — шум.',
    },
    {
      phase: 'КОНТРОЛЬ',
      text: 'Структура появляется, когда ты сам выстраиваешь связи. Не когда тебе их показывают.',
    },
    {
      phase: 'ИНСАЙТ',
      text: 'Понимание — это не «знать». Это «уметь объяснить так, чтобы другой понял».',
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex-1 flex items-center">
            <div
              onClick={() => setStep(i)}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                i <= step
                  ? 'border-orange-500 bg-orange-500/20 text-orange-500'
                  : 'border-neutral-700 text-neutral-700'
              }`}>
              <span className="text-lg font-bold">{i + 1}</span>
            </div>
            {i < 2 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-orange-500' : 'bg-neutral-800'}`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="bg-neutral-900 border border-neutral-800 p-8">
        <div className="text-orange-500 text-xs mb-4 font-mono">
          ШАГ {step + 1} — {steps[step].phase}
        </div>
        <p className="text-xl text-white leading-relaxed">{steps[step].text}</p>
        <div className="flex gap-2 mt-8">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-4 py-2 border border-neutral-700 text-neutral-400 hover:border-orange-500 hover:text-orange-500 disabled:opacity-30 transition-all font-mono text-sm">
            ← Назад
          </button>
          <button
            onClick={() => setStep(Math.min(2, step + 1))}
            disabled={step === 2}
            className="px-4 py-2 bg-orange-500 text-black hover:bg-orange-400 disabled:opacity-30 transition-all font-mono text-sm">
            Далее →
          </button>
        </div>
      </div>
    </div>
  )
}

// 4. Drop-To-Proof
const DropToProof = () => {
  const [selected, setSelected] = useState([])
  const items = ['Лекции', 'Практика', 'Объяснение другому', 'Чтение']
  const correct = ['Практика', 'Объяснение другому']
  const isCorrect =
    selected.length === 2 && selected.every(s => correct.includes(s))

  return (
    <div>
      <div className="text-neutral-400 text-sm mb-4 font-mono">
        ЗАДАНИЕ: Выбери то, что даёт настоящее понимание
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map(item => (
          <button
            key={item}
            onClick={() => {
              if (selected.includes(item)) {
                setSelected(selected.filter(s => s !== item))
              } else if (selected.length < 2) {
                setSelected([...selected, item])
              }
            }}
            className={`p-4 border text-left transition-all ${
              selected.includes(item)
                ? 'border-orange-500 bg-orange-500/20 text-orange-500'
                : 'border-neutral-700 bg-neutral-900 text-white hover:border-orange-500/50'
            }`}>
            {item}
          </button>
        ))}
      </div>
      {selected.length === 2 && (
        <div
          className={`mt-6 p-4 border-l-4 ${isCorrect ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
          <p className={isCorrect ? 'text-green-400' : 'text-red-400'}>
            {isCorrect
              ? '✓ Именно! Практика и объяснение — это активное понимание.'
              : '✗ Попробуй ещё раз'}
          </p>
        </div>
      )}
    </div>
  )
}

// 5. Heuristic Guard
const HeuristicGuard = () => {
  const [input, setInput] = useState('')
  const keywords = ['понимание', 'объяснить', 'структура']
  const words = input.trim().split(/\s+/).filter(Boolean).length
  const found = keywords.filter(k => input.toLowerCase().includes(k))

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-8">
      <div className="text-orange-500 text-xs mb-4 font-mono">
        РЕФЛЕКСИЯ — 12 СЛОВ МАКСИМУМ
      </div>
      <p className="text-white mb-6">
        Перефразируй главную мысль урока. Используй ключевые слова:
      </p>
      <div className="flex gap-2 mb-6 flex-wrap">
        {keywords.map(kw => (
          <span
            key={kw}
            className={`px-3 py-1 border font-mono text-sm ${
              input.toLowerCase().includes(kw)
                ? 'border-orange-500 text-orange-500 bg-orange-500/10'
                : 'border-neutral-700 text-neutral-500'
            }`}>
            {kw}
          </span>
        ))}
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Напиши здесь..."
        className="w-full bg-neutral-950 border border-neutral-700 p-4 text-white resize-none focus:border-orange-500 focus:outline-none"
        rows={3}
      />
      <div className="flex justify-between items-center mt-4">
        <span
          className={`font-mono text-sm ${words > 12 ? 'text-red-500' : 'text-neutral-500'}`}>
          {words}/12 слов
        </span>
        {input && (
          <span
            className={`font-mono text-sm ${found.length >= 2 && words <= 12 ? 'text-green-500' : 'text-orange-500'}`}>
            {found.length >= 2 && words <= 12
              ? '✓ Отлично!'
              : `Нужно ещё ${2 - found.length} ключевых слов`}
          </span>
        )}
      </div>
    </div>
  )
}

// 6. Unfinished Hook
const UnfinishedHook = () => (
  <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 border border-orange-500/30 p-12 relative overflow-hidden">
    <div className="absolute -right-20 -top-20 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />
    <div className="text-orange-500/60 text-xs mb-6 font-mono">
      🔒 ВОПРОС БЕЗ ОТВЕТА
    </div>
    <p className="text-3xl text-white leading-relaxed tracking-wide font-bold">
      Если понимание — это «уметь объяснить»...
    </p>
    <p className="text-3xl text-orange-500 leading-relaxed tracking-wide mt-4 font-bold">
      То кому объяснять, если ты один?
    </p>
    <div className="mt-8 flex items-center gap-4">
      <div className="flex-1 h-1 bg-neutral-800 relative">
        <div className="absolute left-0 top-0 h-full w-3/4 bg-gradient-to-r from-orange-500 to-orange-500/30" />
      </div>
      <span className="text-neutral-500 text-sm font-mono">
        Ответ впереди...
      </span>
    </div>
  </div>
)

// 7. Mini-Lesson Constructor
const MiniLessonConstructor = () => {
  const template = {
    intro: 'Понимание ≠ запоминание',
    example: 'Ты можешь помнить 100 дат, но не понимать историю',
    why: 'Понимание требует активной переработки, а не пассивного приёма',
    when_not: 'Не работает, когда нужно именно запомнить факт',
    questions: [
      'Приведи пример понимания без запоминания',
      'Что отличает «знать» от «понимать»?',
      'Когда запоминание важнее?',
    ],
  }

  return (
    <div className="bg-neutral-950 border border-orange-500/30">
      <div className="bg-orange-500/10 p-6 border-b border-orange-500/30 flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center text-black font-bold">
          ML
        </div>
        <div>
          <div className="text-xl text-white font-bold">МИНИ-УРОК</div>
          <div className="text-orange-500 text-xs font-mono">
            Шаблон для объяснения другому
          </div>
        </div>
      </div>
      <div className="p-6 space-y-5">
        <div className="border-l-2 border-orange-500 pl-4">
          <div className="text-neutral-500 text-xs mb-1 font-mono">
            ВВЕДЕНИЕ
          </div>
          <p className="text-xl text-white">{template.intro}</p>
        </div>
        <div className="border-l-2 border-neutral-600 pl-4">
          <div className="text-neutral-500 text-xs mb-1 font-mono">ПРИМЕР</div>
          <p className="text-neutral-300">{template.example}</p>
        </div>
        <div className="border-l-2 border-neutral-600 pl-4">
          <div className="text-neutral-500 text-xs mb-1 font-mono">
            ПОЧЕМУ РАБОТАЕТ
          </div>
          <p className="text-neutral-300">{template.why}</p>
        </div>
        <div className="border-l-2 border-orange-500/50 pl-4">
          <div className="text-neutral-500 text-xs mb-1 font-mono">
            КОГДА НЕ РАБОТАЕТ
          </div>
          <p className="text-neutral-400">{template.when_not}</p>
        </div>
        <div className="bg-neutral-900 p-4 border border-neutral-800">
          <div className="text-orange-500 text-xs mb-3 font-mono">
            3 ВОПРОСА
          </div>
          {template.questions.map((q, i) => (
            <div key={i} className="flex gap-3 text-neutral-400 mb-2">
              <span className="text-orange-500">{i + 1}.</span> {q}
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-orange-500/10 border-t border-orange-500/30 flex justify-between items-center">
        <span className="text-orange-500 text-sm font-mono">
          Готово к отправке
        </span>
        <button className="px-4 py-2 bg-orange-500 text-black font-mono text-sm hover:bg-orange-400">
          Поделиться →
        </button>
      </div>
    </div>
  )
}

// 8. Progress Sunk Cost
const ProgressSunkCost = () => {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    setTimeout(() => setWidth(78), 300)
  }, [])

  const stages = [
    { name: 'Слом',
done: true },
    { name: 'Контроль',
done: true },
    { name: 'Инсайт',
done: true },
    { name: 'Практика',
done: false },
    { name: 'Передача',
done: false },
  ]

  return (
    <div className="bg-neutral-950 p-8 border border-neutral-800">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-orange-500 text-xs mb-1 font-mono">
            ТВОЙ ПРОГРЕСС
          </div>
          <div className="text-2xl text-white font-bold">Почти там</div>
        </div>
        <div className="text-5xl text-orange-500 font-bold">78%</div>
      </div>
      <div className="relative h-3 bg-neutral-800 rounded-full overflow-hidden mb-8">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-1000"
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="flex justify-between">
        {stages.map((stage, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                stage.done
                  ? 'border-orange-500 bg-orange-500/20 text-orange-500'
                  : 'border-neutral-700 text-neutral-600'
              }`}>
              {stage.done ? '✓' : i + 1}
            </div>
            <span
              className={`text-xs font-mono ${stage.done ? 'text-orange-500' : 'text-neutral-600'}`}>
              {stage.name}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-orange-500/10 border border-orange-500/30 text-center">
        <p className="text-orange-500">
          «Ты уже построил 78% — а начинал с нуля.»
        </p>
      </div>
    </div>
  )
}

// 9. Personal Artifacts
const PersonalArtifacts = () => {
  const artifacts = [
    {
      title: 'Первый инсайт',
      unlocked: true,
      desc: 'Понял разницу между знанием и пониманием',
    },
    {
      title: 'Строитель связей',
      unlocked: true,
      desc: 'Создал первую ментальную карту',
    },
    { title: 'Учитель',
unlocked: false,
desc: 'Создай мини-урок для друга' },
    {
      title: 'Мастер рефлексии',
      unlocked: false,
      desc: 'Пройди 5 блоков без подсказок',
    },
  ]

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {artifacts.map((art, i) => (
          <div
            key={i}
            className={`relative p-6 border transition-all ${
              art.unlocked
                ? 'bg-orange-500/10 border-orange-500/50 hover:border-orange-500'
                : 'bg-neutral-950 border-neutral-800 opacity-50'
            }`}>
            {art.unlocked && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-black text-xs">
                ✓
              </div>
            )}
            <div
              className={`w-12 h-12 mb-4 border-2 flex items-center justify-center text-2xl ${
                art.unlocked
                  ? 'border-orange-500 text-orange-500'
                  : 'border-neutral-700 text-neutral-700'
              }`}>
              {art.unlocked ? '★' : '?'}
            </div>
            <h4
              className={`text-lg font-bold mb-2 ${art.unlocked ? 'text-white' : 'text-neutral-600'}`}>
              {art.title}
            </h4>
            <p
              className={`text-xs font-mono ${art.unlocked ? 'text-neutral-400' : 'text-neutral-700'}`}>
              {art.desc}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center text-neutral-500">
        Открыто <span className="text-orange-500">2</span> из{' '}
        <span className="text-white">4</span> артефактов
      </div>
    </div>
  )
}

// Main
export default function ThinkingArena() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Hero */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-orange-500/20 rounded-full animate-pulse" />
        <div className="relative text-center z-10 px-8">
          <div className="text-orange-500 text-sm mb-4 tracking-widest font-mono">
            ARENA OF THINKING
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-wider mb-6">
            9 БЛОКОВ
          </h1>
          <p className="text-xl text-neutral-400 max-w-xl mx-auto mb-12">
            Дизайн-система для образования, которое вызывает инсайт
          </p>
          <div className="w-px h-24 bg-gradient-to-b from-orange-500 to-transparent mx-auto" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-8 py-24">
        <Block number="01" title="Ritual In">
          <RitualIn />
        </Block>
        <Block number="02" title="Micro-Conflict">
          <MicroConflict />
        </Block>
        <Block number="03" title="Cognitive Chain">
          <CognitiveChain />
        </Block>
        <Block number="04" title="Drop-To-Proof">
          <DropToProof />
        </Block>
        <Block number="05" title="Heuristic Guard">
          <HeuristicGuard />
        </Block>
        <Block number="06" title="Unfinished Hook">
          <UnfinishedHook />
        </Block>
        <Block number="07" title="Mini-Lesson">
          <MiniLessonConstructor />
        </Block>
        <Block number="08" title="Sunk Cost Progress">
          <ProgressSunkCost />
        </Block>
        <Block number="09" title="Personal Artifacts">
          <PersonalArtifacts />
        </Block>

        <div className="mt-32 pt-12 border-t border-neutral-800 text-center">
          <div className="text-4xl text-orange-500 font-bold mb-4">
            ARENA OF THINKING
          </div>
          <p className="text-neutral-500 text-sm font-mono">
            Не дать знания — вызвать инсайт
          </p>
        </div>
      </div>
    </div>
  )
}
