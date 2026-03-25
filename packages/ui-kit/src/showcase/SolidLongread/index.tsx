import * as React from 'react'
import type { HTMLAttributes } from 'react'

import { clsx } from '@infinityloop.labs/utils'

import { Paper, Typography } from '@/components/atoms'
import { Code } from '@/components/molecules/CodeBrick'
import { EditableTypography } from '@/components/molecules/EditableTypography'

const initialPrincipleSummary = {
  s: 'Single Responsibility: один класс, одна причина для изменений.',
  o: 'Open/Closed: расширяем поведение, не ломая стабильный код.',
  l: 'Liskov Substitution: потомок должен быть честной заменой родителя.',
  i: 'Interface Segregation: узкие контракты лучше перегруженных интерфейсов.',
  d: 'Dependency Inversion: бизнес-логика зависит от абстракций, а не от деталей.',
} as const

type PrincipleIdType = keyof typeof initialPrincipleSummary

type SolidPrincipleType = {
  id: PrincipleIdType
  letter: string
  title: string
  colorToken: string
  statement: string
  issue: string
  refactor: string
  checklist: string[]
  code: string
}

const solidPrinciples: SolidPrincipleType[] = [
  {
    id: 's',
    letter: 'S',
    title: 'Single Responsibility Principle',
    colorToken: '--chart-1',
    statement:
      'Разделяйте ответственность по потокам изменений: в одном модуле не должны смешиваться правила домена, форматирование ответа и работа с инфраструктурой.',
    issue:
      'Когда один класс и пишет в базу, и валидирует, и шлёт email, любой новый сценарий вынуждает трогать критический код и поднимать регрессию.',
    refactor:
      'Вынесите отдельные слои: policy/service для правил, repository для хранения и notifier для внешних эффектов.',
    checklist: [
      'Изменение формата API не должно требовать правки бизнес-правил.',
      'Логирование и уведомления выносятся в отдельные адаптеры.',
      'Тесты модуля должны проверять один класс поведения.',
    ],
    code: `class InvoiceService {
  constructor(
    private readonly calculator: TaxCalculator,
    private readonly repository: InvoiceRepository,
    private readonly notifier: InvoiceNotifier,
  ) {}

  async issue(input: DraftInvoice) {
    const invoice = this.calculator.applyTaxes(input)
    await this.repository.save(invoice)
    await this.notifier.notifyIssued(invoice)
    return invoice
  }
}`,
  },
  {
    id: 'o',
    letter: 'O',
    title: 'Open/Closed Principle',
    colorToken: '--chart-2',
    statement:
      'Новая функциональность добавляется через расширение: стратегии, плагины и таблицы правил, а не через рост if/else в центре системы.',
    issue:
      'Монолитный switch по типам платежей ломается каждый спринт, потому что под новый тип редактируется уже отлаженная ветка.',
    refactor:
      'Перейдите на реестр обработчиков: добавляйте новый класс-стратегию без изменений ядра.',
    checklist: [
      'Новый кейс подключается регистрацией, а не модификацией shared-кода.',
      'Feature-флаг активирует модуль как отдельное расширение.',
      'Публичный контракт use-case остаётся неизменным.',
    ],
    code: `interface PaymentHandler {
  type: PaymentType
  pay(command: PayCommand): Promise<PayResult>
}

class PaymentGateway {
  constructor(private readonly handlers: PaymentHandler[]) {}

  pay(command: PayCommand) {
    const handler = this.handlers.find(item => item.type === command.type)
    if (!handler) throw new Error('Unsupported payment type')
    return handler.pay(command)
  }
}`,
  },
  {
    id: 'l',
    letter: 'L',
    title: 'Liskov Substitution Principle',
    colorToken: '--chart-3',
    statement:
      'Наследование допустимо только когда поведение подтипа совпадает с ожиданиями базового контракта: те же предусловия, те же гарантии.',
    issue:
      'Если потомок бросает исключение там, где родитель обещает результат, слой выше перестаёт быть предсказуемым и тесты становятся хрупкими.',
    refactor:
      'Либо исправьте контракт подтипа, либо замените наследование на композицию и отдельный интерфейс.',
    checklist: [
      'Подтип не усиливает предусловия и не ослабляет постусловия.',
      'Методы базового типа ведут себя одинаково для всех реализаций.',
      'Контракт описан тестами на уровне абстракции.',
    ],
    code: `interface ReportExporter {
  export(report: Report): Promise<Uint8Array>
}

class PdfExporter implements ReportExporter {
  async export(report: Report) {
    return renderPdf(report)
  }
}

class CsvExporter implements ReportExporter {
  async export(report: Report) {
    return renderCsv(report)
  }
}`,
  },
  {
    id: 'i',
    letter: 'I',
    title: 'Interface Segregation Principle',
    colorToken: '--chart-4',
    statement:
      'Интерфейсы проектируются по сценариям использования: каждый клиент знает только те методы, которые реально нужны.',
    issue:
      'Толстый интерфейс из десяти методов приводит к заглушкам, `throw new Error("Not supported")` и сложному мокингу в тестах.',
    refactor:
      'Разбейте контракт на узкие capability-интерфейсы и внедряйте только нужные зависимости.',
    checklist: [
      'Компонент не обязан реализовывать неиспользуемые методы.',
      'Моки в тестах содержат только 1-2 обязательных метода.',
      'API пакета читается как набор ролей, а не как монолит.',
    ],
    code: `interface UserReader {
  byId(id: string): Promise<User | null>
}

interface UserWriter {
  save(user: User): Promise<void>
}

class UserProfileService {
  constructor(private readonly reader: UserReader) {}

  getProfile(id: string) {
    return this.reader.byId(id)
  }
}`,
  },
  {
    id: 'd',
    letter: 'D',
    title: 'Dependency Inversion Principle',
    colorToken: '--chart-5',
    statement:
      'Слой домена общается с интерфейсами, а конкретные клиенты (Postgres, Redis, HTTP SDK) подключаются на краю приложения.',
    issue:
      'Когда use-case напрямую импортирует ORM-модель, вы теряете изоляцию, скорость тестов и возможность заменить инфраструктуру.',
    refactor:
      'Опишите порты (абстракции) в домене и внедряйте адаптеры через composition root.',
    checklist: [
      'Доменные модули не импортируют инфраструктурные библиотеки.',
      'Интеграционные зависимости собираются в bootstrap-слое.',
      'Юнит-тесты проходят без запуска БД и очередей.',
    ],
    code: `interface EventBus {
  publish(event: DomainEvent): Promise<void>
}

class CompleteOrder {
  constructor(private readonly eventBus: EventBus) {}

  async execute(order: Order) {
    order.complete()
    await this.eventBus.publish(new OrderCompleted(order.id))
  }
}`,
  },
]

type SolidLongreadPropertyType = HTMLAttributes<HTMLDivElement> & {
  isLoading?: boolean
  isEditModeOn?: boolean
  isEditModeDisabled?: boolean
}

export const SolidLongread = ({
  className,
  isLoading = false,
  isEditModeOn = false,
  isEditModeDisabled = false,
  ...property
}: SolidLongreadPropertyType) => {
  const [title, setTitle] = React.useState(
    'SOLID в разработке: принципы устойчивого кода при росте продукта',
  )
  const [subtitle, setSubtitle] = React.useState(
    'Материал собран как рабочая шпаргалка: можно читать подряд и быстро проверять архитектурные решения перед merge.',
  )
  const [principleSummary, setPrincipleSummary] = React.useState<
    Record<PrincipleIdType, string>
  >(() => ({ ...initialPrincipleSummary }))

  return (
    <div
      className={clsx('min-h-screen px-4 py-6 md:px-8 md:py-8', className)}
      style={{
        background:
          'radial-gradient(130% 120% at 0% 0%, color-mix(in oklab, var(--chart-1) 14%, transparent), transparent 52%), radial-gradient(120% 120% at 100% 0%, color-mix(in oklab, var(--chart-2) 10%, transparent), transparent 58%), var(--background)',
        color: 'var(--foreground)',
      }}
      {...property}>
      <div className="mx-auto grid w-full max-w-[980px] gap-4">
        <Paper
          type="gradient"
          className="space-y-5 p-6 md:p-7"
          isLoading={isLoading}>
          <Typography
            typography="Caption"
            color="muted-foreground"
            isLoading={isLoading}>
            инженерная практика
          </Typography>

          <EditableTypography
            typography="Heading"
            element="h1"
            value={title}
            onValueChange={setTitle}
            isLoading={isLoading}
            isEditModeOn={isEditModeOn}
            isEditModeDisabled={isEditModeDisabled}
            className="h-auto min-h-9"
          />

          <EditableTypography
            typography="Subheader"
            element="p"
            value={subtitle}
            onValueChange={setSubtitle}
            isLoading={isLoading}
            isEditModeOn={isEditModeOn}
            isEditModeDisabled={isEditModeDisabled}
            className="h-auto min-h-9"
            contentClassName="text-(--muted-foreground)"
          />

          <Typography typography="SectionHeader" isLoading={isLoading}>
            SOLID: практическое руководство
          </Typography>

          <Typography
            typography="Body"
            color="muted-foreground"
            isLoading={isLoading}>
            Ниже пять принципов в формате «сигнал проблемы → безопасный
            рефакторинг → чеклист ревью». Режимы <code>isLoading</code>,{' '}
            <code>isEditModeOn</code> и <code>isEditModeDisabled</code>{' '}
            позволяют проверять поведение контента в разных состояниях.
          </Typography>

          <div className="grid gap-4">
            {solidPrinciples.map(principle => (
              <section
                key={principle.id}
                className="space-y-3 rounded-(--radius) border border-(--border) bg-(--card) p-4 md:p-5">
                <div className="flex items-center gap-3">
                  <div
                    className="inline-flex size-9 items-center justify-center rounded-md text-sm font-semibold"
                    style={{
                      backgroundColor: `var(${principle.colorToken})`,
                      color: 'var(--background)',
                    }}>
                    {principle.letter}
                  </div>
                  <Typography typography="CompactHeader" isLoading={isLoading}>
                    {principle.title}
                  </Typography>
                </div>

                <EditableTypography
                  typography="Subheader"
                  element="p"
                  value={principleSummary[principle.id]}
                  onValueChange={nextValue => {
                    setPrincipleSummary(previousValue => ({
                      ...previousValue,
                      [principle.id]: nextValue,
                    }))
                  }}
                  isLoading={isLoading}
                  isEditModeOn={isEditModeOn}
                  isEditModeDisabled={isEditModeDisabled}
                  className="h-auto min-h-9"
                />

                <Typography
                  typography="Body"
                  color="muted-foreground"
                  isLoading={isLoading}>
                  {principle.statement}
                </Typography>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2 rounded-(--radius) border border-(--border) bg-(--background) p-3">
                    <Typography
                      typography="CompactCaption"
                      color="cautionary"
                      isLoading={isLoading}>
                      Сигнал проблемы
                    </Typography>
                    <Typography typography="BodySmall" isLoading={isLoading}>
                      {principle.issue}
                    </Typography>
                  </div>
                  <div className="space-y-2 rounded-(--radius) border border-(--border) bg-(--background) p-3">
                    <Typography
                      typography="CompactCaption"
                      color="constructive"
                      isLoading={isLoading}>
                      Безопасный рефакторинг
                    </Typography>
                    <Typography typography="BodySmall" isLoading={isLoading}>
                      {principle.refactor}
                    </Typography>
                  </div>
                </div>

                <div className="space-y-2">
                  <Typography
                    typography="CompactCaption"
                    color="muted-foreground"
                    isLoading={isLoading}>
                    Чеклист ревью
                  </Typography>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-(--muted-foreground)">
                    {principle.checklist.map(item => (
                      <li key={item}>
                        <Typography
                          typography="BodySmall"
                          color="muted-foreground"
                          isLoading={isLoading}>
                          {item}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </div>

                <Code
                  title={`${principle.letter} // Example`}
                  subtitle={principle.title}
                  initialCode={principle.code}
                  language="typescript"
                  isEditMode={isEditModeOn}
                  isEditModeDisabled={isEditModeDisabled}
                  isLoading={isLoading}
                />
              </section>
            ))}
          </div>
        </Paper>
      </div>
    </div>
  )
}
