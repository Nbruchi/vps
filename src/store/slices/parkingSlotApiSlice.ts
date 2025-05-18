import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {ParkingSlot, UserRole} from "@/types";
import { baseUrl } from "@/lib/utils.ts";

// Define interfaces
export interface SlotFormData {
  slotNumber: string;
  vehicleType: 'car' | 'motorcycle' | 'truck' | 'any';
  size: 'small' | 'medium' | 'large';
  location: 'north' | 'south' | 'east' | 'west';
}

export interface BulkSlotFormData {
  startNumber: number;
  count: number;
  vehicleType: 'car' | 'motorcycle' | 'truck' | 'any';
  size: 'small' | 'medium' | 'large';
  location: 'north' | 'south' | 'east' | 'west';
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
  auth:{
    token?: string;
    userId?: string;
    role?: UserRole;
  }
}

export const parkingSlotApiSlice = createApi({
  reducerPath: "parkingSlotApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/v1/slots`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["ParkingSlot"],
  endpoints: (builder) => ({
    listSlots: builder.query<PaginatedResponse<ParkingSlot>, { page?: number; limit?: number; search?: string; showUnavailable?: boolean }>({
      query: ({ page = 1, limit = 10, search = "", showUnavailable = false }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) params.append('search', search);
        if (showUnavailable) params.append('showUnavailable', 'true');
        return `/?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [...result.items.map(({ id }) => ({ type: "ParkingSlot" as const, id })), { type: "ParkingSlot", id: "LIST" }]
          : [{ type: "ParkingSlot", id: "LIST" }],
    }),
    getSlotById: builder.query<ParkingSlot, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: "ParkingSlot", id }],
    }),
    createSlot: builder.mutation<ParkingSlot, SlotFormData>({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: "ParkingSlot", id: "LIST" }],
    }),
    createBulkSlots: builder.mutation<ParkingSlot[], BulkSlotFormData>({
      query: (data) => ({
        url: '/bulk',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: "ParkingSlot", id: "LIST" }],
    }),
    updateSlot: builder.mutation<ParkingSlot, { id: string; data: Partial<SlotFormData> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result) => (result ? [{ type: "ParkingSlot", id: result.id }] : []),
    }),
    deleteSlot: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: "ParkingSlot", id: "LIST" }],
    }),
    updateSlotStatus: builder.mutation<ParkingSlot, { id: string; status: 'available' | 'unavailable' }>({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result) => (result ? [{ type: "ParkingSlot", id: result.id }] : []),
    }),
    findCompatibleSlot: builder.query<ParkingSlot | null, { vehicleType: string; vehicleSize: string }>({
      query: ({ vehicleType, vehicleSize }) => {
        const params = new URLSearchParams();
        params.append('vehicleType', vehicleType);
        params.append('vehicleSize', vehicleSize);
        return `/compatible?${params.toString()}`;
      },
    }),
  }),
});

export const {
  useListSlotsQuery,
  useGetSlotByIdQuery,
  useCreateSlotMutation,
  useCreateBulkSlotsMutation,
  useUpdateSlotMutation,
  useDeleteSlotMutation,
  useUpdateSlotStatusMutation,
  useFindCompatibleSlotQuery,
} = parkingSlotApiSlice;
