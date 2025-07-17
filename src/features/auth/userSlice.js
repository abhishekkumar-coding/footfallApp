import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    fcmToken: ''
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        clearUser: (state) => {
            state.user = null
        },
        setFcmToken: (state, action) => {
            state.fcmToken = action.payload;
        },
    },


})

export const { setUser, clearUser , setFcmToken} = userSlice.actions
export default userSlice.reducer