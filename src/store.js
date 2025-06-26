import { configureStore } from "@reduxjs/toolkit";
import { shopApi } from "./features/shops/shopApi";
import { authApi } from "./features/auth/authApi";

export const store = configureStore({
  reducer: {
    [shopApi.reducerPath]: shopApi.reducer,
    [authApi.reducerPath]: shopApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(shopApi.middleware, authApi.middleware),
});
