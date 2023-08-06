import { makeAutoObservable } from 'mobx';
import { ReactElement } from 'react';
import { AllPlans } from 'src/app/content/Plans/AllPlans/AllPlans';
import { PlansCreate } from 'src/app/content/Plans/PlansCreate/PlansCreate';
import { SelectedPlan } from 'src/app/content/Plans/SelectedPlan/SelectedPlan';
import { MyRouter } from 'src/models/my-router';

class PlansRouter implements MyRouter<PlansRouteNames> {
	currentView: ReactElement = plansRoutes.all();
	currentRoute: PlansRouteNames = 'all';

	constructor() {
		makeAutoObservable(this);
	}

	navigate(viewName: PlansRouteNames): void {
		this.currentRoute = viewName;

		this.currentView = plansRoutes[viewName]();
	}
}

export type PlansRouteNames = 'create' | 'all' | 'selected';

const plansRoutes: Record<PlansRouteNames, () => ReactElement> = {
	create: () => <PlansCreate />,
	selected: () => <SelectedPlan />,
	all: () => <AllPlans />
};

export const plansRouter = new PlansRouter();
