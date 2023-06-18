import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { adaptivityStore } from '../store/adaptivity/adaptivity';
import './App.scss';
import { AppDesktopView } from './core/app-views/AppDesktopView/AppDesktopView';
import { AppMobileView } from './core/app-views/AppMobileView/AppMobileView';

export const App: FC = observer(() => {
	if (adaptivityStore.screenBreakpoint === 'mobile') {
		return <AppMobileView />;
	}

	return <AppDesktopView />;
});
