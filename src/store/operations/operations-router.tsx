import { makeAutoObservable } from 'mobx';
import { ReactElement } from 'react';
import { MyRouter } from 'src/models/my-router';
import { OperationsMain } from 'src/app/content/Operations/OperationsMain/OperationsMain';
import { AddOperation } from 'src/app/content/Operations/AddOperation/AddOperation';

class OperationsRouter implements MyRouter<OperationsRouteNames> {
	currentView: ReactElement = (<OperationsMain />);
	currentRoute: OperationsRouteNames = 'main';

	constructor() {
		makeAutoObservable(this);
	}

	navigate(viewName: OperationsRouteNames): void {
		this.currentRoute = viewName;

		this.currentView = operationsRoutes[viewName]();
	}
}

export type OperationsRouteNames = 'main' | 'add';

const operationsRoutes: Record<OperationsRouteNames, () => ReactElement> = {
	main: () => <OperationsMain />,
	add: () => <AddOperation />
};

export const operationsRouter = new OperationsRouter();
