'use client'

import { type ComponentType, useState } from 'react'

export type SubpathStepType = {
  id: number | string
  title: string
  subtitle: string
  description: string
  icon: ComponentType<{ className?: string }>
}

type SubpathSelectorPropsType = {
  title?: string
  description?: string
  steps: SubpathStepType[]
  className?: string
}

export const SubpathSelector: FC<SubpathSelectorPropsType> = ({
  title = 'Твой Путь к Мастерству',
  description = 'Не просто курс — это путешествие героя. Пять шагов от новичка до профессионала.',
  steps,
  className,
}) => {
  const [activeStep, setActiveStep] = useState(0)

  const containerClassName = ['mb-20', className].filter(Boolean).join(' ')

  return (
    <div className={containerClassName}>
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        {title}
      </h2>
      <p className="text-center text-(--muted-foreground) text-lg mb-12">
        {description}
      </p>

      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-(--border) via-(--neon-main-dim) to-(--border) -translate-y-1/2 hidden lg:block" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = activeStep === index

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(index)}
                onMouseEnter={() => setActiveStep(index)}
                className={`relative bg-(--card) rounded-(--radius) border p-6 transition-all duration-300 ${
                  isActive
                    ? 'border-(--neon-main) shadow-[0_0_24px_color-mix(in_oklab,var(--neon-main)_40%,transparent)] scale-105 lg:scale-110 z-10'
                    : 'border-(--border) hover:border-(--neon-main-dim)'
                }`}>
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
                <p className="text-sm text-(--neon-main) mb-3 text-center font-medium">
                  {step.subtitle}
                </p>
                <p
                  className={`text-sm text-center leading-relaxed text-balance ${
                    isActive
                      ? 'text-(--foreground)'
                      : 'text-(--muted-foreground)'
                  }`}>
                  {step.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
