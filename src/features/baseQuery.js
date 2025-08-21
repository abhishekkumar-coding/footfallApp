import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
const isProduction = process.env.NODE_ENV !== 'development';
const baseUrl = isProduction ? 'https://backend.ilovesambhal.com' : 'https://footfall.onrender.com';
const baseQuery = async (args, api, extraOptions) => {
    const token = await AsyncStorage.getItem('token');

    const authenticatedBaseQuery = fetchBaseQuery({
        baseUrl: `${baseUrl}/api/`,
        prepareHeaders: headers => {
            if (token) headers.set('token', token); // ✅ Use same header key as server expects
            return headers;
        },
    });

    return authenticatedBaseQuery(args, api, extraOptions);
};

export default baseQuery;