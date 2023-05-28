import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CreateTempUserFormData } from '../app/admin/CreateTempUserForm/CreateTempUserForm.types';
import { LoginData } from '../app/admin/LoginForm/LoginForm.types';
import { TemporaryUserData } from '../models/temp-user';
import { UserData } from '../models/user';

export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
	tagTypes: ['User', 'TempUsers'],
	endpoints: builder => ({
		getUser: builder.query<UserData, void>({
			query: () => ({
				url: '/auth/profile'
			})
		}),
		login: builder.mutation<UserData, LoginData>({
			query: (data: LoginData) => ({
				url: '/auth/login',
				method: 'POST',
				body: data
			}),
			// запрос логина возвращает данные пользователя, сразу кладем их в кэш запроса данных пользователя
			onCacheEntryAdded: (reqData, { dispatch, cacheDataLoaded }) => {
				cacheDataLoaded.then(({ data }) => {
					const upcertUserAction = apiSlice.util.upsertQueryData<'getUser'>('getUser', undefined, data);

					dispatch(upcertUserAction);
				});
			}
		}),
		getTemoraryUser: builder.query<TemporaryUserData, string>({
			query: (id: string) => '/temporary/' + id
			// // запрос логина возвращает данные пользователя, сразу кладем их в кэш запроса данных пользователя
			// onCacheEntryAdded: reqData => {
			// 	if (reqData) {
			// 		localStorage.setItem('tempId', reqData);
			// 	}
			// }
		}),
		getTemoraryUsers: builder.query<TemporaryUserData[], void>({
			query: () => '/temporary',
			providesTags: ['TempUsers']
		}),
		createTemporaryUser: builder.mutation<TemporaryUserData, CreateTempUserFormData>({
			query: (data: CreateTempUserFormData) => ({
				url: '/temporary',
				method: 'POST',
				body: data
			}),
			onCacheEntryAdded: (reqData, { dispatch, cacheDataLoaded }) => {
				cacheDataLoaded.then(({ data }) => {
					const upcertUserAction = apiSlice.util.updateQueryData<'getTemoraryUsers'>(
						'getTemoraryUsers',
						undefined,
						tempUsers => {
							tempUsers.push(data);
						}
					);

					dispatch(upcertUserAction);
				});
			}
		}),
		deleteTemporaryUser: builder.mutation<TemporaryUserData, string>({
			query: (id: string) => ({
				url: '/temporary/' + id,
				method: 'DELETE'
			}),
			onCacheEntryAdded: (reqData, { dispatch, cacheDataLoaded }) => {
				cacheDataLoaded.then(({ data }) => {
					const upcertUserAction = apiSlice.util.updateQueryData<'getTemoraryUsers'>(
						'getTemoraryUsers',
						undefined,
						tempUsers => tempUsers.filter(tempUser => tempUser.id !== data.id)
					);

					dispatch(upcertUserAction);
				});
			}
		}),
		refreshTemporaryUser: builder.mutation<TemporaryUserData, string>({
			query: (id: string) => ({
				url: '/temporary/' + id,
				method: 'PUT'
			}),
			onCacheEntryAdded: (reqData, { dispatch, cacheDataLoaded }) => {
				cacheDataLoaded.then(({ data }) => {
					const upcertUserAction = apiSlice.util.updateQueryData<'getTemoraryUsers'>(
						'getTemoraryUsers',
						undefined,
						tempUsers => tempUsers.map(tempUser => (tempUser.id === data.id ? data : tempUser))
					);

					dispatch(upcertUserAction);
				});
			}
		})
	})
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
	useGetUserQuery,
	useLoginMutation,
	useCreateTemporaryUserMutation,
	useGetTemoraryUserQuery,
	useGetTemoraryUsersQuery,
	useDeleteTemporaryUserMutation,
	useRefreshTemporaryUserMutation
} = apiSlice;
