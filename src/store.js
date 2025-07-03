import { configureStore } from "@reduxjs/toolkit";
import { shopApi } from "./features/shops/shopApi";
import { authApi } from "./features/auth/authApi";
import userReducer from "./features/auth/userSlice"
import walletReducer from "./features/auth/walletSlice"
import wishlistReducer from "./features/wishlistSlice"

export const store = configureStore({
  reducer: {
    [shopApi.reducerPath]: shopApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    user : userReducer,
       wishlist: wishlistReducer,
    wallet: walletReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(shopApi.middleware, authApi.middleware),
});
