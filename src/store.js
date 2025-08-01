import { configureStore } from "@reduxjs/toolkit";
import { shopApi } from "./features/shops/shopApi";
import { authApi } from "./features/auth/authApi";
import userReducer from "./features/auth/userSlice"
import walletReducer from "./features/auth/walletSlice"
import wishlistReducer from "./features/wishlistSlice"
import notificationReducer from './features/notificationSlice';
import { addressApi } from './features/address/addressApiSlice';

export const store = configureStore({
  reducer: {
    [shopApi.reducerPath]: shopApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    user : userReducer,
       wishlist: wishlistReducer,
       notification:notificationReducer,
    wallet: walletReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(shopApi.middleware, authApi.middleware).concat(addressApi.middleware),
});
