import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://footfall.onrender.com/api/',
    }),
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
                body:  data ,
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
