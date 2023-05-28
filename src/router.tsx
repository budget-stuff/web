import { createBrowserRouter } from 'react-router-dom';
import { App } from './app/App';
import { UserData } from './models/user';

export const appRouter = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		loader: (): Promise<UserData | null> =>
			fetch('/api/auth/profile').then(res => {
				if (res.ok) {
					return res.json();
				}

				location.href = location.origin + '/api/auth';

				return null;
			}),
		children: []
	}
]);
