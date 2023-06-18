import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';
import { MobileNav } from './MobileNav/MobileNav';

import './AppMobileView.scss';

export const AppMobileView = observer(() => (
	<div className="app-mobile-view">
		<Outlet />
		<MobileNav className="app-mobile-view__nav" />
	</div>
));
