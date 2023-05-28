import { createBrowserRouter } from 'react-router-dom';
import { App } from './app/App';

export const appRouter = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: []
	}
]);
