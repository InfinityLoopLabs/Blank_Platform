import { api } from "@app/api/RTK";
export const addTagTypes = ["pet"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      updatePet: build.mutation<UpdatePetApiResponse, UpdatePetApiArg>({
        query: (queryArg) => ({
          url: `/pet`,
          method: "PUT",
          body: queryArg.pet,
        }),
        invalidatesTags: ["pet"],
      }),
      addPet: build.mutation<AddPetApiResponse, AddPetApiArg>({
        query: (queryArg) => ({
          url: `/pet`,
          method: "POST",
          body: queryArg.pet,
        }),
        invalidatesTags: ["pet"],
      }),
      findPetsByStatus: build.query<
        FindPetsByStatusApiResponse,
        FindPetsByStatusApiArg
      >({
        query: (queryArg) => ({
          url: `/pet/findByStatus`,
          params: { status: queryArg.status },
        }),
        providesTags: ["pet"],
      }),
      findPetsByTags: build.query<
        FindPetsByTagsApiResponse,
        FindPetsByTagsApiArg
      >({
        query: (queryArg) => ({
          url: `/pet/findByTags`,
          params: { tags: queryArg.tags },
        }),
        providesTags: ["pet"],
      }),
      getPetById: build.query<GetPetByIdApiResponse, GetPetByIdApiArg>({
        query: (queryArg) => ({ url: `/pet/${queryArg.petId}` }),
        providesTags: ["pet"],
      }),
      updatePetWithForm: build.mutation<
        UpdatePetWithFormApiResponse,
        UpdatePetWithFormApiArg
      >({
        query: (queryArg) => ({
          url: `/pet/${queryArg.petId}`,
          method: "POST",
          params: { name: queryArg.name, status: queryArg.status },
        }),
        invalidatesTags: ["pet"],
      }),
      deletePet: build.mutation<DeletePetApiResponse, DeletePetApiArg>({
        query: (queryArg) => ({
          url: `/pet/${queryArg.petId}`,
          method: "DELETE",
          headers: { api_key: queryArg.apiKey },
        }),
        invalidatesTags: ["pet"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as petStore };
export type UpdatePetApiResponse = /** status 200 Successful operation */ Pet;
export type UpdatePetApiArg = {
  /** Update an existent pet in the store */
  pet: Pet;
};
export type AddPetApiResponse = /** status 200 Successful operation */ Pet;
export type AddPetApiArg = {
  /** Create a new pet in the store */
  pet: Pet;
};
export type FindPetsByStatusApiResponse =
  /** status 200 successful operation */ Pet[];
export type FindPetsByStatusApiArg = {
  /** Status values that need to be considered for filter */
  status?: "available" | "pending" | "sold";
};
export type FindPetsByTagsApiResponse =
  /** status 200 successful operation */ Pet[];
export type FindPetsByTagsApiArg = {
  /** Tags to filter by */
  tags?: string[];
};
export type GetPetByIdApiResponse = /** status 200 successful operation */ Pet;
export type GetPetByIdApiArg = {
  /** ID of pet to return */
  petId: number;
};
export type UpdatePetWithFormApiResponse = unknown;
export type UpdatePetWithFormApiArg = {
  /** ID of pet that needs to be updated */
  petId: number;
  /** Name of pet that needs to be updated */
  name?: string;
  /** Status of pet that needs to be updated */
  status?: string;
};
export type DeletePetApiResponse = unknown;
export type DeletePetApiArg = {
  apiKey?: string;
  /** Pet id to delete */
  petId: number;
};
export type Category = {
  id?: number;
  name?: string;
};
export type Tag = {
  id?: number;
  name?: string;
};
export type Pet = {
  id?: number;
  name: string;
  category?: Category;
  photoUrls: string[];
  tags?: Tag[];
  status?: "available" | "pending" | "sold";
};
export const {
  useUpdatePetMutation,
  useAddPetMutation,
  useFindPetsByStatusQuery,
  useFindPetsByTagsQuery,
  useGetPetByIdQuery,
  useUpdatePetWithFormMutation,
  useDeletePetMutation,
} = injectedRtkApi;
