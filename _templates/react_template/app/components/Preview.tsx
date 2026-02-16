'use client'

import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  Sparkles,
  Zap,
  Trophy,
  Users,
  Clock,
  Lock,
  Play,
  Target,
  TrendingUp,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { courses } from '@/lib/data'

export default function CoursePreviewPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  const course = courses.find(c => c.id === courseId)

  const [activeRoadmapStep, setActiveRoadmapStep] = useState(0)
  const [quickWins, setQuickWins] = useState([
    { id: 1,
text: 'Посмотрел видео-превью курса',
done: false },
    { id: 2,
text: 'Изучил дорожную карту',
done: false },
    { id: 3,
text: 'Решил начать первый модуль',
done: false },
  ])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!course) {
    return (
      <div className="min-h-screen bg-(--background) text-(--foreground) flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-(--neon-main) text-(--background) rounded-(--radius) font-medium hover:bg-(--neon-main-bright) transition-colors">
            Back to Courses
          </button>
        </div>
      </div>
    )
  }

  const roadmapSteps = [
    {
      id: 1,
      title: 'Старт',
      subtitle: 'Бесплатный доступ',
      description:
        'Базовые концепции и первая практика. Доступно сразу после регистрации.',
      icon: Sparkles,
      isFree: true,
      modules: 3,
    },
    {
      id: 2,
      title: 'Практика',
      subtitle: 'Бесплатный доступ',
      description:
        'Реальные задачи для закрепления материала. Создаешь первый проект.',
      icon: Zap,
      isFree: true,
      modules: 4,
    },
    {
      id: 3,
      title: 'Уверенность',
      subtitle: 'Открывается после базы',
      description: 'Продвинутые техники. Здесь начинаются реальные результаты.',
      icon: Star,
      isFree: false,
      modules: 5,
    },
    {
      id: 4,
      title: 'Глубина',
      subtitle: 'Для тех, кто прошел первые шаги',
      description:
        'Мастерство формируется здесь. Стратегии профессионалов индустрии.',
      icon: Trophy,
      isFree: false,
      modules: 6,
    },
    {
      id: 5,
      title: 'Мастер',
      subtitle: 'Финальная стадия трансформации',
      description: 'Уровень, где ты делаешь то, что другие только обсуждают.',
      icon: Users,
      isFree: false,
      modules: 8,
    },
  ]

  const communityStats = [
    {
      label: 'Студентов сейчас учатся',
      value: '2,847',
      icon: Users,
    },
    { label: 'Завершили курс за месяц', value: '312',
icon: Trophy },
    { label: 'Средний рост навыков', value: '+180%',
icon: TrendingUp },
  ]

  const toggleQuickWin = (id: number) => {
    setQuickWins(prev =>
      prev.map(item => (item.id === id ? { ...item, done: !item.done } : item)),
    )
  }

  const completedWins = quickWins.filter(w => w.done).length

  return (
    <div className="min-h-screen bg-(--background) text-(--foreground)">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0/0.02)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <header className="border-b border-(--border) bg-(--card)/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-(--muted-foreground) hover:text-(--foreground) transition-colors group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Назад к курсам</span>
            </button>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16">
          {/* Hero Section with Instant Value */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-(--neon-main)/20 text-(--neon-main) rounded-full text-sm font-semibold border border-(--neon-main)">
                  {course.level}
                </span>
                <span className="flex items-center gap-1 text-(--muted-foreground)">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-glow-animate leading-tight text-balance">
                {course.title}
              </h1>
              <p className="text-xl text-(--muted-foreground) mb-8 leading-relaxed text-pretty">
                {course.description}
              </p>

              <div className="bg-(--card) border border-(--border) rounded-(--radius) p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Твои Первые Шаги</h3>
                  <span className="text-sm text-(--neon-main) font-semibold">
                    {completedWins}/{quickWins.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {quickWins.map(win => (
                    <button
                      key={win.id}
                      onClick={() => toggleQuickWin(win.id)}
                      className="flex items-center gap-3 w-full text-left p-3 rounded-(--radius) hover:bg-(--secondary) transition-colors group">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          win.done
                            ? 'bg-(--neon-main) border-(--neon-main)'
                            : 'border-(--border) group-hover:border-(--neon-main)'
                        }`}>
                        {win.done && (
                          <CheckCircle2 className="w-3 h-3 text-(--background)" />
                        )}
                      </div>
                      <span
                        className={
                          win.done
                            ? 'line-through text-(--muted-foreground)'
                            : ''
                        }>
                        {win.text}
                      </span>
                    </button>
                  ))}
                </div>
                {completedWins === quickWins.length && (
                  <div className="mt-4 p-3 bg-(--neon-main)/10 border border-(--neon-main) rounded-(--radius) text-center">
                    <p className="text-sm text-(--neon-main) font-semibold">
                      Отлично! Теперь начни первый модуль 👇
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => router.push(`/courses/${courseId}`)}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-(--neon-main) text-(--background) rounded-(--radius) font-semibold text-lg hover:bg-(--neon-main-bright) transition-all neon-pulse-ring relative overflow-hidden group">
                <Play className="w-5 h-5" />
                Начать Бесплатно Сейчас
              </button>
              <p className="text-center text-sm text-(--muted-foreground) mt-3">
                Без карты, без обязательств. Просто начни учиться.
              </p>
            </div>

            <div className="space-y-4">
              <div className="aspect-video rounded-(--radius) overflow-hidden border-2 border-(--neon-main) relative group">
                <img
                  src={course.previews[0] || '/placeholder.svg'}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-(--neon-main) flex items-center justify-center">
                    <Play className="w-8 h-8 text-(--background) ml-1" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {course.previews.slice(1).map((preview, idx) => (
                  <div
                    key={idx}
                    className="aspect-video rounded-(--radius) overflow-hidden border border-(--border) hover:border-(--neon-main) transition-all cursor-pointer">
                    <img
                      src={preview || '/placeholder.svg'}
                      alt={`Preview ${idx + 2}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {communityStats.map((stat, idx) => {
              const Icon = stat.icon

              return (
                <div
                  key={idx}
                  className="bg-(--card) border border-(--border) rounded-(--radius) p-6 text-center hover:border-(--neon-main) transition-all">
                  <div className="w-12 h-12 rounded-full bg-(--neon-main)/20 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-(--neon-main)" />
                  </div>
                  <div className="text-3xl font-bold text-(--neon-main) mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-(--muted-foreground)">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Система Твоего Роста
            </h2>
            <p className="text-center text-(--muted-foreground) text-lg mb-4">
              Ты видишь весь путь. Но доступ открывается по мере прохождения.
            </p>
            <p className="text-center text-(--neon-main) text-sm mb-12 font-medium">
              Первые 2 этапа бесплатно. Остальные — когда ты готов двигаться
              дальше.
            </p>

            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-(--border) via-(--neon-main-dim) to-(--border) -translate-y-1/2 hidden lg:block" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
                {roadmapSteps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = activeRoadmapStep === index

                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveRoadmapStep(index)}
                      onMouseEnter={() => setActiveRoadmapStep(index)}
                      className={`relative bg-(--card) rounded-(--radius) border p-6 transition-all duration-300 ${
                        isActive
                          ? 'border-(--neon-main) shadow-[0_0_24px_color-mix(in_oklab,var(--neon-main)_40%,transparent)] scale-105 lg:scale-110 z-10'
                          : 'border-(--border) hover:border-(--neon-main-dim)'
                      } ${!step.isFree ? 'opacity-75' : ''}`}>
                      {!step.isFree && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-(--secondary) border-2 border-(--border) flex items-center justify-center">
                          <Lock className="w-4 h-4 text-(--muted-foreground)" />
                        </div>
                      )}

                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto transition-all duration-300 ${
                          isActive
                            ? 'bg-(--neon-main) text-(--background)'
                            : 'bg-(--secondary) text-(--foreground)'
                        }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div
                        className={`absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isActive
                            ? 'bg-(--neon-main) text-(--background)'
                            : 'bg-(--secondary) text-(--muted-foreground)'
                        }`}>
                        {step.id}
                      </div>
                      <h3 className="font-bold text-lg mb-1 text-center">
                        {step.title}
                      </h3>
                      <p
                        className={`text-xs mb-3 text-center font-medium ${step.isFree ? 'text-(--neon-main)' : 'text-(--muted-foreground)'}`}>
                        {step.subtitle}
                      </p>
                      <p
                        className={`text-sm text-center leading-relaxed text-balance mb-3 ${isActive ? 'text-(--foreground)' : 'text-(--muted-foreground)'}`}>
                        {step.description}
                      </p>
                      <div className="text-xs text-center text-(--muted-foreground)">
                        {step.modules} модулей
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="bg-(--card) rounded-(--radius) border border-(--border) p-8 md:p-12 mb-20 border-glow-animate">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-(--neon-main) flex items-center justify-center flex-shrink-0 font-bold text-2xl text-(--background)">
                Я
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Моя философия</h2>
                <p className="text-(--muted-foreground) text-lg leading-relaxed">
                  Слушай, я не буду тебе продавать мечты. Это не волшебная
                  таблетка. Но если ты готов вложиться — результаты изменят всё.
                  Я прошел этот путь сам. Знаю, как выглядит борьба на старте.
                  Знаю, как выглядит победа, когда ты прорываешься.
                </p>
              </div>
            </div>
            <p className="text-(--foreground) text-lg leading-relaxed mb-4">
              Этот курс — не теория из учебников. Это мой реальный опыт,
              упакованный в систему. Я даю тебе первые модули бесплатно, чтобы
              ты сам почувствовал силу материала. Начни. Пройди первые шаги. И
              ты сам увидишь разницу.
            </p>
            <p className="text-(--muted-foreground) italic">
              Когда ты зайдешь достаточно глубоко, ты сам захочешь продолжить.
              Потому что остановиться будет сложнее, чем идти дальше.
            </p>
          </div>

          <div className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
              Что Говорят Те, Кто Уже Внутри
            </h2>
            <p className="text-center text-(--muted-foreground) mb-12">
              Реальные студенты, реальные результаты
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: 'Максим',
                  result: 'Junior → Middle за 4 месяца',
                  quote:
                    'Прошел бесплатную часть за неделю. Понял, что это то, что мне нужно. Продолжил — и не жалею.',
                },
                {
                  name: 'Анна',
                  result: 'Запустила свой проект',
                  quote:
                    'Бесплатные модули дали больше, чем два платных курса, которые я брала раньше.',
                },
                {
                  name: 'Игорь',
                  result: 'Увеличил зарплату в 2х',
                  quote:
                    'После 3го модуля уже чувствовал уверенность. После 10го — получил оффер на новую должность.',
                },
                {
                  name: 'Дарья',
                  result: 'Сменила карьеру',
                  quote:
                    'Начала из любопытства. Теперь работаю в IT и зарабатываю в 3 раза больше.',
                },
                {
                  name: 'Владимир',
                  result: 'Senior Developer',
                  quote:
                    'Даже с опытом нашел много нового. Курс систематизировал знания и показал пробелы.',
                },
                {
                  name: 'Елена',
                  result: 'Фриланс $3k/мес',
                  quote:
                    'Прошла курс параллельно с работой. Через 6 месяцев ушла на фриланс. Свобода бесценна.',
                },
              ].map((testimonial, idx) => (
                <div
                  key={idx}
                  className="bg-(--card) border border-(--border) rounded-(--radius) p-5 hover:border-(--neon-main) transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-(--neon-main) flex items-center justify-center text-sm font-bold text-(--background)">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-(--neon-main)">
                        {testimonial.result}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-(--muted-foreground) leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-(--card) to-(--secondary) rounded-(--radius) border-2 border-(--neon-main) p-8 md:p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-(--neon-main) flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-(--background)" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Твой Следующий Шаг
            </h2>
            <p className="text-lg text-(--muted-foreground) mb-8 max-w-2xl mx-auto leading-relaxed">
              Не думай слишком долго. Начни первый модуль сегодня. Дай себе
              неделю, чтобы понять, подходит ли тебе этот подход. Ты ничего не
              теряешь — первые два этапа полностью бесплатны.
            </p>
            <button
              onClick={() => router.push(`/courses/${courseId}`)}
              className="px-12 py-5 bg-(--neon-main) text-(--background) rounded-(--radius) font-bold text-xl hover:bg-(--neon-main-bright) transition-all neon-pulse-ring inline-flex items-center gap-3 mx-auto">
              <Play className="w-6 h-6" />
              Начать Прямо Сейчас
            </button>
            <p className="text-sm text-(--muted-foreground) mt-6">
              Присоединяйся к 2,847 студентам, которые уже учатся
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
