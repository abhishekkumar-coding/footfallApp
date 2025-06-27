import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from '@react-native-async-storage/async-storage';


const rawBaseQuery = fetchBaseQuery({
    baseUrl: 'https://footfall.onrender.com/api/',
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
    const token = await AsyncStorage.getItem('token');
    console.log('[Auth Debug] Retrieved token:', token);


    return rawBaseQuery(args, api, {
        ...extraOptions,
        prepareHeaders: (headers) => {
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    });
};

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        signup: builder.mutation({
            query: (userData) => ({
                url: 'user/signUp',
                method: 'POST',
                body: userData,
            }),
        }),

        login: builder.mutation({
            query: (credentials) => ({
                url: 'user/signIn',
                method: 'POST',
                body: credentials,
            }),
        }),
        requestOtp: builder.mutation({
            query: ({ email }) => ({
                url: "user/sendRestOtp",
                method: "POST",
                body: { email },
            }),
        }),
        verifyOtp: builder.mutation({
            query: (data) => ({
                url: "user/verifyOtp",
                method: "POST",
                body: data,
            })
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: "user/resetPasswordByOtp",
                method: "POST",
                body: data
            })
        })
    }),
});

export const { useSignupMutation, useLoginMutation, useRequestOtpMutation, useVerifyOtpMutation, useResetPasswordMutation } = authApi;
