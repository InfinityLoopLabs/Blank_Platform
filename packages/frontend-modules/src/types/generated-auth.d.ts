declare module '@generated/hooks/auth' {
  type AuthMeResponse = {
    user_id?: string | null
  }

  type RefreshResponse = {
    access_token?: string | null
    refresh_token?: string | null
  }

  type UseGetApiMeQueryResult = {
    data?: AuthMeResponse
    isSuccess: boolean
    refetch: () => void
  }

  type UsePostApiRefreshMutationResult = [
    (args?: unknown) => Promise<unknown>,
    {
      data?: RefreshResponse
      isError: boolean
      isSuccess: boolean
    },
  ]

  export function useGetApiMeQuery(): UseGetApiMeQueryResult
  export function usePostApiRefreshMutation(): UsePostApiRefreshMutationResult
}
