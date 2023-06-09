import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { categoriesRouter } from 'src/store/categories/categories-router';
import { AllCategories } from './AllCategories/AllCategories';

export const CategoriesMain = observer(() => {
	const addCategoryHandler = action(() => {
		categoriesRouter.navigate('create');
	});

	return (
		<div>
			<button onClick={addCategoryHandler}>add</button>
			<AllCategories />
		</div>
	);
});
