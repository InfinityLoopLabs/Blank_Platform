import { api } from "@application/api/rtk/instances/auth";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    postApiLogout: build.mutation<
      PostApiLogoutApiResponse,
      PostApiLogoutApiArg
    >({
      query: () => ({ url: `/api/logout`, method: "POST" }),
    }),
    getApiMe: build.query<GetApiMeApiResponse, GetApiMeApiArg>({
      query: () => ({ url: `/api/me` }),
    }),
    postApiRefresh: build.mutation<
      PostApiRefreshApiResponse,
      PostApiRefreshApiArg
    >({
      query: (queryArg) => ({
        url: `/api/refresh`,
        method: "POST",
        body: queryArg.domainAuthRefreshRequestDto,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as enhancedApi };
export type PostApiLogoutApiResponse = unknown;
export type PostApiLogoutApiArg = void;
export type GetApiMeApiResponse =
  /** status 200 OK */ DomainUserProfileResponseDto;
export type GetApiMeApiArg = void;
export type PostApiRefreshApiResponse =
  /** status 200 OK */ DomainAuthRefreshResponseDto;
export type PostApiRefreshApiArg = {
  /** Тело запроса на обновление токена */
  domainAuthRefreshRequestDto: DomainAuthRefreshRequestDto;
};
export type DomainErrorResponse = {
  error?: string;
};
export type DomainUserProfileResponseDto = {
  avatar_url?: string;
  email?: string;
  name?: string;
  user_id?: string;
};
export type DomainAuthRefreshResponseDto = {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  token_type?: string;
};
export type DomainAuthRefreshRequestDto = {
  refresh_token?: string;
};
export const {
  usePostApiLogoutMutation,
  useGetApiMeQuery,
  useLazyGetApiMeQuery,
  usePostApiRefreshMutation,
} = injectedRtkApi;
