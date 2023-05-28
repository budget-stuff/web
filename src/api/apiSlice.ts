import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
	tagTypes: ['User', 'TempUsers'],
	endpoints: builder => ({})
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const {} = apiSlice;
