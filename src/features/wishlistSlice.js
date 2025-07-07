// wishlistSlice.js
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loadWishlistFromAsyncStorage = async () => {
    const savedWishlist = await AsyncStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
};

const saveWishlistToAsyncStorage = async (wishlist) => {
    await AsyncStorage.setItem('wishlist', JSON.stringify(wishlist));
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: {
            products: [],
            clinics: [],
            shops: []
        },
    },
    reducers: {
        addToWishlist: (state, action) => {
            const newItem = action.payload.data;
            const type = action.payload.type;
            if (newItem) {
                const existingItem = state.items[type]?.find(item => item?._id === newItem?._id);
                if (!existingItem) {
                    state.items[type].push(newItem);
                    saveWishlistToAsyncStorage(state.items);
                }
            }
        },
        removeFromWishlist: (state, action) => {
            const itemId = action.payload.removeId;
            const type = action.payload.type;
            state.items[type] = state.items[type].filter(item => item?._id !== itemId);
            saveWishlistToAsyncStorage(state.items);
        },
        clearWishlist: (state) => {
            state.items = {
                products: [],
                clinics: [],
                shops: []
            };
            saveWishlistToAsyncStorage(state.items);
        },
        setWishlist: (state, action) => {
            const loadedItems = action.payload || {};
            state.items = {
                products: loadedItems.products || [],
                clinics: loadedItems.clinics || [],
                shops: loadedItems.shops || [],
            };
        },

    },
});

export const { addToWishlist, removeFromWishlist, clearWishlist, setWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;

// Load initial state from AsyncStorage
export const loadWishlist = () => async (dispatch) => {
    const wishlist = await loadWishlistFromAsyncStorage();
    dispatch(setWishlist(wishlist));
};