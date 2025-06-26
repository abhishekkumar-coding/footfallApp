import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const shopApi = createApi({
    reducerPath: 'shopApi',
    baseQuery: fetchBaseQuery({
        baseUrl: "https://footfall.onrender.com/api/",
    }),
    tagTypes: ['Favorite'],
    endpoints: (builder) => ({

        getAllShops: builder.query({
            query: () => ({
                url: 'shop/getAll?page=1&limit=10',
                method: "GET",
            }),
        }),

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


        // getFavShops: builder.query({
        //     query: () => ({
        //         url: "shop/fav",
        //         method: "GET",
        //     }),
        //     providesTags: ['Favorite'],
        // }),
    }),
});

export const {
    useGetAllShopsQuery,
    useAddFavShopMutation,
    useRemoveFavShopMutation,
} = shopApi;
