import { api } from "@app/api/RTK";
export const addTagTypes = ["user"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      createUser: build.mutation<CreateUserApiResponse, CreateUserApiArg>({
        query: (queryArg) => ({
          url: `/user`,
          method: "POST",
          body: queryArg.user,
        }),
        invalidatesTags: ["user"],
      }),
      createUsersWithListInput: build.mutation<
        CreateUsersWithListInputApiResponse,
        CreateUsersWithListInputApiArg
      >({
        query: (queryArg) => ({
          url: `/user/createWithList`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["user"],
      }),
      loginUser: build.query<LoginUserApiResponse, LoginUserApiArg>({
        query: (queryArg) => ({
          url: `/user/login`,
          params: { username: queryArg.username, password: queryArg.password },
        }),
        providesTags: ["user"],
      }),
      logoutUser: build.query<LogoutUserApiResponse, LogoutUserApiArg>({
        query: () => ({ url: `/user/logout` }),
        providesTags: ["user"],
      }),
      getUserByName: build.query<GetUserByNameApiResponse, GetUserByNameApiArg>(
        {
          query: (queryArg) => ({ url: `/user/${queryArg.username}` }),
          providesTags: ["user"],
        }
      ),
      updateUser: build.mutation<UpdateUserApiResponse, UpdateUserApiArg>({
        query: (queryArg) => ({
          url: `/user/${queryArg.username}`,
          method: "PUT",
          body: queryArg.user,
        }),
        invalidatesTags: ["user"],
      }),
      deleteUser: build.mutation<DeleteUserApiResponse, DeleteUserApiArg>({
        query: (queryArg) => ({
          url: `/user/${queryArg.username}`,
          method: "DELETE",
        }),
        invalidatesTags: ["user"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as userStore };
export type CreateUserApiResponse = unknown;
export type CreateUserApiArg = {
  /** Created user object */
  user: User;
};
export type CreateUsersWithListInputApiResponse =
  /** status 200 Successful operation */ User;
export type CreateUsersWithListInputApiArg = {
  body: User[];
};
export type LoginUserApiResponse =
  /** status 200 successful operation */ string;
export type LoginUserApiArg = {
  /** The user name for login */
  username?: string;
  /** The password for login in clear text */
  password?: string;
};
export type LogoutUserApiResponse = unknown;
export type LogoutUserApiArg = void;
export type GetUserByNameApiResponse =
  /** status 200 successful operation */ User;
export type GetUserByNameApiArg = {
  /** The name that needs to be fetched. Use user1 for testing.  */
  username: string;
};
export type UpdateUserApiResponse = unknown;
export type UpdateUserApiArg = {
  /** name that need to be deleted */
  username: string;
  /** Update an existent user in the store */
  user: User;
};
export type DeleteUserApiResponse = unknown;
export type DeleteUserApiArg = {
  /** The name that needs to be deleted */
  username: string;
};
export type User = {
  id?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  userStatus?: number;
};
export const {
  useCreateUserMutation,
  useCreateUsersWithListInputMutation,
  useLoginUserQuery,
  useLogoutUserQuery,
  useGetUserByNameQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = injectedRtkApi;
