import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/lib/utils.ts";
import type {UserRole} from "@/types";

// Define interfaces
export interface ActionLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  userName?: string;
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

export const logApiSlice = createApi({
  reducerPath: "logApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/v1/logs`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Log"],
  endpoints: (builder) => ({
    listLogs: builder.query<PaginatedResponse<ActionLog>, { page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 10, search = "" }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) params.append('search', search);
        return `/?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [...result.items.map(({ id }) => ({ type: "Log" as const, id })), { type: "Log", id: "LIST" }]
          : [{ type: "Log", id: "LIST" }],
    }),
    addLog: builder.mutation<ActionLog, { action: string; userName?: string }>({
      query: (logData) => ({
        url: '/',
        method: 'POST',
        body: logData,
      }),
      invalidatesTags: [{ type: "Log", id: "LIST" }],
    }),
  }),
});

export const {
  useListLogsQuery,
  useAddLogMutation,
} = logApiSlice;
