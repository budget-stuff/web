import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { categoriesRouter } from 'src/store/categories/categories-router';
import { categoriesStore } from 'src/store/categories/categories';
import { CategoriesErrorTaskQueue } from './CategoriesTaskQueue/CategoriesErrorTaskQueue';

import './CategoriesMain.scss';
import { CategoryList } from './CategoryList/CategoryList';

export const CategoriesMain = observer(() => {
	const addCategoryHandler = action(() => {
		categoriesRouter.navigate('form');
	});

	const outcomeCategories = categoriesStore.rootCategories.filter(category => category.type === 'outcome');
	const incomeCategories = categoriesStore.rootCategories.filter(category => category.type === 'income');

	return (
		<div className="categories-main">
			<h4>Категории</h4>
			<button onClick={addCategoryHandler}>add</button>

			{categoriesStore.sceduler.isError && (
				<>
					<h5>Невыполненные действия</h5>
					<CategoriesErrorTaskQueue />
				</>
			)}

			{outcomeCategories.length !== 0 && (
				<>
					<h5>Расходы</h5>
					<CategoryList categories={outcomeCategories} />
				</>
			)}

			{incomeCategories.length !== 0 && (
				<>
					<h5>Доходы</h5>
					<CategoryList categories={incomeCategories} />
				</>
			)}
		</div>
	);
});
