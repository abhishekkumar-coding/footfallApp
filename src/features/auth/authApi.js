import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseQueryWithAuth = async (args, api, extraOptions) => {
  const token = await AsyncStorage.getItem('token');

  const authenticatedBaseQuery = fetchBaseQuery({
    baseUrl: 'https://footfall.onrender.com/api/',
    prepareHeaders: headers => {
      if (token) headers.set('token', token);
      return headers;
    },
  });

  console.log(`AuthApi : ${token}`);
  return authenticatedBaseQuery(args, api, extraOptions);
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithAuth,
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
    googleLogin: builder.mutation({
      query: ({token, fcmToken}) => ({
        url: 'user/googleLogin',
        method: 'POST',
        body: {token, fcmToken}, 
      }),
    }),
    googleSignUp: builder.mutation({
      query: googleTokenData => ({
        url: 'user/googleSignUp',
        method: 'POST',
        body: googleTokenData, 
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useRequestOtpMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  // useGetWalletSummaryQuery,
  useUpdateUserMutation,
  // useRedeemVendorPointsMutation,
  useGoogleLoginMutation,
  useGoogleSignUpMutation,
} = authApi;