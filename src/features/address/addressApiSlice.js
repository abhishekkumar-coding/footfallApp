import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { REACT_APP_DEV_SERVER, REACT_APP_PROD_SERVER } from "@env"
import baseQuery from '../baseQuery';



export const addressApi = createApi({
  reducerPath: 'addressApi',
  baseQuery: baseQuery,
  tagTypes: ['Address'],
  endpoints: builder => ({
    // ✅ Create address
    createAddress: builder.mutation({
      query: body => ({
        url: 'address/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Address'],
    }),

    // ✅ Update address
    updateAddress: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `address/update/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Address'],
    }),

    // ✅ Get address by ID
    getAddressById: builder.query({
      query: id => ({
        url: `address/getById/${id}`,
        method: 'GET',
      }),
      providesTags: ['Address'],
    }),

    // ✅ Get all addresses (with pagination)
    getAllAddresses: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `address/getAll/?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['Address'],
    }),

    // ✅ Delete address
    deleteAddress: builder.mutation({
      query: id => ({
        url: `address/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Address'],
    }),
  }),
});

export const {
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useGetAddressByIdQuery,
  useGetAllAddressesQuery,
  useDeleteAddressMutation,
} = addressApi;
