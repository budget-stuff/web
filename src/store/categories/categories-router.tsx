import { makeAutoObservable } from 'mobx';
import { ReactElement } from 'react';
import { CategoriesMain } from '../../app/content/Categories/CategoriesMain/CategoriesMain';
import { MyRouter } from 'src/models/my-router';
import { SelectedCategory } from 'src/app/content/Categories/SelectedCategory/SelectedCategory';

class CategoriesRouter implements MyRouter<CategoriesRouteNames> {
	currentView: ReactElement = (<CategoriesMain />);
	currentRoute: CategoriesRouteNames = 'main';

	constructor() {
		makeAutoObservable(this);
	}

	navigate(viewName: CategoriesRouteNames): void {
		this.currentRoute = viewName;

		this.currentView = categoriesRoutes[viewName]();
	}
}

export type CategoriesRouteNames = 'main' | 'selected';

const categoriesRoutes: Record<CategoriesRouteNames, () => ReactElement> = {
	main: () => <CategoriesMain />,
	selected: () => <SelectedCategory />
};

export const categoriesRouter = new CategoriesRouter();
