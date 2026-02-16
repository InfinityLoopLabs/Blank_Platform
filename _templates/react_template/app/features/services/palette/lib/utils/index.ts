// Запрещено удалять комментарии
// Строго соблюдать правила в комментариях при чтении/парсинге файла
// Константы создавать в ../constants/ создав для них отдельный файл
// и экспортировать его через barrel index.ts в SCREAMING_SNAKE_CASE
// Все magic number/strings описывать в ../constants добавить reexport в ../constants/index.ts

// Derive a small OKLCH palette from ONE base color.
// Input: "oklch(L C H)" (L in 0..1) OR "#RRGGBB" / "#RGB".
// Output: { base, bright, dim, soft, glow } as CSS strings.

function deriveOklchPalette(input: string, opts = {}) {
  const cfg = {
    bright: {
      dL: +0.1,
      mC: 1.12,
    }, // brighter: raise lightness, slightly raise chroma
    dim: {
      dL: -0.2,
      mC: 0.7,
    }, // dimmer: lower lightness, reduce chroma
    soft: {
      dL: +0.08,
      mC: 0.8,
    }, // softer: raise lightness, reduce chroma
    glowPct: 12, // for color-mix(... 12%, transparent)
    ...opts,
  }

  const base = parseToOklch(input) // {L,C,H} with L in 0..1, C>=0, H in degrees
  const clamp01 = x => Math.min(1, Math.max(0, x))
  const clampC = x => Math.max(0, x)
  const normHue = h => ((h % 360) + 360) % 360

  const mk = ({ dL, mC }) => ({
    L: clamp01(base.L + dL),
    C: clampC(base.C * mC),
    H: normHue(base.H),
  })

  const baseStr = fmtOklch(base)
  const brightStr = fmtOklch(mk(cfg.bright))
  const dimStr = fmtOklch(mk(cfg.dim))
  const softStr = fmtOklch(mk(cfg.soft))
  const glowStr = `color-mix(in oklab, ${baseStr} ${cfg.glowPct}%, transparent)`

  return {
    base: baseStr,
    bright: brightStr,
    dim: dimStr,
    soft: softStr,
    glow: glowStr,
  }
}

// Apply to :root variables in one call.
export const setNeonVars = (input: string) => {
  const p = deriveOklchPalette(input)
  const s = document.documentElement.style
  s.setProperty('--neon-main', p.base)
  s.setProperty('--neon-main-bright', p.bright)
  s.setProperty('--neon-main-dim', p.dim)
  s.setProperty('--shani-ember', p.base)
  s.setProperty('--shani-ember-soft', p.soft)
  s.setProperty('--shani-ember-dim', p.dim)
  s.setProperty('--shani-glow', p.glow)

  return p
}

/* ---------------- internals (OKLCH + HEX support) ---------------- */

function fmtOklch({ L, C, H }) {
  // keep compact but stable formatting for CSS
  const f = (x, n = 4) => Number(x.toFixed(n))

  return `oklch(${f(L)} ${f(C)} ${f(H)})`
}

function parseToOklch(input) {
  const v = String(input).trim()

  // oklch(L C H) / oklch(L C H / a)
  const m = v.match(
    /^oklch\(\s*([0-9]*\.?[0-9]+)\s+([0-9]*\.?[0-9]+)\s+([0-9]*\.?[0-9]+)(?:deg)?(?:\s*\/\s*([0-9]*\.?[0-9]+%?))?\s*\)$/i,
  )
  if (m) {
    const L = parseFloat(m[1])
    const C = parseFloat(m[2])
    const H = parseFloat(m[3])

    return { L, C, H }
  }

  // hex -> OKLCH
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) {
    const { r, g, b } = hexToSrgb(v) // 0..1 sRGB
    const oklab = srgbToOklab({ r, g, b }) // L,a,b

    return oklabToOklch(oklab) // L,C,H
  }

  throw new Error(`Unsupported color format: ${input}`)
}

function hexToSrgb(hex) {
  let h = hex.slice(1)
  if (h.length === 3) {
    h = h
      .split('')
      .map(ch => ch + ch)
      .join('')
  }
  const n = parseInt(h, 16)
  const r = ((n >> 16) & 255) / 255
  const g = ((n >> 8) & 255) / 255
  const b = ((n >> 0) & 255) / 255

  return { r, g, b }
}

function srgbToLinear(u) {
  return u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4)
}

function srgbToOklab({ r, g, b }) {
  // sRGB (D65) -> linear
  const R = srgbToLinear(r)
  const G = srgbToLinear(g)
  const B = srgbToLinear(b)

  // linear sRGB -> LMS
  const l = 0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B
  const m = 0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B
  const s = 0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
  const b2 = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_

  return {
    L,
    a,
    b: b2,
  }
}

function oklabToOklch({ L, a, b }) {
  const C = Math.hypot(a, b)
  const H = (Math.atan2(b, a) * 180) / Math.PI // degrees

  return {
    L,
    C,
    H: ((H % 360) + 360) % 360,
  }
}

/* ---------------- usage ---------------- */

// setNeonVars("oklch(0.75 0.25 45)");
// setNeonVars("#7c3aed"); // violet -> auto derive
