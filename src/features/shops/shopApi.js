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
    tagTypes: ['Favorite', 'Wallet', "VendorPoints", "RedeemHistory"],
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
        getShopOffersById: builder.query({
            query: (shopId) => ({
                url: `offer/getByShop/${shopId}`,
                method: "GET"
            })
        }),
        getSortedOffers: builder.query({
            query: (sort) => ({
                url: `offer/getSorted?sort=${sort}&lat=77.1025&lng=28.7041`,
                method: "GET"
            })
        }),
        getTotalPointsByVendor: builder.query({
            query: ({ vendorId }) => ({
                url: `user/getTotalPointsByVendor/${vendorId}`,
                method: "GET"
            }),
            providesTags: ['VendorPoints'],
        }),
        getRedeemHistoryByVendor: builder.query({
            query: (id) => ({
                url: `user/getRedeemHistoryByVendor/${id}`,
                method: "GET"
            }),
            providesTags: ['RedeemHistory'],
        }),
        getRedeemHistory: builder.query({
            query: () => ({
                url: "user/getRedeemHistory",
                method: "GET"
            }),
            providesTags: ["RedeemHistory"]
        }),
        redeemVendorPoints: builder.mutation({
            query: ({ id, pointsToRedeem }) => ({
                url: `user/redeemVendorPoints/${id}`,
                method: "POST",
                body: { pointsToRedeem },
            }),
            invalidatesTags: ['VendorPoints', 'RedeemHistory', "Wallet"],
        }),

        // Offers 

        getAllOffers: builder.query({
            query: () => ({
                url: "offer/getAll",
                method: "GET"
            })
        }),

        scanWithPurchaseAmount: builder.mutation({
            query: (data) => {
                const { id, purchaseAmount } = data;
                return {
                    url: `shop/scanWithPurchaseAmount/${id}`,
                    method: "POST",
                    body: { purchaseAmount },
                };
            },
            invalidatesTags: ['Wallet']
        }),

        getVendorById: builder.query({
            query: ({ id }) => ({
                url: `vendor/getById/${id}`,
                method: "GET"
            })
        }),
        getScanHistory: builder.query({
            query: () => ({
                url: "user/getScanHistory",
                method: "GET"
            }),
            refetchOnFocus: true
        }),
        getFilteredShops: builder.query({
            query: (search) => ({
                url: `shop/search?search=${search}&page=1&limit=10`,
                method: "GET"
            })
        }),
        scanOffer: builder.mutation({
            query: ({ id }) => ({
                url: `offer/scan/${id}`,
                method: "POST",
            }),
        }),

    }),
});

export const {
    useGetAllShopsQuery,
    useAddFavShopMutation,
    useRemoveFavShopMutation,
    useGetShopByScanMutation,
    useGetWalletSummaryQuery,
    useGetShopOffersByIdQuery,
    useGetSortedOffersQuery,
    useGetTotalPointsByVendorQuery,
    useGetRedeemHistoryByVendorQuery,
    useRedeemVendorPointsMutation,
    useGetRedeemHistoryQuery,
    useGetAllOffersQuery,
    useScanWithPurchaseAmountMutation,
    useGetVendorByIdQuery,
    useGetScanHistoryQuery,
    useGetFilteredShopsQuery,
    useScanOfferMutation
} = shopApi;

