import { useState, type DragEvent } from 'react'
import { clsx } from '@infinityloop.labs/utils'

import {
  EditableTypography,
  Paper,
  Typography,
  type TypographyColorType,
} from '@/components'

type SkillStatusType = 'изучено' | 'понято' | 'применено' | 'проверено'
type ClaimStrengthType = 'слабый' | 'средний' | 'сильный' | 'проверено'
type ClaimProofType = 'учебный' | 'пет-проект' | 'прод'
type LaneType = 'inventory' | 'cv'

type ClaimCardType = {
  id: string
  domain: string
  skillTitle: string
  summary: string
  line: string
  status: SkillStatusType
  strength: ClaimStrengthType
  proofType: ClaimProofType
  evidenceCount: number
  gapCount: number
  note: string
  nextAction: string
  isLocked: boolean
}

type DragStateType = {
  cardId: string
  sourceLane: LaneType
} | null

type SkillInventoryCvBuilderPropertyType = {
  roleTitle?: string
  userId?: string
}

const claimStrengthColorDictionary: Record<
  ClaimStrengthType,
  TypographyColorType
> = {
  слабый: 'destructive',
  средний: 'cautionary',
  сильный: 'chart-1',
  проверено: 'constructive',
}

const proofTypeColorDictionary: Record<ClaimProofType, TypographyColorType> = {
  учебный: 'secondary',
  'пет-проект': 'chart-4',
  прод: 'muted-foreground',
}

const statusColorDictionary: Record<SkillStatusType, TypographyColorType> = {
  изучено: 'muted-foreground',
  понято: 'secondary',
  применено: 'chart-2',
  проверено: 'constructive',
}

const claimCardsDictionary: Record<string, ClaimCardType> = {
  'failover-analysis': {
    id: 'failover-analysis',
    domain: 'Распределённые системы',
    skillTitle: 'Failover и восстановление сервисов',
    summary: 'Есть разбор failover, но нет рабочего примера.',
    line: 'Я могу проанализировать сценарии failover для реплицированного API-кластера, разобрав домены отказа, ограничения консенсуса и пути восстановления.',
    status: 'понято',
    strength: 'средний',
    proofType: 'учебный',
    evidenceCount: 3,
    gapCount: 2,
    note: 'Пока слабо.',
    nextAction: 'Провести failover drill и записать результат.',
    isLocked: false,
  },
  'failover-application': {
    id: 'failover-application',
    domain: 'Распределённые системы',
    skillTitle: 'Failover и recovery drills',
    summary: 'Есть применение: drill, заметки, сравнение warm standby.',
    line: 'Я применил многоузловой чеклист failover для сервиса обработки задач: провёл recovery drills, зафиксировал переходы состояния и сравнил варианты warm standby.',
    status: 'применено',
    strength: 'сильный',
    proofType: 'пет-проект',
    evidenceCount: 3,
    gapCount: 1,
    note: 'Можно использовать.',
    nextAction: 'Добавить короткий post-drill summary.',
    isLocked: false,
  },
  'db-tradeoff': {
    id: 'db-tradeoff',
    domain: 'Базы данных',
    skillTitle: 'Trade-off индексов и латентности',
    summary: 'Есть query-plan review и обсуждения.',
    line: 'Я понимаю trade-off между дизайном индексов, write amplification и бюджетом латентности, сравнивая query plan с операционными ограничениями.',
    status: 'проверено',
    strength: 'проверено',
    proofType: 'прод',
    evidenceCount: 3,
    gapCount: 0,
    note: 'Готово.',
    nextAction: 'Оставить одну supporting story для интервью.',
    isLocked: false,
  },
  'frontend-review': {
    id: 'frontend-review',
    domain: 'Фронтенд',
    skillTitle: 'Instrumentирование UI и анализ рендера',
    summary: 'Есть разбор, но нет прикладного кейса.',
    line: 'Я могу проанализировать стоимость рендера и churn состояния в dashboard-поверхности, разобрав interaction traces, loading states и границы компонентов.',
    status: 'изучено',
    strength: 'слабый',
    proofType: 'учебный',
    evidenceCount: 2,
    gapCount: 3,
    note: 'Пока не доказано.',
    nextAction: 'Измерить один экран до и после.',
    isLocked: false,
  },
  'systems-thinking': {
    id: 'systems-thinking',
    domain: 'Системное мышление',
    skillTitle: 'Карта ограничений между продуктом и архитектурой',
    summary: 'Есть направление, но claim не собран.',
    line: 'Я умею описывать архитектурные trade-off через ограничения продукта, риски внедрения и последствия для delivery.',
    status: 'изучено',
    strength: 'средний',
    proofType: 'учебный',
    evidenceCount: 1,
    gapCount: 2,
    note: 'Слишком общее.',
    nextAction: 'Взять один кейс и собрать claim.',
    isLocked: false,
  },
  'failover-production': {
    id: 'failover-production',
    domain: 'Распределённые системы',
    skillTitle: 'Продовый recovery claim',
    summary: 'Без production-proof нельзя использовать.',
    line: 'Я понимаю trade-off между active-passive и active-active стратегиями восстановления для пользовательских сервисов, балансируя операционную сложность, blast radius и уверенность в восстановлении.',
    status: 'проверено',
    strength: 'проверено',
    proofType: 'прод',
    evidenceCount: 1,
    gapCount: 1,
    note: 'Пока заблокировано.',
    nextAction: 'Добавить production review или incident note.',
    isLocked: true,
  },
}

const initialLanes: Record<LaneType, string[]> = {
  inventory: [
    'failover-analysis',
    'frontend-review',
    'systems-thinking',
    'failover-production',
  ],
  cv: ['failover-application', 'db-tradeoff'],
}

const moveCard = ({
  lanes,
  cardId,
  targetLane,
  targetIndex,
}: {
  lanes: Record<LaneType, string[]>
  cardId: string
  targetLane: LaneType
  targetIndex?: number
}) => {
  const nextInventory = lanes.inventory.filter(id => id !== cardId)
  const nextCv = lanes.cv.filter(id => id !== cardId)
  const targetCards = targetLane === 'inventory' ? nextInventory : nextCv
  const resolvedTargetIndex =
    targetIndex === undefined ? targetCards.length : targetIndex

  targetCards.splice(resolvedTargetIndex, 0, cardId)

  return {
    inventory: targetLane === 'inventory' ? targetCards : nextInventory,
    cv: targetLane === 'cv' ? targetCards : nextCv,
  } satisfies Record<LaneType, string[]>
}

const groupInventoryCards = (cardIds: string[]) =>
  cardIds.reduce<Record<string, ClaimCardType[]>>((accumulator, cardId) => {
    const card = claimCardsDictionary[cardId]
    accumulator[card.domain] = accumulator[card.domain] ?? []
    accumulator[card.domain].push(card)

    return accumulator
  }, {})

function EmptyLane({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-(--radius) border border-dashed border-white/10 px-4 py-6">
      <Typography typography="CompactHeader">{title}</Typography>
      <Typography typography="BodySmall" className="mt-2">
        {description}
      </Typography>
    </div>
  )
}

function ClaimCard({
  card,
  lane,
  isDragging,
  onDragStart,
  onDragEnd,
  onDropToCard,
}: {
  card: ClaimCardType
  lane: LaneType
  isDragging: boolean
  onDragStart: (event: DragEvent<HTMLElement>) => void
  onDragEnd: () => void
  onDropToCard: (event: DragEvent<HTMLElement>) => void
}) {
  return (
    <article
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={event => event.preventDefault()}
      onDrop={onDropToCard}
      className={clsx(
        'cursor-grab border-b border-white/10 py-4 active:cursor-grabbing',
        isDragging && 'opacity-35',
      )}>
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Typography typography="CompactCaption">{card.domain}</Typography>
            <Typography
              typography="CompactCaption"
              color={statusColorDictionary[card.status]}>
              {card.status}
            </Typography>
            <Typography
              typography="CompactCaption"
              color={proofTypeColorDictionary[card.proofType]}>
              {card.proofType}
            </Typography>
            <Typography
              typography="CompactCaption"
              color={claimStrengthColorDictionary[card.strength]}>
              {card.strength}
            </Typography>
          </div>

          <Typography typography="CompactHeader">{card.skillTitle}</Typography>

          <Typography typography="BodySmall">{card.summary}</Typography>
        </div>

        <div className="space-y-2">
          <Typography typography="Body">{card.line}</Typography>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Typography typography="CompactCaption">
              {card.evidenceCount} evidence
            </Typography>
            <Typography typography="CompactCaption">
              {card.gapCount} gaps
            </Typography>
            {card.isLocked ? (
              <Typography typography="CompactCaption" color="cautionary">
                прод-claim заблокирован
              </Typography>
            ) : null}
            <Typography typography="CompactCaption">
              {lane === 'inventory' ? 'перетащи вправо' : 'перетащи влево'}
            </Typography>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <Typography typography="BodySmall">{card.note}</Typography>
          <Typography typography="BodySmall" color="muted-foreground">
            Следующее: {card.nextAction}
          </Typography>
        </div>
      </div>
    </article>
  )
}

function SkillInventoryCvBuilder({
  roleTitle = 'Backend / senior',
  userId = '#user-0142',
}: SkillInventoryCvBuilderPropertyType) {
  const [lanes, setLanes] = useState(initialLanes)
  const [dragState, setDragState] = useState<DragStateType>(null)
  const [activeLane, setActiveLane] = useState<LaneType | null>(null)
  const [cvTitle, setCvTitle] = useState(roleTitle)

  const inventoryGroups = groupInventoryCards(lanes.inventory)
  const cvCards = lanes.cv.map(cardId => claimCardsDictionary[cardId])

  const onLaneDrop = (targetLane: LaneType, targetIndex?: number) => {
    if (!dragState) {
      return
    }

    setLanes(currentLanes =>
      moveCard({
        lanes: currentLanes,
        cardId: dragState.cardId,
        targetLane,
        targetIndex,
      }),
    )
    setDragState(null)
    setActiveLane(null)
  }

  return (
    <div className="min-h-screen bg-(--background) p-4 text-(--foreground) md:p-6 xl:p-8">
      <div className="mx-auto max-w-[1380px] space-y-6">
        <Paper
          type="transparent"
          className="space-y-4 border-white/10 bg-(--background)/70">
          <div className="space-y-1">
            <Typography typography="Caption" color="chart-1">
              {userId}
            </Typography>
            <Typography typography="Heading">{roleTitle}</Typography>
          </div>
        </Paper>

        <div className="grid gap-6 xl:grid-cols-2">
          <Paper
            type="transparent"
            className={clsx(
              'space-y-4 border-white/10 bg-(--background)/65',
              activeLane === 'inventory' && 'border-(--chart-1)',
            )}
            onDragOver={event => {
              event.preventDefault()
              setActiveLane('inventory')
            }}
            onDragLeave={() => {
              if (activeLane === 'inventory') {
                setActiveLane(null)
              }
            }}
            onDrop={() => onLaneDrop('inventory')}>
            <div className="space-y-2">
              <Typography typography="SectionHeader">
                Инвентарь навыков
              </Typography>
              <Typography typography="BodySmall">
                Черновики и слабые claims.
              </Typography>
            </div>

            {lanes.inventory.length === 0 ? (
              <EmptyLane
                title="Слева пусто"
                description="Все строки уже справа."
              />
            ) : (
              Object.entries(inventoryGroups).map(([domain, cards]) => (
                <section key={domain} className="space-y-1">
                  <Typography typography="Caption">{domain}</Typography>
                  <div>
                    {cards.map(card => (
                      <ClaimCard
                        key={card.id}
                        card={card}
                        lane="inventory"
                        isDragging={dragState?.cardId === card.id}
                        onDragStart={event => {
                          event.dataTransfer.effectAllowed = 'move'
                          setDragState({
                            cardId: card.id,
                            sourceLane: 'inventory',
                          })
                        }}
                        onDragEnd={() => {
                          setDragState(null)
                          setActiveLane(null)
                        }}
                        onDropToCard={event => {
                          event.preventDefault()
                          const targetIndex = lanes.inventory.indexOf(card.id)
                          onLaneDrop('inventory', targetIndex)
                        }}
                      />
                    ))}
                  </div>
                </section>
              ))
            )}
          </Paper>

          <Paper
            type="transparent"
            className={clsx(
              'space-y-4 border-white/10 bg-(--background)/65',
              activeLane === 'cv' && 'border-(--chart-1)',
            )}
            onDragOver={event => {
              event.preventDefault()
              setActiveLane('cv')
            }}
            onDragLeave={() => {
              if (activeLane === 'cv') {
                setActiveLane(null)
              }
            }}
            onDrop={() => onLaneDrop('cv')}>
            <div className="flex items-center justify-between gap-4">
              <Typography typography="SectionHeader">CV</Typography>
              <EditableTypography
                typography="CompactCaption"
                element="span"
                value={cvTitle}
                placeholder="Должность"
                onValueChange={setCvTitle}
                contentClassName="truncate whitespace-nowrap text-right"
                className="max-w-[260px] md:max-w-[320px]"
              />
            </div>

            {cvCards.length === 0 ? (
              <EmptyLane
                title="Пока ничего не выбрано"
                description="Перетащи строку слева."
              />
            ) : (
              <div>
                {cvCards.map(card => (
                  <ClaimCard
                    key={card.id}
                    card={card}
                    lane="cv"
                    isDragging={dragState?.cardId === card.id}
                    onDragStart={event => {
                      event.dataTransfer.effectAllowed = 'move'
                      setDragState({
                        cardId: card.id,
                        sourceLane: 'cv',
                      })
                    }}
                    onDragEnd={() => {
                      setDragState(null)
                      setActiveLane(null)
                    }}
                    onDropToCard={event => {
                      event.preventDefault()
                      const targetIndex = lanes.cv.indexOf(card.id)
                      onLaneDrop('cv', targetIndex)
                    }}
                  />
                ))}
              </div>
            )}
          </Paper>
        </div>
      </div>
    </div>
  )
}

export { SkillInventoryCvBuilder }
