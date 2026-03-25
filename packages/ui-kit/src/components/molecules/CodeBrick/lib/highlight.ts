import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import go from 'highlight.js/lib/languages/go'
import ini from 'highlight.js/lib/languages/ini'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import makefile from 'highlight.js/lib/languages/makefile'
import nginx from 'highlight.js/lib/languages/nginx'
import powershell from 'highlight.js/lib/languages/powershell'
import shell from 'highlight.js/lib/languages/shell'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'

const autoDetectionLanguages = [
  'javascript',
  'typescript',
  'xml',
  'css',
  'json',
  'go',
  'bash',
  'shell',
  'yaml',
  'dockerfile',
  'nginx',
  'ini',
  'powershell',
  'sql',
  'makefile',
]

const languageAliasToRegisteredLanguageDictionary: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  html: 'xml',
  svg: 'xml',
  yml: 'yaml',
  sh: 'bash',
  zsh: 'bash',
  shell: 'shell',
  docker: 'dockerfile',
  golang: 'go',
  ps1: 'powershell',
  postgres: 'sql',
  postgresql: 'sql',
  mk: 'makefile',
}

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('go', go)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', shell)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('dockerfile', dockerfile)
hljs.registerLanguage('nginx', nginx)
hljs.registerLanguage('ini', ini)
hljs.registerLanguage('powershell', powershell)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('makefile', makefile)

const normalizeLanguage = (value?: string): string | undefined => {
  const sourceLanguage = value?.trim().toLowerCase()
  if (!sourceLanguage) {
    return undefined
  }

  return (
    languageAliasToRegisteredLanguageDictionary[sourceLanguage] ||
    sourceLanguage
  )
}

export const resolveHighlightLanguage = (
  language?: string,
): string | undefined => {
  const normalizedLanguage = normalizeLanguage(language)

  if (!normalizedLanguage || !hljs.getLanguage(normalizedLanguage)) {
    return undefined
  }

  return normalizedLanguage
}

export const highlightCodeToHtml = (
  code: string,
  language?: string,
): string => {
  if (!code.trim()) {
    return ''
  }

  const normalizedLanguage = resolveHighlightLanguage(language)

  if (normalizedLanguage) {
    return hljs.highlight(code, {
      language: normalizedLanguage,
      ignoreIllegals: true,
    }).value
  }

  return hljs.highlightAuto(code, autoDetectionLanguages).value
}
