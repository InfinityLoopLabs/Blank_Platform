import React, { type FC, useEffect, useRef, useState } from 'react'

// Типизация функций всегда через Callback<Value, ReturnType> или VoidFunction.
// Value — тип аргумента, ReturnType — тип возврата, по умолчанию void.
// VoidFunction — без аргументов и возвращаемого значения.
//
// Без React.memo - используется react compiler
//
// Комментирование вёрстки: {/* Описание: Начало */} <Flex> </Flex> {/* Описание: Конец */}.
// Комментировать только логические блоки, не каждую строку.
// Старые комментарии не удалять — обновлять только при изменении структуры блока.
//
// Для отображения массивов использовать только ArrayRender. import { ArrayRender } from "@infinityloop.labs/utils"
// Принимает items (массив элементов) и renderItem={(item=><JSX key={item.id} /> /)}
// Исключение — случаи, когда библиотека требует прямой map-рендер (например, слайдеры или карусели).
//
// В className использовать clsx import { clsx } from "@infinityloop.labs/utils"
//
//
// Naming: camelCase — переменные/функции; PascalCase — компоненты/типы; булевы с префиксами is/has/should/can.
// Функции именовать on***Handler.
// Полные осмысленные имена переменных и функций.
// Запрещено: использовать useCallback/useMemo React.memo - это делает react compiler

// Запрещено удалять комментарии
// Строго соблюдать правила в комментариях при чтении/парсинге файла
//
// Вместо || null использовать Nullable<%Type%> который ипортируется из Global
// Вместо классов flex flex-col использовать компонент <Flex> у него есть поля
//     column?: boolean;
//     middle?: boolean <- Сделать по центру
//     'justify-content'?: JustifyContentType;
//     'align-items'?: AlignItemsType;

const COLORS = {
  buff: '#4ADE80',
  debuff: '#F87171',
  neutral: '#9CA3AF',
  progress: '#60A5FA',
  prestige: '#FACC15',
  orange: '#ff6100',
  locked: '#444444',
}

// Preset icons for helper suggestions
type NodePresetType = {
  url: string
  label: string
}

const PRESET_ICONS: ReadonlyArray<NodePresetType> = [
  { url: '/1.png',
label: 'Core' },
  {
    url: 'https://cdn-icons-png.flaticon.com/128/3176/3176298.png',
    label: 'Speed',
  },
  {
    url: 'https://cdn-icons-png.flaticon.com/128/3176/3176382.png',
    label: 'Shield',
  },
  {
    url: 'https://cdn-icons-png.flaticon.com/128/3176/3176285.png',
    label: 'Power',
  },
  {
    url: 'https://cdn-icons-png.flaticon.com/128/3176/3176268.png',
    label: 'Mind',
  },
  {
    url: 'https://cdn-icons-png.flaticon.com/128/3176/3176355.png',
    label: 'Magic',
  },
]

type SkillNodeType = {
  id: string
  x: number
  y: number
  label: string
  imageUrl: string
  unlocked: boolean
  level: number
  maxLevel: number
  description: string
}

type SkillConnectionType = {
  from: string
  to: string
}

export type SkillTreeDataType = {
  nodes: SkillNodeType[]
  connections: SkillConnectionType[]
}

type SkillTreeProps = {
  tree?: SkillTreeDataType
  editMode?: boolean
  onChange?: Callback<SkillTreeDataType>
  width?: number
  height?: number
  title?: string
  helperCount?: number
  gridStep?: number
}

type HelperPositionType = {
  x: number
  y: number
}

type PulseType = 'buff' | 'debuff'

// ============================================
// MAIN COMPONENT
// ============================================
export const SkillTree: FC<SkillTreeProps> = ({
  // Структура дерева
  tree = {
    nodes: [],
    connections: [],
  },
  // Режим редактирования
  editMode = false,
  // Callback при изменении дерева
  onChange,
  // Размеры canvas
  width = 800,
  height = 500,
  // Заголовок
  title = 'SKILL TREE',
  // Количество помощников (симметричных подсказок)
  helperCount = 3,
  // Шаг сетки
  gridStep = 20,
}) => {
  // State
  const [nodes, setNodes] = useState<SkillNodeType[]>(tree.nodes)
  const [connections, setConnections] = useState<SkillConnectionType[]>(
    tree.connections,
  )
  const [selectedNode, setSelectedNode] = useState<Nullable<string>>(null)
  const [draggingNode, setDraggingNode] = useState<Nullable<string>>(null)
  const [connectingFrom, setConnectingFrom] = useState<Nullable<string>>(null)
  const [showHelpers, setShowHelpers] = useState<boolean>(false)
  const [helperPosition, setHelperPosition] = useState<HelperPositionType>({
    x: 0,
    y: 0,
  })
  const [editingNode, setEditingNode] = useState<Nullable<string>>(null)
  const [pulsingNode, setPulsingNode] = useState<Nullable<string>>(null)
  const [pulseType, setPulseType] = useState<Nullable<PulseType>>(null)

  const canvasRef = useRef<Nullable<HTMLDivElement>>(null)
  const containerRef = useRef<Nullable<HTMLDivElement>>(null)

  // Sync with prop changes
  useEffect(() => {
    setNodes(tree.nodes)
    setConnections(tree.connections)
  }, [tree])

  // Notify parent of changes
  const notifyChange = (
    newNodes: SkillNodeType[],
    newConnections: SkillConnectionType[],
  ): void => {
    onChange?.({
      nodes: newNodes,
      connections: newConnections,
    })
  }

  // ========== NODE OPERATIONS ==========

  const addNode = (
    x: number,
    y: number,
    preset: Nullable<NodePresetType> = null,
  ): void => {
    const newNode: SkillNodeType = {
      id: `node-${Date.now()}`,
      x: Math.round(x / gridStep) * gridStep,
      y: Math.round(y / gridStep) * gridStep,
      label: preset?.label || 'New Skill',
      imageUrl: preset?.url || PRESET_ICONS[0].url,
      unlocked: false,
      level: 0,
      maxLevel: 3,
      description: '',
    }

    const newNodes = [...nodes, newNode]
    setNodes(newNodes)
    setShowHelpers(false)
    notifyChange(newNodes, connections)

    // Auto-select for editing
    setEditingNode(newNode.id)
  }

  const updateNode = (
    nodeId: string,
    updates: Partial<SkillNodeType>,
  ): void => {
    const newNodes = nodes.map(node =>
      node.id === nodeId ? { ...node,
...updates } : node,
    )
    setNodes(newNodes)
    notifyChange(newNodes, connections)
  }

  const deleteNode = (nodeId: string): void => {
    const newNodes = nodes.filter(node => node.id !== nodeId)
    const newConnections = connections.filter(
      connection => connection.from !== nodeId && connection.to !== nodeId,
    )
    setNodes(newNodes)
    setConnections(newConnections)
    setSelectedNode(null)
    setEditingNode(null)
    notifyChange(newNodes, newConnections)
  }

  // ========== CONNECTION OPERATIONS ==========

  const addConnection = (fromId: string, toId: string): void => {
    // Check if connection already exists
    const exists = connections.some(
      connection =>
        (connection.from === fromId && connection.to === toId) ||
        (connection.from === toId && connection.to === fromId),
    )

    if (!exists && fromId !== toId) {
      const newConnection: SkillConnectionType = { from: fromId,
to: toId }
      const newConnections = [...connections, newConnection]
      setConnections(newConnections)
      notifyChange(nodes, newConnections)
    }
    setConnectingFrom(null)
  }

  const deleteConnection = (fromId: string, toId: string): void => {
    const newConnections = connections.filter(
      connection =>
        !(connection.from === fromId && connection.to === toId) &&
        !(connection.from === toId && connection.to === fromId),
    )
    setConnections(newConnections)
    notifyChange(nodes, newConnections)
  }

  // ========== DRAG OPERATIONS ==========

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement>,
    nodeId: string,
  ): void => {
    if (!editMode) {
      return
    }

    if (event.shiftKey) {
      // Start connection mode
      setConnectingFrom(nodeId)
    } else {
      setDraggingNode(nodeId)
      setSelectedNode(nodeId)
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (!draggingNode || !editMode) {
      return
    }

    const container = containerRef.current
    if (!container) {
      return
    }

    const rect = container.getBoundingClientRect()
    const x = Math.round((event.clientX - rect.left) / gridStep) * gridStep
    const y = Math.round((event.clientY - rect.top) / gridStep) * gridStep

    updateNode(draggingNode, {
      x: Math.max(40, Math.min(width - 40, x)),
      y: Math.max(40, Math.min(height - 40, y)),
    })
  }

  const handleMouseUp = (nodeId: Nullable<string> = null): void => {
    if (connectingFrom && nodeId && nodeId !== connectingFrom) {
      addConnection(connectingFrom, nodeId)
    }
    setDraggingNode(null)
    setConnectingFrom(null)
  }

  // ========== CANVAS CLICK (Add node) ==========

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (!editMode) {
      return
    }

    const target = event.target as HTMLElement | null
    const canvas = canvasRef.current
    const container = containerRef.current

    if (!container) {
      return
    }

    // Check if clicked on empty space
    if (
      target &&
      (target === canvas || target.classList.contains('skill-tree-grid'))
    ) {
      const rect = container.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      setHelperPosition({ x,
y })
      setShowHelpers(true)
      setSelectedNode(null)
      setEditingNode(null)
    }
  }

  // ========== SYMMETRICAL HELPERS ==========

  const generateHelperPositions = (): Array<{
    x: number
    y: number
    preset: NodePresetType
  }> => {
    const positions: Array<{
      x: number
      y: number
      preset: NodePresetType
    }> = []
    const radius = 80
    const angleStep = (2 * Math.PI) / helperCount

    for (let i = 0; i < helperCount; i++) {
      const angle = angleStep * i - Math.PI / 2 // Start from top
      positions.push({
        x: helperPosition.x + Math.cos(angle) * radius,
        y: helperPosition.y + Math.sin(angle) * radius,
        preset: PRESET_ICONS[i % PRESET_ICONS.length],
      })
    }

    return positions
  }

  // ========== PULSE EFFECT ==========

  const triggerPulse = (nodeId: string, type: PulseType): void => {
    setPulsingNode(nodeId)
    setPulseType(type)
    setTimeout(() => {
      setPulsingNode(null)
      setPulseType(null)
    }, 500)
  }

  // ========== NODE CLICK (View mode) ==========

  const handleNodeClick = (node: SkillNodeType): void => {
    if (!editMode) {
      // In view mode, toggle unlock or trigger effect
      if (node.unlocked) {
        triggerPulse(node.id, 'buff')
      } else {
        // Check if can unlock (has connection to unlocked node)
        const canUnlock =
          connections.some(connection => {
            const otherId =
              connection.from === node.id ? connection.to : connection.from
            const otherNode = nodes.find(
              currentNode => currentNode.id === otherId,
            )

            return otherNode?.unlocked
          }) || nodes.filter(currentNode => currentNode.unlocked).length === 0

        if (canUnlock) {
          updateNode(node.id, { unlocked: true })
          triggerPulse(node.id, 'buff')
        } else {
          triggerPulse(node.id, 'debuff')
        }
      }
    } else {
      setSelectedNode(node.id)
      setEditingNode(node.id)
    }
  }

  // ========== RENDER ==========

  return (
    <div className="bg-neutral-950 border border-orange-500/30 rounded-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-black border-b border-orange-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 text-lg">◈</span>
          <span className="text-orange-500 text-sm font-mono">{title}</span>
          {editMode && (
            <span className="text-green-500/60 text-xs font-mono ml-2">
              // EDIT MODE
            </span>
          )}
        </div>

        {editMode && (
          <div className="flex gap-2 text-xs font-mono text-neutral-500">
            <span>Click: Add</span>
            <span>•</span>
            <span>Drag: Move</span>
            <span>•</span>
            <span>Shift+Drag: Connect</span>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative bg-black/50 overflow-hidden"
        style={{ width,
height }}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={() => handleMouseUp()}
        onMouseLeave={() => {
          setDraggingNode(null)
          setConnectingFrom(null)
        }}>
        {/* Grid */}
        <div
          ref={canvasRef}
          className="skill-tree-grid absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #333 1px, transparent 1px),
              linear-gradient(to bottom, #333 1px, transparent 1px)
            `,
            backgroundSize: `${gridStep}px ${gridStep}px`,
          }}
        />

        {/* Connections SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Existing connections */}
          {connections.map((conn, i) => {
            const fromNode = nodes.find(n => n.id === conn.from)
            const toNode = nodes.find(n => n.id === conn.to)
            if (!fromNode || !toNode) {
              return null
            }

            const bothUnlocked = fromNode.unlocked && toNode.unlocked

            return (
              <g key={i}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={bothUnlocked ? COLORS.orange : '#333'}
                  strokeWidth={bothUnlocked ? 3 : 2}
                  strokeDasharray={bothUnlocked ? 'none' : '6 4'}
                  style={{
                    filter: bothUnlocked
                      ? `drop-shadow(0 0 4px ${COLORS.orange})`
                      : 'none',
                  }}
                />
                {editMode && (
                  <circle
                    cx={(fromNode.x + toNode.x) / 2}
                    cy={(fromNode.y + toNode.y) / 2}
                    r="8"
                    fill="#1a1a1a"
                    stroke="#666"
                    strokeWidth="1"
                    className="cursor-pointer hover:stroke-red-500 pointer-events-auto"
                    onClick={e => {
                      e.stopPropagation()
                      deleteConnection(conn.from, conn.to)
                    }}
                  />
                )}
                {editMode && (
                  <text
                    x={(fromNode.x + toNode.x) / 2}
                    y={(fromNode.y + toNode.y) / 2 + 4}
                    textAnchor="middle"
                    fill="#666"
                    fontSize="10"
                    className="pointer-events-none">
                    ×
                  </text>
                )}
              </g>
            )
          })}

          {/* Connection line being drawn */}
          {connectingFrom && (
            <line
              x1={nodes.find(n => n.id === connectingFrom)?.x || 0}
              y1={nodes.find(n => n.id === connectingFrom)?.y || 0}
              x2={helperPosition.x}
              y2={helperPosition.y}
              stroke={COLORS.progress}
              strokeWidth="2"
              strokeDasharray="4 4"
              className="pointer-events-none"
            />
          )}
        </svg>

        {/* Nodes */}
        {nodes.map(node => {
          const isPulsing = pulsingNode === node.id
          const isSelected = selectedNode === node.id
          const isEditing = editingNode === node.id

          return (
            <div
              key={node.id}
              className={`
                absolute transform -translate-x-1/2 -translate-y-1/2 
                ${editMode ? 'cursor-move' : 'cursor-pointer'}
                ${isPulsing && pulseType === 'debuff' ? 'animate-shake' : ''}
              `}
              style={{ left: node.x,
top: node.y }}
              onMouseDown={e => handleMouseDown(e, node.id)}
              onMouseUp={() => handleMouseUp(node.id)}
              onClick={e => {
                e.stopPropagation()
                handleNodeClick(node)
              }}>
              {/* Pulse effect */}
              {isPulsing && (
                <div
                  className="absolute inset-0 rounded-full animate-nodePulse"
                  style={{
                    backgroundColor:
                      pulseType === 'buff' ? COLORS.buff : COLORS.debuff,
                  }}
                />
              )}

              {/* Glow */}
              {node.unlocked && (
                <div
                  className="absolute inset-[-8px] rounded-full blur-md opacity-50"
                  style={{ backgroundColor: COLORS.orange }}
                />
              )}

              {/* Node circle */}
              <div
                className={`
                  relative w-16 h-16 rounded-full border-3 flex items-center justify-center
                  transition-all duration-150 overflow-hidden
                  ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''}
                `}
                style={{
                  borderWidth: 3,
                  borderColor: node.unlocked ? COLORS.orange : COLORS.locked,
                  backgroundColor: node.unlocked ? '#1a1a1a' : '#0a0a0a',
                  boxShadow: node.unlocked
                    ? `inset 0 0 20px ${COLORS.orange}40, 0 0 15px ${COLORS.orange}30`
                    : 'inset 0 0 10px rgba(0,0,0,0.5)',
                }}>
                {/* Image */}
                <img
                  src={node.imageUrl}
                  alt={node.label}
                  className={`w-8 h-8 object-contain ${node.unlocked ? 'opacity-100' : 'opacity-40 grayscale'}`}
                  draggable={false}
                />

                {/* Level indicator */}
                {node.maxLevel > 1 && (
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0.5 pb-1">
                    {Array.from({ length: node.maxLevel }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            i < node.level ? COLORS.orange : '#333',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Label */}
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                <div
                  className={`text-xs font-mono ${node.unlocked ? 'text-orange-400' : 'text-neutral-600'}`}>
                  {node.label}
                </div>
              </div>

              {/* Delete button (edit mode) */}
              {editMode && isSelected && (
                <button
                  onClick={e => {
                    e.stopPropagation()
                    deleteNode(node.id)
                  }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center hover:bg-red-400">
                  ×
                </button>
              )}
            </div>
          )
        })}

        {/* Helper suggestions */}
        {showHelpers && editMode && (
          <>
            {/* Center point */}
            <div
              className="absolute w-4 h-4 border-2 border-orange-500/50 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
              style={{ left: helperPosition.x,
top: helperPosition.y }}
            />

            {/* Helper nodes */}
            {generateHelperPositions().map((pos, i) => (
              <div
                key={i}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: pos.x,
top: pos.y }}
                onClick={e => {
                  e.stopPropagation()
                  addNode(helperPosition.x, helperPosition.y, pos.preset)
                }}>
                {/* Connection line to center */}
                <svg
                  className="absolute pointer-events-none"
                  style={{
                    width: Math.abs(pos.x - helperPosition.x) + 20,
                    height: Math.abs(pos.y - helperPosition.y) + 20,
                    left:
                      pos.x < helperPosition.x
                        ? 0
                        : -Math.abs(pos.x - helperPosition.x),
                    top:
                      pos.y < helperPosition.y
                        ? 0
                        : -Math.abs(pos.y - helperPosition.y),
                  }}>
                  <line
                    x1={
                      pos.x < helperPosition.x
                        ? Math.abs(pos.x - helperPosition.x)
                        : 0
                    }
                    y1={
                      pos.y < helperPosition.y
                        ? Math.abs(pos.y - helperPosition.y)
                        : 0
                    }
                    x2={
                      pos.x < helperPosition.x
                        ? 0
                        : Math.abs(pos.x - helperPosition.x)
                    }
                    y2={
                      pos.y < helperPosition.y
                        ? 0
                        : Math.abs(pos.y - helperPosition.y)
                    }
                    stroke={COLORS.orange}
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.3"
                  />
                </svg>

                {/* Helper node */}
                <div className="relative w-12 h-12 rounded-full border-2 border-dashed border-orange-500/50 bg-orange-500/10 flex items-center justify-center transition-all group-hover:border-orange-500 group-hover:bg-orange-500/20 group-hover:scale-110">
                  <img
                    src={pos.preset.url}
                    alt={pos.preset.label}
                    className="w-6 h-6 object-contain opacity-60 group-hover:opacity-100"
                    draggable={false}
                  />
                </div>

                <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs font-mono text-orange-500/60 group-hover:text-orange-500">
                    {pos.preset.label}
                  </span>
                </div>
              </div>
            ))}

            {/* Cancel button */}
            <button
              className="absolute transform -translate-x-1/2 text-xs font-mono text-neutral-500 hover:text-white"
              style={{ left: helperPosition.x,
top: helperPosition.y + 40 }}
              onClick={e => {
                e.stopPropagation()
                setShowHelpers(false)
              }}>
              [ESC]
            </button>
          </>
        )}
      </div>

      {/* Node Editor Panel */}
      {editMode && editingNode && (
        <div className="border-t border-orange-500/20 p-4 bg-black/50">
          <div className="text-orange-500/60 text-xs font-mono mb-3">
            NODE EDITOR
          </div>

          {(() => {
            const node = nodes.find(n => n.id === editingNode)
            if (!node) {
              return null
            }

            return (
              <div className="grid grid-cols-2 gap-4">
                {/* Label */}
                <div>
                  <label className="text-neutral-500 text-xs font-mono block mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={node.label}
                    onChange={e =>
                      updateNode(node.id, { label: e.target.value })
                    }
                    className="w-full bg-neutral-900 border border-orange-500/30 px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="text-neutral-500 text-xs font-mono block mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={node.imageUrl}
                    onChange={e =>
                      updateNode(node.id, { imageUrl: e.target.value })
                    }
                    className="w-full bg-neutral-900 border border-orange-500/30 px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label className="text-neutral-500 text-xs font-mono block mb-1">
                    Description
                  </label>
                  <textarea
                    value={node.description}
                    onChange={e =>
                      updateNode(node.id, { description: e.target.value })
                    }
                    rows={2}
                    className="w-full bg-neutral-900 border border-orange-500/30 px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                {/* Max Level */}
                <div>
                  <label className="text-neutral-500 text-xs font-mono block mb-1">
                    Max Level
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={node.maxLevel}
                    onChange={e =>
                      updateNode(node.id, {
                        maxLevel: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full bg-neutral-900 border border-orange-500/30 px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Unlocked */}
                <div>
                  <label className="text-neutral-500 text-xs font-mono block mb-1">
                    Status
                  </label>
                  <button
                    onClick={() =>
                      updateNode(node.id, { unlocked: !node.unlocked })
                    }
                    className={`w-full py-2 border font-mono text-sm transition-colors ${
                      node.unlocked
                        ? 'border-green-500 bg-green-500/20 text-green-400'
                        : 'border-neutral-700 text-neutral-500'
                    }`}>
                    {node.unlocked ? '✓ UNLOCKED' : 'LOCKED'}
                  </button>
                </div>

                {/* Preset icons */}
                <div className="col-span-2">
                  <label className="text-neutral-500 text-xs font-mono block mb-2">
                    Quick Icons
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {PRESET_ICONS.map((preset, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          updateNode(node.id, { imageUrl: preset.url })
                        }
                        className={`w-10 h-10 border rounded flex items-center justify-center transition-colors ${
                          node.imageUrl === preset.url
                            ? 'border-orange-500 bg-orange-500/20'
                            : 'border-neutral-700 hover:border-orange-500/50'
                        }`}>
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-6 h-6"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 bg-black border-t border-orange-500/20 flex items-center justify-between">
        <div className="text-neutral-600 text-xs font-mono">
          {nodes.length} nodes • {connections.length} connections
        </div>

        {editMode && (
          <button
            onClick={() => {
              console.log(JSON.stringify({ nodes,
connections }, null, 2))
              navigator.clipboard?.writeText(
                JSON.stringify({ nodes, connections }, null, 2),
              )
            }}
            className="px-3 py-1 border border-orange-500/30 text-orange-500 text-xs font-mono hover:bg-orange-500/10">
            EXPORT JSON
          </button>
        )}
      </div>

      <style>{`
        @keyframes nodePulse {
          0% { transform: scale(1) translate(-50%, -50%); opacity: 0.8; }
          100% { transform: scale(2.5) translate(-50%, -50%); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translate(-50%, -50%) rotate(0); }
          25% { transform: translate(calc(-50% - 3px), -50%) rotate(-2deg); }
          75% { transform: translate(calc(-50% + 3px), -50%) rotate(2deg); }
        }
        .animate-nodePulse { 
          animation: nodePulse 400ms ease-out forwards;
          transform-origin: center;
          position: absolute;
          inset: -10px;
          border-radius: 50%;
        }
        .animate-shake { 
          animation: shake 80ms ease-in-out 3; 
        }
      `}</style>
    </div>
  )
}

// ============================================
// DEMO
// ============================================
export default function SkillTreeDemo() {
  const [editMode, setEditMode] = useState<boolean>(true)
  const [treeData, setTreeData] = useState<SkillTreeDataType>({
    nodes: [
      {
        id: 'core',
        x: 400,
        y: 80,
        label: 'Core Mastery',
        imageUrl: 'https://cdn-icons-png.flaticon.com/128/3176/3176366.png',
        unlocked: true,
        level: 2,
        maxLevel: 3,
        description: 'Основа всех навыков',
      },
      {
        id: 'speed',
        x: 200,
        y: 200,
        label: 'Speed',
        imageUrl: 'https://cdn-icons-png.flaticon.com/128/3176/3176298.png',
        unlocked: true,
        level: 1,
        maxLevel: 5,
        description: 'Ускорение обработки',
      },
      {
        id: 'defense',
        x: 600,
        y: 200,
        label: 'Defense',
        imageUrl: 'https://cdn-icons-png.flaticon.com/128/3176/3176382.png',
        unlocked: false,
        level: 0,
        maxLevel: 3,
        description: 'Защита от ошибок',
      },
      {
        id: 'power',
        x: 150,
        y: 350,
        label: 'Power',
        imageUrl: 'https://cdn-icons-png.flaticon.com/128/3176/3176285.png',
        unlocked: false,
        level: 0,
        maxLevel: 4,
        description: 'Увеличение мощности',
      },
      {
        id: 'insight',
        x: 400,
        y: 350,
        label: 'Insight',
        imageUrl: 'https://cdn-icons-png.flaticon.com/128/3176/3176268.png',
        unlocked: false,
        level: 0,
        maxLevel: 3,
        description: 'Глубокое понимание',
      },
      {
        id: 'magic',
        x: 650,
        y: 350,
        label: 'Magic',
        imageUrl: 'https://cdn-icons-png.flaticon.com/128/3176/3176355.png',
        unlocked: false,
        level: 0,
        maxLevel: 5,
        description: 'Нестандартные решения',
      },
    ],
    connections: [
      { from: 'core',
to: 'speed' },
      { from: 'core',
to: 'defense' },
      { from: 'speed',
to: 'power' },
      { from: 'speed',
to: 'insight' },
      { from: 'defense',
to: 'insight' },
      { from: 'defense',
to: 'magic' },
    ],
  })

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-orange-500 font-mono tracking-widest">
              SKILL TREE
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Дерево навыков</h1>
          <p className="text-neutral-400">
            Редактируемое дерево с симметричными помощниками
          </p>
        </div>

        {/* Mode toggle */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setEditMode(true)}
            className={`px-4 py-2 font-mono text-sm border transition-colors ${
              editMode
                ? 'border-orange-500 bg-orange-500/20 text-orange-500'
                : 'border-neutral-700 text-neutral-500 hover:text-orange-500'
            }`}>
            ✎ EDIT MODE
          </button>
          <button
            onClick={() => setEditMode(false)}
            className={`px-4 py-2 font-mono text-sm border transition-colors ${
              !editMode
                ? 'border-orange-500 bg-orange-500/20 text-orange-500'
                : 'border-neutral-700 text-neutral-500 hover:text-orange-500'
            }`}>
            ▶ VIEW MODE
          </button>
        </div>

        {/* Skill Tree */}
        <SkillTree
          tree={treeData}
          editMode={editMode}
          onChange={setTreeData}
          width={800}
          height={450}
          helperCount={4}
        />

        {/* Instructions */}
        <div className="mt-8 p-4 bg-neutral-900/50 border border-neutral-800 rounded">
          <div className="text-orange-500/60 text-xs font-mono mb-3">
            INSTRUCTIONS
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-orange-500 font-mono mb-2">Edit Mode:</div>
              <ul className="text-neutral-400 space-y-1">
                <li>• Click canvas → Add node (with helpers)</li>
                <li>• Drag node → Move</li>
                <li>• Shift + Drag → Connect nodes</li>
                <li>• Click connection center → Delete</li>
                <li>• Click node → Edit properties</li>
              </ul>
            </div>
            <div>
              <div className="text-orange-500 font-mono mb-2">View Mode:</div>
              <ul className="text-neutral-400 space-y-1">
                <li>• Click unlocked node → Pulse effect</li>
                <li>• Click locked node → Try to unlock</li>
                <li>• Nodes unlock if connected to unlocked</li>
              </ul>
            </div>
          </div>
        </div>

        {/* JSON Output */}
        <div className="mt-4 p-4 bg-black border border-neutral-800 rounded">
          <div className="text-neutral-600 text-xs font-mono mb-2">
            TREE DATA (JSON)
          </div>
          <pre className="text-xs text-neutral-500 overflow-x-auto max-h-40">
            {JSON.stringify(treeData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
