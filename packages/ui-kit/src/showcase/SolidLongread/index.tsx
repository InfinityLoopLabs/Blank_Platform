import * as React from 'react'

import { Paper, Typography } from '@/components/atoms'
import { Code } from '@/components/molecules/CodeBrick'
import { EditableTypography } from '@/components/molecules/EditableTypography'

const initialPrincipleSummary = {
  s: 'Одна часть кода решает одну задачу.',
  o: 'Новый сценарий добавляется новым модулем.',
  l: 'Одну реализацию можно заменить другой без сюрпризов.',
  i: 'Каждая зависимость даёт только нужные методы.',
  d: 'Важная логика зависит от интерфейса, а не от инструмента.',
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
  miniProject: string
  code: string
}

const solidPrinciples: SolidPrincipleType[] = [
  {
    id: 's',
    letter: 'S',
    title: 'S — одна задача',
    colorToken: '--chart-1',
    statement:
      'Один класс, сервис или компонент решает одну задачу. Такой код проще читать, менять и тестировать.',
    issue:
      'Один класс считает данные, сохраняет их и отправляет уведомления. Любая правка затрагивает сразу несколько зон.',
    refactor:
      'Раздели роли. Расчёт отдельно. Сохранение отдельно. Уведомления отдельно.',
    checklist: [
      'По названию файла сразу понятно, что именно он делает.',
      'Изменение письма не требует менять расчёт.',
      'Один тест проверяет одну задачу, а не весь процесс сразу.',
    ],
    miniProject:
      'Сделай выдачу счёта: расчёт налога, сохранение и уведомление оформи как три отдельные части.',
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
    title: 'O — добавляй новое рядом',
    colorToken: '--chart-2',
    statement:
      'Новый сценарий лучше добавлять отдельным модулем. Рабочий код остаётся стабильным и предсказуемым.',
    issue:
      'Все варианты живут в одном большом switch по типам платежей. Он быстро растёт и становится хрупким.',
    refactor:
      'Сделай отдельный обработчик для каждого сценария и подключай его в общий список.',
    checklist: [
      'Новый сценарий добавляется новым модулем.',
      'Старый рабочий код почти не меняется.',
      'Основной способ вызова остаётся тем же.',
    ],
    miniProject:
      'Собери модуль оплаты, где новый способ оплаты добавляется новым обработчиком, а не правкой большого switch.',
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
    title: 'L — замена без сюрпризов',
    colorToken: '--chart-3',
    statement:
      'Если у двух реализаций один интерфейс, они должны вести себя одинаково для вызывающего кода. Замена не должна ломать сценарий.',
    issue:
      'Одна реализация возвращает результат, а другая в том же месте неожиданно падает с ошибкой. Для вызывающего кода это сюрприз.',
    refactor:
      'Сделай единые правила для всех реализаций. Если это не получается, раздели их на разные интерфейсы.',
    checklist: [
      'Одинаковые методы ведут себя предсказуемо во всех реализациях.',
      'Клиентскому коду не нужны особые проверки под каждый тип.',
      'Общие ожидания закреплены тестами.',
    ],
    miniProject:
      'Сделай два экспорта отчёта, PDF и CSV, чтобы оба работали через один и тот же метод export.',
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
    title: 'I — не тащи лишние методы',
    colorToken: '--chart-4',
    statement:
      'Интерфейс должен содержать только нужные методы. Его проще понять, реализовать и подменить в тестах.',
    issue:
      'Интерфейс слишком большой. Часть методов не нужна, а в тестах приходится писать лишние заглушки.',
    refactor:
      'Разбей один большой интерфейс на несколько маленьких по ролям.',
    checklist: [
      'Класс получает только те методы, которые реально использует.',
      'В тестах минимум лишнего кода.',
      'Интерфейс легко понять с первого чтения.',
    ],
    miniProject:
      'Раздели работу с пользователем на чтение и запись: один интерфейс для поиска, другой для сохранения.',
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
    title: 'D — важный код отдельно от деталей',
    colorToken: '--chart-5',
    statement:
      'Бизнес-логика работает через простой интерфейс. База, очередь и внешний сервис подключаются отдельно.',
    issue:
      'Главный сценарий напрямую зависит от ORM, то есть библиотеки для базы, или от клиента внешнего сервиса. Такой код трудно тестировать и трудно заменить.',
    refactor:
      'Опиши интерфейс рядом с бизнес-логикой, а конкретную реализацию подключай при запуске приложения.',
    checklist: [
      'Важная логика не импортирует базу, HTTP-клиент или очередь напрямую.',
      'Инфраструктуру можно заменить без переписывания главного сценария.',
      'Юнит-тесты работают без настоящих внешних сервисов.',
    ],
    miniProject:
      'Сделай завершение заказа так, чтобы главный сценарий знал только про EventBus, а не про конкретную очередь.',
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

type SolidLongreadPropertyType = {
  isLoading?: boolean
  isEditModeOn?: boolean
  isEditModeDisabled?: boolean
}

export const SolidLongread = ({
  isLoading = false,
  isEditModeOn = false,
  isEditModeDisabled = false,
}: SolidLongreadPropertyType) => {
  const [title, setTitle] = React.useState(
    'SOLID простым языком',
  )
  const [subtitle, setSubtitle] = React.useState(
    'Пять принципов для кода, который проще читать, менять и развивать.',
  )
  const [principleSummary, setPrincipleSummary] = React.useState<
    Record<PrincipleIdType, string>
  >(() => ({ ...initialPrincipleSummary }))

  return (
    <Paper
      type="dark"
      isPaddingDisabled
      isBorderDisabled
      isRoundedCornersDisabled
      className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto grid w-full max-w-[980px] gap-4">
        <Paper
          type="glass"
          isPaddingDisabled
          isBorderDisabled
          className="space-y-4"
          isLoading={isLoading}>
          <Paper
            type="transparent"
            isPaddingDisabled
            className="space-y-5 p-4"
            isLoading={isLoading}>
            <Typography
              typography="Caption"
              color="muted-foreground"
              isLoading={isLoading}>
              SOLID
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
              color="muted-foreground"
              value={subtitle}
              onValueChange={setSubtitle}
              isLoading={isLoading}
              isEditModeOn={isEditModeOn}
              isEditModeDisabled={isEditModeDisabled}
              className="h-auto min-h-9"
            />

            <Typography typography="SectionHeader" isLoading={isLoading}>
              Пять принципов
            </Typography>

            <Typography
              typography="Body"
              color="muted-foreground"
              isLoading={isLoading}>
              Каждый блок показывает правило, проблему, решение и практику.
            </Typography>
          </Paper>

          <Paper
            type="dark"
            isBorderDisabled
            isRoundedCornersDisabled
            isPaddingDisabled
            className="space-y-4"
            isLoading={isLoading}>
            {solidPrinciples.map(principle => (
              <section
                key={principle.id}
                className="space-y-3 rounded-none border-0 bg-(--card) p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="inline-flex size-9 items-center justify-center rounded-md"
                    style={{
                      backgroundColor: `var(${principle.colorToken})`,
                      color: 'var(--background)',
                    }}>
                    <Typography
                      typography="Action"
                      element="span"
                      color="background"
                      isLoading={isLoading}>
                      {principle.letter}
                    </Typography>
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
                  <div className="space-y-2 rounded-(--radius) bg-(--background) p-3">
                    <Typography
                      typography="CompactCaption"
                      color="cautionary"
                      isLoading={isLoading}>
                      Проблема
                    </Typography>
                    <Typography typography="BodySmall" isLoading={isLoading}>
                      {principle.issue}
                    </Typography>
                  </div>
                  <div className="space-y-2 rounded-(--radius) bg-(--background) p-3">
                    <Typography
                      typography="CompactCaption"
                      color="constructive"
                      isLoading={isLoading}>
                      Решение
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
                    Что проверить
                  </Typography>
                  <ul className="list-disc space-y-1 pl-5">
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

                <div className="space-y-2 rounded-(--radius) bg-(--background) p-3">
                  <Typography
                    typography="CompactCaption"
                    color="chart-1"
                    isLoading={isLoading}>
                    Практика
                  </Typography>
                  <Typography typography="BodySmall" isLoading={isLoading}>
                    {principle.miniProject}
                  </Typography>
                </div>

                <Code
                  title={`${principle.letter} // Example`}
                  subtitle={principle.title}
                  initialCode={principle.code}
                  language="typescript"
                  type="transparent"
                  isPaddingDisabled
                  isEditMode={isEditModeOn}
                  isEditModeDisabled={isEditModeDisabled}
                  isLoading={isLoading}
                />
              </section>
            ))}

            <Paper
              type="transparent"
              isBorderDisabled
              isPaddingDisabled
              className="space-y-2 bg-(--card) p-4"
              isLoading={isLoading}>
              <Typography
                typography="CompactCaption"
                color="muted-foreground"
                isLoading={isLoading}>
                Итог
              </Typography>
              <Typography typography="Body" isLoading={isLoading}>
                Код проще поддерживать, когда у каждой части есть понятная роль
                и предсказуемое поведение.
              </Typography>
            </Paper>
          </Paper>
        </Paper>
      </div>
    </Paper>
  )
}
