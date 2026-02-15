import { useNavigate, NavigateOptions } from 'react-router'

/**
 * Hook adapter for navigation within the application.
 * @returns {Function} A function that navigates to the specified path with optional navigation options.
 */
export const useAppNavigate = () => {
  const navigate = useNavigate()

  /**
   * @param {string} path - The path to navigate to.
   * @param {NavigateOptions} [options] - Optional navigation options.
   */
  return (path: string, options?: NavigateOptions) => {
    navigate(path, options)
  }
}
