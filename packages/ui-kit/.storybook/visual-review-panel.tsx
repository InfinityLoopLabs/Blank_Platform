import React from 'react'
import { useStorybookState } from '@storybook/manager-api'
import { Slider2 } from '../src/components/molecules/Slider2'

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
const PANEL_PADDING = 12

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
  fontSize: 12,
  opacity: 0.78,
  marginBottom: 4,
}

const valueStyle: React.CSSProperties = {
  fontSize: 13,
}

const sectionStyle: React.CSSProperties = {
  border: '1px solid rgba(128, 128, 128, 0.35)',
  borderRadius: 8,
  padding: PANEL_PADDING,
  marginBottom: 10,
}

const buttonRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  marginTop: 10,
}

const actionButtonStyle: React.CSSProperties = {
  border: '1px solid rgba(128, 128, 128, 0.5)',
  borderRadius: 6,
  background: 'transparent',
  color: 'inherit',
  padding: '6px 10px',
  cursor: 'pointer',
  fontSize: 12,
}

const disabledButtonStyle: React.CSSProperties = {
  ...actionButtonStyle,
  opacity: 0.45,
  cursor: 'not-allowed',
}

const imageGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 10,
  marginTop: 10,
}

const imageCardStyle: React.CSSProperties = {
  border: '1px solid rgba(128, 128, 128, 0.35)',
  borderRadius: 8,
  padding: 8,
  minHeight: 100,
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

const renderImageCard = (
  title: string,
  src: string | null | undefined,
  relativePath: string | null | undefined,
  fallbackMessage: string,
  hasError: boolean,
) => {
  return (
    <div style={imageCardStyle}>
      <div style={{ ...labelStyle, marginBottom: 6 }}>{title}</div>
      {src && !hasError ? (
        <img src={src} alt={title} style={imageStyle} />
      ) : (
        <div style={{ ...valueStyle, opacity: 0.72 }}>
          {hasError ? 'Failed to render image preview' : fallbackMessage}
        </div>
      )}
      {src ? (
        <a href={src} target="_blank" rel="noreferrer" style={{ ...valueStyle, display: 'inline-block', marginTop: 6 }}>
          Open image
        </a>
      ) : null}
      <div style={{ ...valueStyle, marginTop: 6, wordBreak: 'break-all', opacity: 0.7 }}>
        {relativePath ?? 'n/a'}
      </div>
    </div>
  )
}

export const VisualReviewPanel = () => {
  const { storyId } = useStorybookState()

  const [stories, setStories] = React.useState<StoriesResponse['stories']>([])
  const [serverHealth, setServerHealth] = React.useState<'unknown' | 'ok' | 'down'>('unknown')
  const [runState, setRunState] = React.useState<RunState>({ status: 'idle' })
  const [isLoading, setIsLoading] = React.useState(false)
  const [isActionPending, setIsActionPending] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [imageErrorByKey, setImageErrorByKey] = React.useState<Record<string, boolean>>({})

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
    <div style={{ padding: PANEL_PADDING, fontFamily: 'Inter, system-ui, sans-serif', overflow: 'auto' }}>
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
        <div style={labelStyle}>Screenshots</div>
        {artifactViewItems.length > 0 ? (
          <>
            <div style={{ ...sectionStyle, marginTop: 10, marginBottom: 0, padding: 10 }}>
              <div style={labelStyle}>Gallery (Actual by Step)</div>
              <Slider2
                slidesPerView={1}
                spaceBetween={12}
                isLoopEnabled={artifactViewItems.length > 1}
                isPaginationVisible={true}
                isNavigationEnabled={true}
                isArrowsVisible={true}
                isMousewheelEnabled={false}
                isKeyboardEnabled={true}
                isGrabCursorVisible={true}
                isFreeScrollEnabled={false}
              >
                {artifactViewItems.map(item => (
                  <div key={`gallery-${item.id}`} style={{ padding: 4 }}>
                    <div style={{ ...labelStyle, marginBottom: 8 }}>
                      {item.testCase}
                      {item.screenshotName ? ` | ${item.screenshotName}` : ''}
                    </div>
                    {item.actualSrc ? (
                      <img src={item.actualSrc} alt={`Actual ${item.testCase}`} style={imageStyle} />
                    ) : (
                      <div style={{ ...valueStyle, opacity: 0.72 }}>No actual screenshot</div>
                    )}
                  </div>
                ))}
              </Slider2>
            </div>

            {artifactViewItems.map(item => (
              <div
                key={item.id}
                style={{
                  ...sectionStyle,
                  marginTop: 10,
                  marginBottom: 0,
                  padding: 10,
                }}
              >
                <div style={labelStyle}>
                  Case: {item.testCase}
                  {item.screenshotName ? ` | File: ${item.screenshotName}` : ''}
                </div>
                <div style={{ ...valueStyle, marginBottom: 8 }}>
                  Diff pixels: {item.diffPixels ?? 'n/a'}
                  {' | '}
                  Diff ratio: {item.diffRatio ?? 'n/a'}
                  {' | '}
                  Captured: {formatDateTime(item.capturedAt)}
                </div>
                <div style={imageGridStyle}>
                  {renderImageCard(
                    'Baseline (previous)',
                    item.baselineSrc,
                    item.baselinePath,
                    'No baseline',
                    imageErrorByKey[`${item.id}:baseline`] === true,
                  )}
                  {renderImageCard(
                    'Actual (current)',
                    item.actualSrc,
                    item.actualPath,
                    'No actual screenshot',
                    imageErrorByKey[`${item.id}:actual`] === true,
                  )}
                  {renderImageCard(
                    'Diff (delta)',
                    item.diffSrc,
                    item.diffPath,
                    'No diff image',
                    imageErrorByKey[`${item.id}:diff`] === true,
                  )}
                </div>
              </div>
            ))}
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
