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
            query: (id) => ({
                url: `shop/scan/${id}`,
                method: "POST",
            }),
            invalidatesTags: ['Wallet'],
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
  getShopOffersById:builder.query({
            query:(shopId)=>({
                url:`offer/getById/${shopId}`,
                method:"GET"
            })
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
    useGetShopByIdQuery,
    useGetShopOffersByIdQuery
    // useApplyReferralMutation
} = shopApi;
