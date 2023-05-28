import { createBrowserRouter } from 'react-router-dom';
import { App } from './app/App';

export const appRouter = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		loader: (args): Promise<string> =>
			fetch('/api/auth').then(r => {
				console.log(r);
				return 'hello world!';
			}),
		children: []
	}
]);
