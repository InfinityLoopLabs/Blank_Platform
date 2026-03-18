export type ColorTokenType = {
  name: string
  varName: string
  textVarName?: string
  purpose: string
}

export const projectColorTokenRows: ColorTokenType[][] = [
  [
    {
      name: 'background',
      varName: '--background',
      textVarName: '--foreground',
      purpose: 'Базовый фон приложения.',
    },
    {
      name: 'foreground',
      varName: '--foreground',
      textVarName: '--background',
      purpose: 'Основной цвет текста и контента.',
    },
    {
      name: 'card',
      varName: '--card',
      textVarName: '--card-foreground',
      purpose: 'Поверхности карточек и контейнеров.',
    },
    {
      name: 'popover',
      varName: '--popover',
      textVarName: '--popover-foreground',
      purpose: 'Фон всплывающих слоёв.',
    },
  ],
  [
    {
      name: 'primary',
      varName: '--primary',
      textVarName: '--primary-foreground',
      purpose: 'Главные CTA и акцентные действия.',
    },
    {
      name: 'secondary',
      varName: '--secondary',
      textVarName: '--secondary-foreground',
      purpose: 'Вторичные кнопки и мягкие акценты.',
    },
    {
      name: 'accent',
      varName: '--accent',
      textVarName: '--accent-foreground',
      purpose: 'Hover, выделения и интерактивные состояния.',
    },
    {
      name: 'muted',
      varName: '--muted',
      textVarName: '--muted-foreground',
      purpose: 'Приглушенные поверхности и мета-информация.',
    },
  ],
  [
    {
      name: 'constructive',
      varName: '--constructive',
      textVarName: '--constructive-foreground',
      purpose: 'Позитивные статусы и подтверждения.',
    },
    {
      name: 'cautionary',
      varName: '--cautionary',
      textVarName: '--cautionary-foreground',
      purpose: 'Предупреждения и зоны внимания.',
    },
    {
      name: 'destructive',
      varName: '--destructive',
      textVarName: '--background',
      purpose: 'Ошибка, удаление, критичные действия.',
    },
    {
      name: 'ring',
      varName: '--ring',
      textVarName: '--background',
      purpose: 'Цвет focus ring и выделения фокуса.',
    },
  ],
  [
    {
      name: 'chart-1',
      varName: '--chart-1',
      textVarName: '--background',
      purpose: 'Серия графика №1.',
    },
    {
      name: 'chart-2',
      varName: '--chart-2',
      textVarName: '--background',
      purpose: 'Серия графика №2.',
    },
    {
      name: 'chart-3',
      varName: '--chart-3',
      textVarName: '--background',
      purpose: 'Серия графика №3.',
    },
    {
      name: 'chart-4',
      varName: '--chart-4',
      textVarName: '--background',
      purpose: 'Серия графика №4.',
    },
    {
      name: 'chart-5',
      varName: '--chart-5',
      textVarName: '--background',
      purpose: 'Серия графика №5.',
    },
  ],
]

export const lightThemeVars: Record<string, string> = {
  '--background': 'oklch(1 0 0)',
  '--foreground': 'oklch(0.145 0 0)',
  '--card': 'oklch(1 0 0)',
  '--card-foreground': 'oklch(0.145 0 0)',
  '--popover': 'oklch(1 0 0)',
  '--popover-foreground': 'oklch(0.145 0 0)',
  '--primary': 'oklch(0.205 0 0)',
  '--primary-foreground': 'oklch(0.985 0 0)',
  '--secondary': 'oklch(0.97 0 0)',
  '--secondary-foreground': 'oklch(0.205 0 0)',
  '--muted': 'oklch(0.97 0 0)',
  '--muted-foreground': 'oklch(0.556 0 0)',
  '--accent': 'oklch(0.97 0 0)',
  '--accent-foreground': 'oklch(0.205 0 0)',
  '--destructive': 'oklch(0.577 0.245 27.325)',
  '--constructive': '#009635',
  '--constructive-foreground': '#ffffff',
  '--cautionary': '#fcd015',
  '--cautionary-foreground': '#111111',
  '--border': 'oklch(0.922 0 0)',
  '--input': 'oklch(0.922 0 0)',
  '--ring': 'oklch(0.708 0 0)',
  '--chart-1': 'oklch(0.75 0.25 45)',
  '--chart-2': 'oklch(0.6 0.118 184.704)',
  '--chart-3': 'oklch(0.398 0.07 227.392)',
  '--chart-4': 'oklch(0.828 0.189 84.429)',
  '--chart-5': 'oklch(0.769 0.188 70.08)',
}

export const darkThemeVars: Record<string, string> = {
  '--background': 'oklch(0.145 0 0)',
  '--foreground': 'oklch(0.985 0 0)',
  '--card': 'oklch(0.205 0 0)',
  '--card-foreground': 'oklch(0.985 0 0)',
  '--popover': 'oklch(0.205 0 0)',
  '--popover-foreground': 'oklch(0.985 0 0)',
  '--primary': 'oklch(0.922 0 0)',
  '--primary-foreground': 'oklch(0.205 0 0)',
  '--secondary': 'oklch(0.269 0 0)',
  '--secondary-foreground': 'oklch(0.985 0 0)',
  '--muted': 'oklch(0.269 0 0)',
  '--muted-foreground': 'oklch(0.708 0 0)',
  '--accent': 'oklch(0.371 0 0)',
  '--accent-foreground': 'oklch(0.985 0 0)',
  '--destructive': 'oklch(0.577 0.245 27.325)',
  '--constructive': '#009635',
  '--constructive-foreground': '#ffffff',
  '--cautionary': '#fcd015',
  '--cautionary-foreground': '#111111',
  '--border': 'oklch(1 0 0 / 10%)',
  '--input': 'oklch(1 0 0 / 15%)',
  '--ring': 'oklch(0.556 0 0)',
  '--chart-1': 'oklch(0.75 0.25 45)',
  '--chart-2': 'oklch(0.696 0.17 162.48)',
  '--chart-3': 'oklch(0.769 0.188 70.08)',
  '--chart-4': 'oklch(0.627 0.265 303.9)',
  '--chart-5': 'oklch(0.645 0.246 16.439)',
}
