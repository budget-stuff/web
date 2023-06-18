import { Navigate, createBrowserRouter, redirect } from 'react-router-dom';
import { App } from './app/App';
import { AuthPage } from './app/core/AuthPage/AuthPage';
import { userStore } from './store/user/user';
import { Categories } from './app/content/Categories/Categories';
import { Operations } from './app/content/Operations/Operations';
import { Plans } from './app/content/Plans/Plans';

export const appRouter = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		loader: (): Response | null => {
			if (!userStore.isLoggedin) {
				return redirect('/auth');
			}

			return null;
		},
		children: [
			{
				index: true,
				element: <Navigate to={'/categories'} replace />
			},
			{
				path: 'categories',
				element: <Categories />
			},
			{
				path: 'operations',
				element: <Operations />
			},
			{
				path: 'plans',
				element: <Plans />
			},
			{
				path: '*',
				element: <Navigate to={'/categories'} replace />
			}
		]
	},
	{
		path: '/auth',
		element: <AuthPage />
	}
]);
