import { makeAutoObservable } from 'mobx';
import { ReactElement } from 'react';
import { CategoriesMain } from '../../app/content/Categories/CategoriesMain/CategoriesMain';
import { CreateCategory } from '../../app/content/Categories/CreateCategory/CreateCategory';

class CategoriesRouter {
	currentView: ReactElement = (<CategoriesMain />);
	currentRoute: CategoriesRouteNames = 'main';

	constructor() {
		makeAutoObservable(this);
	}

	navigate(viewName: CategoriesRouteNames): void {
		this.currentRoute = viewName;

		this.currentView = categoriesRoutes[viewName];
	}
}

export type CategoriesRouteNames = 'main' | 'create';

const categoriesRoutes: Record<CategoriesRouteNames, ReactElement> = {
	main: <CategoriesMain />,
	create: <CreateCategory />
};

export const categoriesRouter = new CategoriesRouter();
