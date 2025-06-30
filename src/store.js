import { configureStore } from "@reduxjs/toolkit";
import { shopApi } from "./features/shops/shopApi";
import { authApi } from "./features/auth/authApi";
import userReducer from "./features/auth/userSlice"

export const store = configureStore({
  reducer: {
    [shopApi.reducerPath]: shopApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    user : userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(shopApi.middleware, authApi.middleware),
});
