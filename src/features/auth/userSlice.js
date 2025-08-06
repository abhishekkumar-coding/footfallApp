import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    fcmToken: '',
    pendingReferral: '',
    savedAddress: ''
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
        setFcmToken: (state, action) => {
            state.fcmToken = action.payload;
        },
        setPendingReferral: (state, action) => {
            state.pendingReferral = action.payload;
        },
        clearPendingReferral: (state) => {
            state.pendingReferral = '';
        },
        setSavedAddress: (state, action) => {
            state.savedAddress = action.payload;
        },
        clearSavedAddress: (state) => {
            state.savedAddress = '';
        }
    },
});

export const {
    setUser,
    clearUser,
    setFcmToken,
    setPendingReferral,
    clearPendingReferral,
    setSavedAddress,
    clearSavedAddress
} = userSlice.actions;

export default userSlice.reducer;
