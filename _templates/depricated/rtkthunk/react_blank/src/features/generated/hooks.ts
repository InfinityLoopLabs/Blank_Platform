import {
  useDeleteOrderMutation,
  useGetOrderByIdQuery,
  usePlaceOrderMutation,
} from './hooks/order'
import {
  useDeletePetMutation,
  useUpdatePetWithFormMutation,
  useGetPetByIdQuery,
  useFindPetsByTagsQuery,
  useFindPetsByStatusQuery,
  useAddPetMutation,
  useUpdatePetMutation,
} from './hooks/pet'
import {
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserByNameQuery,
  useLogoutUserQuery,
  useLoginUserQuery,
  useCreateUsersWithListInputMutation,
  useCreateUserMutation,
} from './hooks/user'
// Этот реэкспорт хуков нужен, если вдруг поменяются названия файлов при изменении контракта с backend
export {
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserByNameQuery,
  useLogoutUserQuery,
  useLoginUserQuery,
  useCreateUsersWithListInputMutation,
  useCreateUserMutation,
  useDeletePetMutation,
  useUpdatePetWithFormMutation,
  useGetPetByIdQuery,
  useFindPetsByTagsQuery,
  useFindPetsByStatusQuery,
  useAddPetMutation,
  useUpdatePetMutation,
  useDeleteOrderMutation,
  useGetOrderByIdQuery,
  usePlaceOrderMutation,
}
