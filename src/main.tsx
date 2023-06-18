import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.scss';
import { appRouter } from './router';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<StrictMode>
		<RouterProvider router={appRouter} />
	</StrictMode>
);
