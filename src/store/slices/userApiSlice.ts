import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  User,
  UserRole,
} from "@/types";
import {baseUrl} from "@/lib/utils.ts";

// Define interfaces
interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
  // Add any other fields needed for updating the profile
}

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

interface RegisterRequest {
  email: string;
  fullName: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  userId: string;
  role: UserRole;
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

interface GetState {
  auth:{
    token?: string;
    userId?: string;
    role?: UserRole;
  }
}


export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/v1/users`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as GetState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    register: builder.mutation<User, RegisterRequest>({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getProfile: builder.query<User, void>({
      query: () => '/profile',
      providesTags: (result) =>
        result ? [{ type: "User", id: result.id }] : [],
    }),
    updateProfile: builder.mutation<User, UpdateProfilePayload>({
      query: (updatedData) => ({
        url: '/profile',
        method: 'PATCH',
        body: updatedData,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: "User", id: result.id }] : [],
    }),
    deleteProfile: builder.mutation<void, void>({
      query: () => ({
        url: '/profile',
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    changePassword: builder.mutation<void, ChangePasswordPayload>({
      query: (payload) => ({
        url: '/change-password',
        method: 'POST',
        body: payload,
      }),
    }),
    listUsers: builder.query<PaginatedResponse<User>, { page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 10, search = "" }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) params.append('search', search);
        return `/?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),
    deleteUserById: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useChangePasswordMutation,
  useListUsersQuery,
  useGetUserByIdQuery,
  useDeleteUserByIdMutation,
} = userApiSlice;
