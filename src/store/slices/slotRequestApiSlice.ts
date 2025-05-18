import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { SlotRequest, SlotRequestStatus, UserRole } from "@/types";
import { baseUrl } from "@/lib/utils.ts";

interface CreateSlotRequestPayload {
  vehicleId: string;
}

export interface UpdateSlotRequestPayload {
  status: SlotRequestStatus;
  adminComment?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
}

interface RootState {
  auth: {
    token?: string;
    userId?: string;
    role?: UserRole;
  }
}

export const slotRequestApiSlice = createApi({
  reducerPath: "slotRequestApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/v1/requests`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["SlotRequest"],
  endpoints: (builder) => ({
    listRequests: builder.query<PaginatedResponse<SlotRequest>, PaginationParams>({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/",
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "SlotRequest" as const, id })),
              { type: "SlotRequest", id: "LIST" },
            ]
          : [{ type: "SlotRequest", id: "LIST" }],
    }),
    getRequestById: builder.query<SlotRequest, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "SlotRequest", id }],
    }),
    createRequest: builder.mutation<SlotRequest, CreateSlotRequestPayload>({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "SlotRequest", id: "LIST" }],
    }),
    updateRequest: builder.mutation<SlotRequest, { id: string; data: Partial<UpdateSlotRequestPayload> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result) => (result ? [{ type: "SlotRequest", id: result.id }] : []),
    }),
    deleteRequest: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "SlotRequest", id: "LIST" }],
    }),
  }),
});

export const {
  useListRequestsQuery,
  useGetRequestByIdQuery,
  useCreateRequestMutation,
  useUpdateRequestMutation,
  useDeleteRequestMutation,
} = slotRequestApiSlice;