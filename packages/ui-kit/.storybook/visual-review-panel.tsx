import React from 'react'
import { useStorybookState } from '@storybook/manager-api'
import { Slider } from '../src/components/molecules/Slider'

type ArtifactGroup = {
  id?: string | null
  testCase?: string | null
  screenshotName?: string | null
  capturedAt?: string | null
  baselineExists?: boolean
  baselinePath?: string | null
  actualPath?: string | null
  diffPath?: string | null
  diffPixels?: number | null
  diffRatio?: number | null
  width?: number | null
  height?: number | null
}

type ManifestStory = {
  storyId: string
  status?: string | null
  failureMessage?: string | null
  capturedAt?: string | null
  baselinePath?: string | null
  actualPath?: string | null
  diffPath?: string | null
  diffPixels?: number | null
  diffRatio?: number | null
  title?: string | null
  name?: string | null
  testCase?: string | null
  screenshotName?: string | null
  artifactGroups?: ArtifactGroup[] | null
}

type StateStory = {
  approved?: boolean
  approvedAt?: string | null
  approvedBy?: string | null
  rejectReason?: string | null
  rejectedAt?: string | null
  rejectedBy?: string | null
  baselinePath?: string | null
  lastRun?: {
    status?: string | null
    diffPixels?: number | null
    diffRatio?: number | null
    actualPath?: string | null
    diffPath?: string | null
    artifactGroups?: ArtifactGroup[] | null
  } | null
}

type StoriesResponse = {
  stories?: Array<{
    storyId: string
    manifest: ManifestStory | null
    state: StateStory | null
  }>
}

type RunState = {
  id?: string
  status: 'idle' | 'running' | 'passed' | 'failed'
  storyId?: string | null
  startedAt?: string | null
  finishedAt?: string | null
  exitCode?: number | null
  pid?: number | null
  stdout?: string
  stderr?: string
}

type RunResponse = {
  ok?: boolean
  run?: RunState
}

const buildApiOrigin = () => {
  if (typeof window === 'undefined') {
    return 'http://127.0.0.1:6007'
  }

  return `${window.location.protocol}//${window.location.hostname}:6007`
}

const API_ORIGIN = buildApiOrigin()
const PANEL_PADDING = 8

const requestJson = async <T,>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_ORIGIN}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  const rawText = await response.text()
  const payload = rawText.length > 0 ? JSON.parse(rawText) : null

  if (!response.ok) {
    const message =
      payload && typeof payload.error === 'string'
        ? payload.error
        : `Request failed: ${response.status} ${response.statusText}`
    throw new Error(message)
  }

  return payload as T
}

const toVisualFileUrl = (relativePath: string | null | undefined, versionToken?: string | null) =>
  relativePath
    ? `${API_ORIGIN}/api/visual/file?path=${encodeURIComponent(relativePath)}${
        versionToken ? `&v=${encodeURIComponent(versionToken)}` : ''
      }`
    : null

const toVisualArtifactUrl = (
  storyId: string | null | undefined,
  kind: 'b' | 'a' | 'd',
  artifactId?: string | null,
  versionToken?: string | null,
) =>
  storyId
    ? `${API_ORIGIN}/api/visual/artifact?storyId=${encodeURIComponent(storyId)}&kind=${kind}${
        artifactId ? `&artifactId=${encodeURIComponent(artifactId)}` : ''
      }${
        versionToken ? `&v=${encodeURIComponent(versionToken)}` : ''
      }`
    : null

const formatDateTime = (value: string | null | undefined) => {
  if (!value) {
    return 'n/a'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString()
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  opacity: 0.78,
  marginBottom: 2,
}

const valueStyle: React.CSSProperties = {
  fontSize: 12,
  lineHeight: 1.35,
}

const sectionStyle: React.CSSProperties = {
  border: '1px solid rgba(128, 128, 128, 0.35)',
  borderRadius: 6,
  padding: PANEL_PADDING,
  marginBottom: 8,
}

const buttonRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 6,
  flexWrap: 'wrap',
  marginTop: 6,
}

const actionButtonStyle: React.CSSProperties = {
  border: '1px solid rgba(128, 128, 128, 0.5)',
  borderRadius: 6,
  background: 'transparent',
  color: 'inherit',
  padding: '4px 8px',
  cursor: 'pointer',
  fontSize: 11,
}

const disabledButtonStyle: React.CSSProperties = {
  ...actionButtonStyle,
  opacity: 0.45,
  cursor: 'not-allowed',
}

const imageStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: 6,
  border: '1px solid rgba(128, 128, 128, 0.35)',
  background: '#0b0f1a',
}

const textButtonStyle: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: 'inherit',
  textDecoration: 'underline',
  padding: 0,
  cursor: 'pointer',
  fontSize: 12,
}

const statusColorByValue: Record<string, string> = {
  idle: '#64748b',
  running: '#0ea5e9',
  passed: '#22c55e',
  failed: '#ef4444',
}

type ResolvedArtifactGroup = {
  id: string
  testCase: string
  screenshotName: string | null
  capturedAt: string | null
  baselinePath: string | null
  actualPath: string | null
  diffPath: string | null
  diffPixels: number | null
  diffRatio: number | null
}

type ArtifactKind = 'baseline' | 'actual' | 'diff'

type GalleryFilters = Record<ArtifactKind, boolean>

type GalleryItem = {
  key: string
  testCase: string
  screenshotName: string | null
  capturedAt: string | null
  diffPixels: number | null
  diffRatio: number | null
  kind: ArtifactKind
  kindLabel: string
  src: string
  relativePath: string | null
  hasError: boolean
}

const normalizeArtifactValue = (value: string | null | undefined) =>
  typeof value === 'string' && value.trim().length > 0 ? value : null

const normalizeResolvedArtifactGroups = (
  manifestStory: ManifestStory | null,
  stateStory: StateStory | null,
): ResolvedArtifactGroup[] => {
  const fromArray =
    (Array.isArray(manifestStory?.artifactGroups)
      ? manifestStory?.artifactGroups
      : Array.isArray(stateStory?.lastRun?.artifactGroups)
        ? stateStory?.lastRun?.artifactGroups
        : []) ?? []

  const normalized = fromArray
    .map((artifact, index) => {
      const fallbackId =
        typeof artifact?.testCase === 'string' && artifact.testCase.trim().length > 0
          ? artifact.testCase.trim()
          : `case-${index + 1}`

      return {
        id:
          typeof artifact?.id === 'string' && artifact.id.trim().length > 0
            ? artifact.id.trim()
            : fallbackId,
        testCase:
          typeof artifact?.testCase === 'string' && artifact.testCase.trim().length > 0
            ? artifact.testCase.trim()
            : fallbackId,
        screenshotName: normalizeArtifactValue(artifact?.screenshotName),
        capturedAt: normalizeArtifactValue(artifact?.capturedAt),
        baselinePath: normalizeArtifactValue(artifact?.baselinePath),
        actualPath: normalizeArtifactValue(artifact?.actualPath),
        diffPath: normalizeArtifactValue(artifact?.diffPath),
        diffPixels: typeof artifact?.diffPixels === 'number' ? artifact.diffPixels : null,
        diffRatio: typeof artifact?.diffRatio === 'number' ? artifact.diffRatio : null,
      } satisfies ResolvedArtifactGroup
    })
    .filter(artifact => artifact.baselinePath || artifact.actualPath || artifact.diffPath)

  if (normalized.length > 0) {
    return normalized
  }

  const fallbackBaselinePath = normalizeArtifactValue(manifestStory?.baselinePath ?? stateStory?.baselinePath)
  const fallbackActualPath = normalizeArtifactValue(
    manifestStory?.actualPath ?? stateStory?.lastRun?.actualPath,
  )
  const fallbackDiffPath = normalizeArtifactValue(manifestStory?.diffPath ?? stateStory?.lastRun?.diffPath)

  if (!fallbackBaselinePath && !fallbackActualPath && !fallbackDiffPath) {
    return []
  }

  return [
    {
      id: 'default',
      testCase:
        normalizeArtifactValue(manifestStory?.testCase) ??
        normalizeArtifactValue(manifestStory?.name) ??
        'default',
      screenshotName: normalizeArtifactValue(manifestStory?.screenshotName),
      capturedAt: normalizeArtifactValue(manifestStory?.capturedAt),
      baselinePath: fallbackBaselinePath,
      actualPath: fallbackActualPath,
      diffPath: fallbackDiffPath,
      diffPixels: typeof manifestStory?.diffPixels === 'number' ? manifestStory.diffPixels : null,
      diffRatio: typeof manifestStory?.diffRatio === 'number' ? manifestStory.diffRatio : null,
    },
  ]
}

type VisualReviewPanelPropertyType = {
  isActive?: boolean
}

export const VisualReviewPanel = ({ isActive = false }: VisualReviewPanelPropertyType) => {
  const { storyId } = useStorybookState()

  const [stories, setStories] = React.useState<StoriesResponse['stories']>([])
  const [serverHealth, setServerHealth] = React.useState<'unknown' | 'ok' | 'down'>('unknown')
  const [runState, setRunState] = React.useState<RunState>({ status: 'idle' })
  const [isLoading, setIsLoading] = React.useState(false)
  const [isActionPending, setIsActionPending] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [imageErrorByKey, setImageErrorByKey] = React.useState<Record<string, boolean>>({})
  const [activeGalleryIndex, setActiveGalleryIndex] = React.useState(0)
  const [galleryRenderKey, setGalleryRenderKey] = React.useState(0)
  const [galleryFilters, setGalleryFilters] = React.useState<GalleryFilters>({
    baseline: true,
    actual: true,
    diff: true,
  })

  const fetchData = React.useCallback(async (showLoader: boolean) => {
    if (showLoader) {
      setIsLoading(true)
    }

    try {
      const [healthResult, storiesResult, runResult] = await Promise.allSettled([
        requestJson<{ status: string }>('/api/visual/health'),
        requestJson<StoriesResponse>('/api/visual/stories'),
        requestJson<RunState>('/api/visual/run'),
      ])

      setServerHealth(
        healthResult.status === 'fulfilled' && healthResult.value.status === 'ok' ? 'ok' : 'down',
      )

      if (storiesResult.status === 'fulfilled') {
        setStories(storiesResult.value.stories ?? [])
        setErrorMessage(null)
      } else {
        setErrorMessage(storiesResult.reason instanceof Error ? storiesResult.reason.message : 'Failed to fetch stories')
      }

      if (runResult.status === 'fulfilled') {
        setRunState(runResult.value)
      } else {
        setRunState({ status: 'idle' })
      }
    } finally {
      if (showLoader) {
        setIsLoading(false)
      }
    }
  }, [])

  React.useEffect(() => {
    void fetchData(true)
  }, [fetchData])

  React.useEffect(() => {
    const refreshMs = runState.status === 'running' ? 1800 : 7000
    const timer = window.setInterval(() => {
      void fetchData(false)
    }, refreshMs)

    return () => {
      window.clearInterval(timer)
    }
  }, [fetchData, runState.status])

  const currentStory = React.useMemo(
    () => stories?.find(entry => entry.storyId === storyId) ?? null,
    [stories, storyId],
  )

  const currentStoryIndex = React.useMemo(
    () => (storyId ? (stories ?? []).findIndex(entry => entry.storyId === storyId) : -1),
    [stories, storyId],
  )

  const previousStoryId =
    currentStoryIndex > 0 && stories ? stories[currentStoryIndex - 1]?.storyId : null
  const nextStoryId =
    currentStoryIndex >= 0 && stories && currentStoryIndex < stories.length - 1
      ? stories[currentStoryIndex + 1]?.storyId
      : null

  const artifactGroups = React.useMemo(
    () => normalizeResolvedArtifactGroups(currentStory?.manifest ?? null, currentStory?.state ?? null),
    [currentStory?.manifest, currentStory?.state],
  )
  const primaryArtifactGroup = artifactGroups[0] ?? null
  const refreshToken =
    runState.finishedAt ??
    runState.startedAt ??
    primaryArtifactGroup?.capturedAt ??
    currentStory?.manifest?.capturedAt ??
    null
  const artifactViewItems = React.useMemo(
    () =>
      artifactGroups.map(group => {
        const artifactId = group.id
        return {
          ...group,
          baselineSrc:
            toVisualArtifactUrl(storyId, 'b', artifactId, refreshToken) ??
            toVisualFileUrl(group.baselinePath, refreshToken),
          actualSrc:
            toVisualArtifactUrl(storyId, 'a', artifactId, refreshToken) ??
            toVisualFileUrl(group.actualPath, refreshToken),
          diffSrc:
            toVisualArtifactUrl(storyId, 'd', artifactId, refreshToken) ??
            toVisualFileUrl(group.diffPath, refreshToken),
        }
      }),
    [artifactGroups, refreshToken, storyId],
  )
  React.useEffect(() => {
    setImageErrorByKey({})
  }, [storyId, refreshToken, artifactViewItems])

  React.useEffect(() => {
    artifactViewItems.forEach(item => {
      const sources = [
        ['baseline', item.baselineSrc],
        ['actual', item.actualSrc],
        ['diff', item.diffSrc],
      ] as const

      sources.forEach(([kind, src]) => {
        if (!src) {
          return
        }

        const key = `${item.id}:${kind}`
        const image = new Image()
        image.onload = () => {
          setImageErrorByKey(previous => ({ ...previous, [key]: false }))
        }
        image.onerror = () => {
          setImageErrorByKey(previous => ({ ...previous, [key]: true }))
        }
        image.src = src
      })
    })
  }, [artifactViewItems])

  const availableImageCounts = React.useMemo(
    () =>
      artifactViewItems.reduce<Record<ArtifactKind, number>>(
        (accumulator, item) => {
          if (item.baselineSrc) {
            accumulator.baseline += 1
          }
          if (item.actualSrc) {
            accumulator.actual += 1
          }
          if (item.diffSrc) {
            accumulator.diff += 1
          }
          return accumulator
        },
        { baseline: 0, actual: 0, diff: 0 },
      ),
    [artifactViewItems],
  )

  const galleryItems = React.useMemo<GalleryItem[]>(
    () =>
      artifactViewItems.flatMap(item => {
        const variants = [
          {
            kind: 'baseline' as const,
            kindLabel: 'Previous',
            src: item.baselineSrc,
            relativePath: item.baselinePath,
          },
          {
            kind: 'actual' as const,
            kindLabel: 'Current',
            src: item.actualSrc,
            relativePath: item.actualPath,
          },
          {
            kind: 'diff' as const,
            kindLabel: 'Delta',
            src: item.diffSrc,
            relativePath: item.diffPath,
          },
        ]

        return variants
          .filter(variant => galleryFilters[variant.kind] && Boolean(variant.src))
          .map(variant => ({
            key: `${item.id}:${variant.kind}`,
            testCase: item.testCase,
            screenshotName: item.screenshotName,
            capturedAt: item.capturedAt,
            diffPixels: item.diffPixels,
            diffRatio: item.diffRatio,
            kind: variant.kind,
            kindLabel: variant.kindLabel,
            src: variant.src as string,
            relativePath: variant.relativePath,
            hasError: imageErrorByKey[`${item.id}:${variant.kind}`] === true,
          }))
      }),
    [artifactViewItems, galleryFilters, imageErrorByKey],
  )
  React.useEffect(() => {
    if (galleryItems.length === 0) {
      setActiveGalleryIndex(0)
      return
    }

    if (activeGalleryIndex > galleryItems.length - 1) {
      setActiveGalleryIndex(galleryItems.length - 1)
    }
  }, [activeGalleryIndex, galleryItems.length])
  const activeGalleryItem = galleryItems[activeGalleryIndex] ?? null
  React.useEffect(() => {
    if (!isActive) {
      return
    }

    setGalleryRenderKey(previous => previous + 1)
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'))
    })
  }, [isActive, galleryItems.length])
  React.useEffect(() => {
    if (!isActive) {
      return
    }

    const handleHorizontalWheel = (event: WheelEvent) => {
      const horizontalDelta = Math.abs(event.deltaX)
      const verticalDelta = Math.abs(event.deltaY)
      const isHorizontalGesture =
        horizontalDelta > 4 && horizontalDelta > verticalDelta * 1.1

      if (!isHorizontalGesture) {
        return
      }

      const target = event.target as HTMLElement | null
      if (!target?.closest('[data-visual-artifacts-slider="true"]')) {
        return
      }

      if (event.cancelable) {
        event.preventDefault()
      }
    }

    window.addEventListener('wheel', handleHorizontalWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleHorizontalWheel)
    }
  }, [isActive])

  const withAction = async (action: () => Promise<void>) => {
    setIsActionPending(true)
    setErrorMessage(null)

    try {
      await action()
      await fetchData(false)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown action error')
    } finally {
      setIsActionPending(false)
    }
  }

  const runAll = () =>
    withAction(async () => {
      const response = await requestJson<RunResponse>('/api/visual/run', {
        method: 'POST',
        body: JSON.stringify({}),
      })

      if (response.run) {
        setRunState(response.run)
      }
    })

  const runCurrent = () => {
    if (!storyId) {
      return
    }

    void withAction(async () => {
      const response = await requestJson<RunResponse>('/api/visual/run', {
        method: 'POST',
        body: JSON.stringify({ storyId }),
      })

      if (response.run) {
        setRunState(response.run)
      }
    })
  }

  const rebuildManifest = () =>
    withAction(async () => {
      await requestJson('/api/visual/rebuild', {
        method: 'POST',
        body: JSON.stringify({}),
      })
    })

  const approveCurrent = () => {
    if (!storyId) {
      return
    }

    void withAction(async () => {
      await requestJson('/api/visual/approve', {
        method: 'POST',
        body: JSON.stringify({
          storyId,
          approvedBy: 'storybook-panel',
        }),
      })
    })
  }

  const rejectCurrent = () => {
    if (!storyId) {
      return
    }

    void withAction(async () => {
      await requestJson('/api/visual/reject', {
        method: 'POST',
        body: JSON.stringify({
          storyId,
          rejectedBy: 'storybook-panel',
          reason: 'Rejected in Storybook visual panel',
        }),
      })
    })
  }

  const navigateToStory = (targetStoryId: string | null) => {
    if (!targetStoryId) {
      return
    }

    window.location.assign(`?path=/story/${targetStoryId}`)
  }

  const isRunBusy = runState.status === 'running'
  const disableActions = isActionPending || isRunBusy
  const manifestStatus = currentStory?.manifest?.status ?? currentStory?.state?.lastRun?.status ?? 'n/a'
  const primaryDiffPixels =
    primaryArtifactGroup?.diffPixels ??
    currentStory?.manifest?.diffPixels ??
    currentStory?.state?.lastRun?.diffPixels ??
    null
  const primaryDiffRatio =
    primaryArtifactGroup?.diffRatio ??
    currentStory?.manifest?.diffRatio ??
    currentStory?.state?.lastRun?.diffRatio ??
    null

  return (
    <div
      style={{
        padding: PANEL_PADDING,
        fontFamily: 'Inter, system-ui, sans-serif',
        overflow: 'auto',
        overscrollBehaviorX: 'contain',
        scrollBehavior: 'smooth',
      }}
    >
      <style>
        {`
          [data-visual-artifacts-slider="true"] .swiper-slide {
            width: auto !important;
          }
        `}
      </style>
      <div style={sectionStyle}>
        <div style={labelStyle}>Server</div>
        <div style={valueStyle}>
          {API_ORIGIN}
          {' | '}
          <strong
            style={{
              color:
                serverHealth === 'ok'
                  ? '#22c55e'
                  : serverHealth === 'down'
                    ? '#ef4444'
                    : '#64748b',
            }}
          >
            {serverHealth}
          </strong>
        </div>
        <div style={buttonRowStyle}>
          <button
            type="button"
            style={disableActions ? disabledButtonStyle : actionButtonStyle}
            onClick={() => void fetchData(true)}
            disabled={disableActions}
          >
            Refresh
          </button>
          <button
            type="button"
            style={disableActions ? disabledButtonStyle : actionButtonStyle}
            onClick={() => void runAll()}
            disabled={disableActions}
          >
            Run All
          </button>
          <button
            type="button"
            style={disableActions ? disabledButtonStyle : actionButtonStyle}
            onClick={() => void rebuildManifest()}
            disabled={disableActions}
          >
            Rebuild Manifest
          </button>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle}>Current Story</div>
        <div style={valueStyle}>
          <strong>{storyId ?? 'not selected'}</strong>
        </div>
        <div style={{ ...valueStyle, marginTop: 4 }}>
          Title: {currentStory?.manifest?.title ?? 'n/a'}
          {' | '}
          Name: {currentStory?.manifest?.name ?? 'n/a'}
        </div>
        <div style={{ ...valueStyle, marginTop: 4 }}>
          Visual status: <strong>{manifestStatus}</strong>
          {' | '}
          Approved: <strong>{String(currentStory?.state?.approved ?? false)}</strong>
        </div>
        <div style={{ ...valueStyle, marginTop: 4 }}>
          Diff pixels: {primaryDiffPixels ?? 'n/a'}
          {' | '}
          Diff ratio: {primaryDiffRatio ?? 'n/a'}
          {' | '}
          Artifact groups: {artifactViewItems.length}
        </div>
        <div style={buttonRowStyle}>
          <button
            type="button"
            style={disableActions || !storyId ? disabledButtonStyle : actionButtonStyle}
            onClick={runCurrent}
            disabled={disableActions || !storyId}
          >
            Run Current
          </button>
          <button
            type="button"
            style={disableActions || !storyId ? disabledButtonStyle : actionButtonStyle}
            onClick={approveCurrent}
            disabled={disableActions || !storyId}
          >
            Approve
          </button>
          <button
            type="button"
            style={disableActions || !storyId ? disabledButtonStyle : actionButtonStyle}
            onClick={rejectCurrent}
            disabled={disableActions || !storyId}
          >
            Reject
          </button>
          <button
            type="button"
            style={!previousStoryId ? disabledButtonStyle : actionButtonStyle}
            onClick={() => navigateToStory(previousStoryId)}
            disabled={!previousStoryId}
          >
            Previous Story
          </button>
          <button
            type="button"
            style={!nextStoryId ? disabledButtonStyle : actionButtonStyle}
            onClick={() => navigateToStory(nextStoryId)}
            disabled={!nextStoryId}
          >
            Next Story
          </button>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle}>Run State</div>
        <div style={valueStyle}>
          Status:{' '}
          <strong style={{ color: statusColorByValue[runState.status] ?? 'inherit' }}>
            {runState.status}
          </strong>
          {' | '}
          Story: {runState.storyId ?? 'all'}
          {' | '}
          PID: {runState.pid ?? 'n/a'}
        </div>
        <div style={{ ...valueStyle, marginTop: 4 }}>
          Started: {formatDateTime(runState.startedAt)}
          {' | '}
          Finished: {formatDateTime(runState.finishedAt)}
          {' | '}
          Exit: {runState.exitCode ?? 'n/a'}
        </div>
        {(runState.stderr?.trim().length ?? 0) > 0 ? (
          <details style={{ marginTop: 8 }}>
            <summary style={{ cursor: 'pointer' }}>stderr</summary>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 11 }}>{runState.stderr}</pre>
          </details>
        ) : null}
        {(runState.stdout?.trim().length ?? 0) > 0 ? (
          <details style={{ marginTop: 8 }}>
            <summary style={{ cursor: 'pointer' }}>stdout</summary>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 11 }}>{runState.stdout}</pre>
          </details>
        ) : null}
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle}>Visual Artifacts</div>
        {artifactViewItems.length > 0 ? (
          <>
            <div style={{ ...buttonRowStyle, marginTop: 8 }}>
              <label style={{ ...valueStyle, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="checkbox"
                  checked={galleryFilters.baseline}
                  onChange={event =>
                    setGalleryFilters(previous => ({ ...previous, baseline: event.target.checked }))
                  }
                />
                Previous ({availableImageCounts.baseline})
              </label>
              <label style={{ ...valueStyle, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="checkbox"
                  checked={galleryFilters.actual}
                  onChange={event =>
                    setGalleryFilters(previous => ({ ...previous, actual: event.target.checked }))
                  }
                />
                Current ({availableImageCounts.actual})
              </label>
              <label style={{ ...valueStyle, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="checkbox"
                  checked={galleryFilters.diff}
                  onChange={event =>
                    setGalleryFilters(previous => ({ ...previous, diff: event.target.checked }))
                  }
                />
                Delta ({availableImageCounts.diff})
              </label>
            </div>

            {galleryItems.length > 0 ? (
              <div style={{ marginTop: 6 }}>
                <div
                  data-visual-artifacts-slider="true"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '0 40px',
                  }}
                >
                  <Slider
                    key={`visual-gallery-${galleryRenderKey}`}
                    slidesPerView={'auto'}
                    spaceBetween={12}
                    isLoopEnabled={galleryItems.length > 1}
                    isPaginationVisible={true}
                    isNavigationEnabled={true}
                    isArrowsVisible={true}
                    isMousewheelEnabled={true}
                    isKeyboardEnabled={true}
                    isGrabCursorVisible={true}
                    isFreeScrollEnabled={true}
                    onSlideChange={setActiveGalleryIndex}
                  >
                    {galleryItems.map(item => (
                      <div
                        key={item.key}
                        style={{
                          width: 'clamp(280px, 28vw, 460px)',
                          maxWidth: 'calc(100vw - 160px)',
                        }}
                      >
                        {item.hasError ? (
                          <div style={{ ...valueStyle, opacity: 0.72, padding: 10 }}>
                            Failed to render image preview
                          </div>
                        ) : (
                          <img
                            src={item.src}
                            alt={`${item.kindLabel} ${item.testCase}`}
                            style={{ ...imageStyle, border: 'none', borderRadius: 8 }}
                          />
                        )}
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            ) : (
              <div style={{ ...valueStyle, opacity: 0.72, marginTop: 8 }}>
                No screenshots for selected filters
              </div>
            )}

            {activeGalleryItem ? (
              <div style={{ marginTop: 6 }}>
                <div
                  style={{
                    ...valueStyle,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={`${activeGalleryItem.kindLabel} | ${activeGalleryItem.testCase}${
                    activeGalleryItem.screenshotName ? ` | ${activeGalleryItem.screenshotName}` : ''
                  }`}
                >
                  <strong>{activeGalleryItem.kindLabel}</strong>
                  {' | '}
                  {activeGalleryItem.testCase}
                  {activeGalleryItem.screenshotName ? ` | ${activeGalleryItem.screenshotName}` : ''}
                </div>
                <div style={{ ...valueStyle, marginTop: 2 }}>
                  Diff pixels: {activeGalleryItem.diffPixels ?? 'n/a'}
                  {' | '}
                  Diff ratio: {activeGalleryItem.diffRatio ?? 'n/a'}
                  {' | '}
                  Captured: {formatDateTime(activeGalleryItem.capturedAt)}
                  {' | '}
                  Slide: {activeGalleryIndex + 1}/{galleryItems.length}
                </div>
                <a
                  href={activeGalleryItem.src}
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...valueStyle, display: 'inline-block', marginTop: 4 }}
                >
                  Open image
                </a>
                <details style={{ marginTop: 4 }}>
                  <summary style={{ cursor: 'pointer', fontSize: 11, opacity: 0.82 }}>Path</summary>
                  <div style={{ ...valueStyle, marginTop: 4, wordBreak: 'break-all', opacity: 0.72 }}>
                    {activeGalleryItem.relativePath ?? 'n/a'}
                  </div>
                </details>
              </div>
            ) : null}
          </>
        ) : (
          <div style={{ ...valueStyle, opacity: 0.72 }}>No screenshot artifacts for current story</div>
        )}
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle}>Summary</div>
        <div style={valueStyle}>Stories in visual manifest/state: {(stories ?? []).length}</div>
        <div style={{ ...valueStyle, marginTop: 4 }}>
          Loading: {String(isLoading)} | Action pending: {String(isActionPending)}
        </div>
        {errorMessage ? (
          <div style={{ ...valueStyle, marginTop: 8, color: '#ef4444' }}>
            {errorMessage}
          </div>
        ) : null}
        {!errorMessage && runState.status === 'running' ? (
          <button type="button" style={{ ...textButtonStyle, marginTop: 8 }} onClick={() => void fetchData(true)}>
            Update run status now
          </button>
        ) : null}
      </div>
    </div>
  )
}
