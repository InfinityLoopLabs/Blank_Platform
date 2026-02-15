import { api } from "@app/api/RTK";
export const addTagTypes = ["store"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      placeOrder: build.mutation<PlaceOrderApiResponse, PlaceOrderApiArg>({
        query: (queryArg) => ({
          url: `/store/order`,
          method: "POST",
          body: queryArg.order,
        }),
        invalidatesTags: ["store"],
      }),
      getOrderById: build.query<GetOrderByIdApiResponse, GetOrderByIdApiArg>({
        query: (queryArg) => ({ url: `/store/order/${queryArg.orderId}` }),
        providesTags: ["store"],
      }),
      deleteOrder: build.mutation<DeleteOrderApiResponse, DeleteOrderApiArg>({
        query: (queryArg) => ({
          url: `/store/order/${queryArg.orderId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["store"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as orderStore };
export type PlaceOrderApiResponse =
  /** status 200 successful operation */ Order;
export type PlaceOrderApiArg = {
  order: Order;
};
export type GetOrderByIdApiResponse =
  /** status 200 successful operation */ Order;
export type GetOrderByIdApiArg = {
  /** ID of order that needs to be fetched */
  orderId: number;
};
export type DeleteOrderApiResponse = unknown;
export type DeleteOrderApiArg = {
  /** ID of the order that needs to be deleted */
  orderId: number;
};
export type Order = {
  id?: number;
  petId?: number;
  quantity?: number;
  shipDate?: string;
  status?: "placed" | "approved" | "delivered";
  complete?: boolean;
};
export const {
  usePlaceOrderMutation,
  useGetOrderByIdQuery,
  useDeleteOrderMutation,
} = injectedRtkApi;
