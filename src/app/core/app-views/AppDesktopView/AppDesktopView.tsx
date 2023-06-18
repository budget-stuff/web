import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { categoriesRouter } from '../../../../store/categories/categories-router';
import { Categories } from '../../../content/Categories/Categories';

export const AppDesktopView = observer(() => {
	const changeRouteHandler = action((): void => {
		console.log(categoriesRouter.currentRoute);
		if (categoriesRouter.currentRoute === 'main') {
			categoriesRouter.navigate('create');
		} else {
			categoriesRouter.navigate('main');
		}
	});

	return (
		<>
			<h1>Vite + React</h1>
			<div className="card">
				<button onClick={changeRouteHandler}>current categories route {categoriesRouter.currentRoute}</button>
				<Categories />
			</div>
		</>
	);
});
