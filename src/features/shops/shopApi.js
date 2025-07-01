import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQueryWithAuth = async (args, api, extraOptions) => {
    const token = await AsyncStorage.getItem('token');

    const authenticatedBaseQuery = fetchBaseQuery({
        baseUrl: 'https://footfall.onrender.com/api/',
        prepareHeaders: (headers) => {
            if (token) headers.set('token', token);
            return headers;
        },
    });

    return authenticatedBaseQuery(args, api, extraOptions);
};

export const shopApi = createApi({
    reducerPath: 'shopApi',
    baseQuery: baseQueryWithAuth,
    tagTypes: ['Favorite', 'Wallet'],
    endpoints: (builder) => ({
        getAllShops: builder.query({
            query: () => ({
                url: 'shop/getAll?page=1&limit=10&status=approved',
                method: "GET",
            }),
        }),
       getShopByScan: builder.mutation({
  query: (id) => {
    console.log('[API] Starting shop scan for ID:', id);
    return {
      url: `shop/scan/${id}`,
      method: "POST",
    };
  },
  invalidatesTags: ['Wallet'],
  
  // Response logging
  transformResponse: (response, meta, id) => {
    console.log('[API] Shop scan success for ID:', id, 'Response:', response);
    return response;
  },
  
  // Error logging
  transformErrorResponse: (response, meta, id) => {
    console.error('[API] Shop scan failed for ID:', id, 'Error:', response);
    return response;
  },
  
  // Lifecycle logging
  async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
    console.log('[API] Mutation initiated for ID:', id);
    try {
      const { data } = await queryFulfilled;
      console.log('[API] Mutation completed successfully for ID:', id, 'Data:', data);
    } catch (error) {
      console.error('[API] Mutation failed for ID:', id, 'Error:', error);
    }
  }
}),
        getWalletSummary: builder.query({
            query: () => ({
                url: "user/getWalletSummary",
                method: "GET",
            }),
            providesTags: ['Wallet'],
        }),
        getShopById: builder.query({
            query: (id) => ({
                url: `shop/getById/${id}`,
                method: "GET",
            }),
            providesTags: ['Wallet'],
        }),

        // applyReferral: builder.mutation({
        //     query: (code) => ({
        //         url: "user/applyReferral",
        //         method: "POST",
        //         body: { referralCode: code },
        //     }),
        //     invalidatesTags: ['Wallet'],
        // }),
        addFavShop: builder.mutation({
            query: (shopId) => ({
                url: "shop/addFavShop",
                method: "POST",
                body: { shopId },
            }),
            invalidatesTags: ['Favorite'],
        }),
        removeFavShop: builder.mutation({
            query: (shopId) => ({
                url: "shop/removeFavShop",
                method: "POST",
                body: { shopId },
            }),
            invalidatesTags: ['Favorite'],
        }),
    }),
});

export const {
    useGetAllShopsQuery,
    useAddFavShopMutation,
    useRemoveFavShopMutation,
    useGetShopByScanMutation,
    useGetWalletSummaryQuery,
    useGetShopByIdQuery
    // useApplyReferralMutation
} = shopApi;
