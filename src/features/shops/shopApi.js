import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { REACT_APP_DEV_SERVER, REACT_APP_PROD_SERVER } from "@env"
import baseQuery from '../baseQuery';

export const shopApi = createApi({
  reducerPath: 'shopApi',
  baseQuery: baseQuery,
  tagTypes: ['Favorite', 'Wallet', 'VendorPoints', 'RedeemHistory'],
  endpoints: builder => ({
    // shopApi.js
    getAllShops: builder.query({
  query: ({ page = 1, limit = 10, category, search }) => {
    const categoryParam =
      category && category !== "all" ? `&category=${encodeURIComponent(category)}` : "";
    const searchParam =
      search && search.trim() !== "" ? `&search=${encodeURIComponent(search)}` : "";

    return {
      url: `shop/getAll?page=${page}&limit=${limit}&status=approved${categoryParam}${searchParam}`,
      method: "GET",
    };
  },

  // ✅ **CHANGED**: Create a separate cache for each filter/search combination.
  serializeQueryArgs: ({ endpointName, queryArgs }) => {
    const { category, search } = queryArgs;
    // This ensures that changing a filter starts a new, fresh list.
    return `${endpointName}-${category || "all"}-${search || ""}`;
  },

  // ✅ **CHANGED**: Logic to correctly append pages.
  merge: (currentCache, newItems, { arg }) => {
    // `arg.page` is the page number that was just fetched.
    if (arg.page === 1) {
      // If it's the first page, completely replace the data.
      // This is crucial for when you change filters or search terms.
      return newItems;
    }

    // If it's not the first page, append the new shops to the existing list.
    if (currentCache.data && newItems.data?.shops) {
      const existingShops = currentCache.data.shops;
      const newShops = newItems.data.shops;

      // Prevent adding duplicate shops
      const uniqueNewShops = newShops.filter(
        (newShop) => !existingShops.some((oldShop) => oldShop._id === newShop._id)
      );

      // Use .push() to modify the cache in place (RTK Query uses Immer)
      currentCache.data.shops.push(...uniqueNewShops);
      
      // Update the total number of pages from the latest request
      currentCache.data.totalPages = newItems.data.totalPages;
    }

    return currentCache; // Return the modified cache
  },

  forceRefetch({ currentArg, previousArg }) {
    // This part is correct and ensures a refetch when page, category, or search changes.
    return (
      currentArg?.page !== previousArg?.page ||
      currentArg?.category !== previousArg?.category ||
      currentArg?.search !== previousArg?.search
    );
  },
}),
    // getAllShops: builder.query({
    //   query: ({ page = 1, limit = 10, category, search }) => {
    //     const categoryParam =
    //       category && category !== "all" ? `&category=${encodeURIComponent(category)}` : "";
    //     const searchParam =
    //       search && search.trim() !== "" ? `&search=${encodeURIComponent(search)}` : "";

    //     return {
    //       url: `shop/getAll?page=${page}&limit=${limit}&status=approved${categoryParam}${searchParam}`,
    //       method: "GET",
    //     };
    //   },

    //   // ✅ Cache per filter/search combination, not just endpoint name
    //   serializeQueryArgs: ({ endpointName, queryArgs }) => {
    //     const { category, search } = queryArgs;
    //     return `${endpointName}-${category || "all"}-${search || ""}`;
    //   },

    //   // ✅ Merge pages into cache
    //   merge: (currentCache, newCache) => {
    //     const newShops = newCache?.data?.shops || [];
    //     if (!currentCache?.data) {
    //       return { ...newCache };
    //     }

    //     const existingShops = currentCache.data.shops || [];

    //     const uniqueNewShops = newShops.filter(
    //       (newShop) => !existingShops.some((old) => old._id === newShop._id)
    //     );

    //     currentCache.data.shops = [...existingShops, ...uniqueNewShops];
    //     currentCache.data.totalPages = newCache.data.totalPages;
    //   },

    //   forceRefetch({ currentArg, previousArg }) {
    //     return (
    //       currentArg?.page !== previousArg?.page ||
    //       currentArg?.category !== previousArg?.category ||
    //       currentArg?.search !== previousArg?.search
    //     );
    //   },
    // }),
    getShopById: builder.query({
      query: id => ({
        url: `shop/getById/${id}`,
        method: 'GET',
      }),
    }),
    getShopByScan: builder.mutation({
      query: ({ shopId, latitude, longitude }) => ({
        url: `shop/scan/${shopId}`,
        method: 'POST',
        body: {
          latitude,
          longitude,
        },
      }),
      invalidatesTags: ['Wallet'],
    }),

    getWalletSummary: builder.query({
      query: () => ({
        url: 'user/getWalletSummary',
        method: 'GET',
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
      query: shopId => ({
        url: 'shop/addFavShop',
        method: 'POST',
        body: { shopId },
      }),
      invalidatesTags: ['Favorite'],
    }),
    removeFavShop: builder.mutation({
      query: shopId => ({
        url: 'shop/removeFavShop',
        method: 'POST',
        body: { shopId },
      }),
      invalidatesTags: ['Favorite'],
    }),
    getShopOffersById: builder.query({
      query: shopId => ({
        url: `offer/getByShop/${shopId}`,
        method: 'GET',
      }),
    }),
    getSortedOffers: builder.query({
      query: sort => ({
        url: `offer/getSorted?sort=${sort}&lat=77.1025&lng=28.7041`,
        method: 'GET',
      }),
    }),
    getTotalPointsByVendor: builder.query({
      query: ({ vendorId }) => ({
        url: `user/getTotalPointsByVendor/${vendorId}`,
        method: 'GET',
      }),
      providesTags: ['VendorPoints'],
    }),
    getRedeemHistoryByVendor: builder.query({
      query: id => ({
        url: `user/getRedeemHistoryByVendor/${id}`,
        method: 'GET',
      }),
      providesTags: ['RedeemHistory'],
    }),
    getRedeemHistory: builder.query({
      query: () => ({
        url: 'user/getRedeemHistory',
        method: 'GET',
      }),
      providesTags: ['RedeemHistory'],
    }),
    redeemVendorPoints: builder.mutation({
      query: ({ id, pointsToRedeem }) => ({
        url: `user/redeemVendorPoints/${id}`,
        method: 'POST',
        body: { pointsToRedeem },
      }),
      invalidatesTags: ['VendorPoints', 'RedeemHistory', 'Wallet'],
    }),

    // Offers

    getAllOffers: builder.query({
      query: () => ({
        url: 'offer/getAll',
        method: 'GET',
      }),
    }),

    // scanWithPurchaseAmount: builder.mutation({
    //   query: data => {
    //     const { id, purchaseAmount } = data;
    //     return {
    //       url: `shop/scanWithPurchaseAmount/${id}`,
    //       method: 'POST',
    //       body: { purchaseAmount },
    //     };
    //   },
    //   invalidatesTags: ['Wallet'],
    // }),

    scanWithPurchaseAmount: builder.mutation({
      query: data => {
        const { id, purchaseAmount, latitude, longitude } = data;
        return {
          url: `shop/scanWithPurchaseAmount/${id}`,
          method: 'POST',
          body: {
            purchaseAmount,
            latitude,
            longitude,
          },
        };
      },
      invalidatesTags: ['Wallet'],
    }),

    getVendorById: builder.query({
      query: ({ id }) => ({
        url: `vendor/getById/${id}`,
        method: 'GET',
      }),
    }),
    getScanHistory: builder.query({
      query: () => ({
        url: 'user/getScanHistory',
        method: 'GET',
      }),
      refetchOnFocus: true,
    }),
    getFilteredShops: builder.query({
      query: search => ({
        url: `shop/search?search=${search}&page=1&limit=10`,
        method: 'GET',
      }),
    }),
    scanOffer: builder.mutation({
      query: id => ({
        url: `offer/scan/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Wallet'],
    }),
    getNotifications: builder.query({
      query: () => ({
        url: 'notification/getNotifications',
        method: 'GET',
      }),
      providesTags: ['Notifications'],
    }),
    getOfferById: builder.query({
      query: id => ({
        url: `offer/getById/${id}`,
        method: 'GET',
      }),
    }),
    markNotificationAsRead: builder.mutation({
      query: notificationId => ({
        url: `notification/markNotificationAsRead/${notificationId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Notifications'],
    }),
    getUserLocation: builder.query({
      query: ({ lat, lng, apiKey }) => ({
        url: `geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
        method: 'GET',
      }),
      providesTags: ['UserLocation'],
    }),
    getNearbyShops: builder.query({
      query: ({ lat, lng }) => ({
        url: `shop/getNearby?userLat=${lat}&userLng=${lng}`,
        method: 'GET',

      }),
    }),
    getFeaturedShops: builder.query({
      query: () => ({
        url: "shop/getFeaturedShops"
      })
    }),
    uploadFile: builder.mutation({
      query: (file) => ({
        url: 'file/upload',
        method: 'POST',
        body: file,
      }),
    }),
    deleteFile: builder.mutation({
      query: ({ model, fieldPath, id, fileUrl }) => ({
        url: 'file/deleteFile',
        method: 'DELETE',
        body: {
          model,
          fieldPath,
          id,
          fileUrl,
        },
      }),
    }),
    getAllRewards: builder.query({
      query: () => ({
        url: "spin/getAll?isActive=true",
        method: "GET"
      })
    }),
    spinWheel: builder.mutation({
      query: (spinRewardId) => ({
        url: "spin/spinWheel",
        method: "POST",
        body: { spinRewardId },
      }),
      invalidatesTags: ["SpinHistory"],
    }),

    getSpinHistory: builder.query({
      query: () => ({
        url: "spin/getSpinHistory",
        method: "GET",
      }),
      providesTags: ["SpinHistory"],
    }),
    claimReward: builder.mutation({
      query: ({ awardId, ...payload }) => ({
        url: `spin/claimReward/${awardId}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SpinHistory", "Wallet"], // Auto-refetch SpinHistory queries
    }),
    getShopByVendor: builder.query({
      query: (id) => ({
        url: `shop/getByVendor/${id}`,
        method: "GET"
      })
    })
  }),
});

export const {
  useGetAllShopsQuery,
  useGetShopByIdQuery,
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
  useScanOfferMutation,
  useGetNotificationsQuery,
  useGetOfferByIdQuery,
  useMarkNotificationAsReadMutation,
  useGetUserLocationQuery,
  useGetNearbyShopsQuery,
  useGetFeaturedShopsQuery,
  useUploadFileMutation,
  useDeleteFileMutation,
  useGetAllRewardsQuery,
  useSpinWheelMutation,
  useGetSpinHistoryQuery,
  useClaimRewardMutation,
  useGetShopByVendorQuery
} = shopApi;
