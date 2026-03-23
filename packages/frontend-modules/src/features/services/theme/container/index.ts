import { useEffect } from 'react'
import { useSelector } from 'react-redux'

type ThemeStateType = {
  theme?: {
    isDarkTheme?: boolean
  }
}

export const useContainer = () => {
  const isDarkTheme = useSelector((state: ThemeStateType) =>
    Boolean(state.theme?.isDarkTheme),
  )

  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add('dark')

      return
    }

    document.body.classList.remove('dark')
  }, [isDarkTheme])
}
