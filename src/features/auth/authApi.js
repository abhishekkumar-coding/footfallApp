import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_DEV_SERVER, REACT_APP_PROD_SERVER } from "@env"
import baseQuery from '../baseQuery';
 
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQuery,
  endpoints: builder => ({
    signup: builder.mutation({
      query: userData => ({
        url: 'user/signUp',
        method: 'POST',
        body: userData,
      }),
    }),

    login: builder.mutation({
      query: credentials => ({
        url: 'user/signIn',
        method: 'POST',
        body: credentials,
      }),
    }),
    getUserById: builder.query({
      query: id => ({
        url: `user/getById/${id}`,
      }),
    }),
    updateUser: builder.mutation({
      query: data => {
        const { id, body } = data;
        return {
          url: `user/update/${id}`,
          method: 'PUT',
          body,
        };
      },
    }),

    requestOtp: builder.mutation({
      query: ({ email }) => ({
        url: 'user/sendRestOtp',
        method: 'POST',
        body: { email },
      }),
    }),
    verifyOtp: builder.mutation({
      query: data => ({
        url: 'user/verifyOtp',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: data => ({
        url: 'user/resetPasswordByOtp',
        method: 'POST',
        body: data,
      }),
    }),
    // ✅ NEW: Google Auth Login/Signup API
    // googleAuthUser: builder.mutation({
    //   query: googleTokenData => ({
    //     url: 'user/googleAuthUser',
    //     method: 'POST',
    //     body: googleTokenData,
    //   }),
    // }),
    // googleLogin: builder.mutation({
    //   query: ({token, fcmToken}) => ({
    //     url: 'user/googleLogin',
    //     method: 'POST',
    //     body: {token, fcmToken},
    //   }),
    // }),
    // googleSignUp: builder.mutation({
    //   query: googleTokenData => ({
    //     url: 'user/googleSignUp',
    //     method: 'POST',
    //     body: googleTokenData,
    //   }),
    // }),
    googleAuth: builder.mutation({
      query: googleTokenData => ({
        url: 'user/googleAuth',
        method: 'POST',
        body: googleTokenData,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useGetUserByIdQuery,
  useRequestOtpMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  // useGetWalletSummaryQuery,
  useUpdateUserMutation,
  // useRedeemVendorPointsMutation,
  // useGoogleLoginMutation,
  // useGoogleSignUpMutation,
  useGoogleAuthMutation,
} = authApi;
