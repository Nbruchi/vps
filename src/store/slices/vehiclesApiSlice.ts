import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {UserRole, Vehicle} from "@/types";
import { baseUrl } from "@/lib/utils.ts";

// Define interfaces
export interface VehicleFormData {
  plateNumber: string;
  vehicleType: 'car' | 'motorcycle' | 'truck';
  size: 'small' | 'medium' | 'large';
  attributes: {
    color?: string;
    model?: string;
    year?: number | string;
  };
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

export const vehicleApiSlice = createApi({
  reducerPath: "vehicleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/v1/vehicles`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Vehicle"],
  endpoints: (builder) => ({
    listVehicles: builder.query<PaginatedResponse<Vehicle>, { page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 10, search = "" }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) params.append('search', search);
        return `/?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [...result.items.map(({ id }) => ({ type: "Vehicle" as const, id })), { type: "Vehicle", id: "LIST" }]
          : [{ type: "Vehicle", id: "LIST" }],
    }),
    getVehicleById: builder.query<Vehicle, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Vehicle", id }],
    }),
    createVehicle: builder.mutation<Vehicle, VehicleFormData>({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: "Vehicle", id: "LIST" }],
    }),
    updateVehicle: builder.mutation<Vehicle, { id: string; data: Partial<VehicleFormData> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result) => (result ? [{ type: "Vehicle", id: result.id }] : []),
    }),
    deleteVehicle: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: "Vehicle", id: "LIST" }],
    }),
    getUserVehicles: builder.query<Vehicle[], void>({
      query: () => '/user',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Vehicle" as const, id })), { type: "Vehicle", id: "LIST" }]
          : [{ type: "Vehicle", id: "LIST" }],
    }),
  }),
});

export const {
  useListVehiclesQuery,
  useGetVehicleByIdQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useGetUserVehiclesQuery,
} = vehicleApiSlice;
