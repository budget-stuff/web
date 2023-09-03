import { observer } from 'mobx-react-lite';
import { categoriesStore } from 'src/store/categories/categories';

import './CategoriesMain.scss';
import { CategoryList } from './CategoryList/CategoryList';
import { Icon } from 'src/app/shared/Icon/Icon';
import { CategoryData, CategoryTypes } from 'src/models/categories';
import { NEW_CATEGORY_NAME } from '../consts/new-name';

export const CategoriesMain = observer(() => {
	const outcomeCategories = categoriesStore.rootCategories.filter(category => category.data.type === 'outcome');
	const incomeCategories = categoriesStore.rootCategories.filter(category => category.data.type === 'income');

	const addCategory = (type: CategoryTypes): void => {
		const newCategoryData = {
			name: NEW_CATEGORY_NAME,
			type
		} as CategoryData;

		categoriesStore.create(newCategoryData);
	};

	return (
		<div className="categories-main">
			<h4>Категории</h4>

			{outcomeCategories.length !== 0 && (
				<>
					<div className="categories-main__type-title">
						<h5>Расходы</h5>
						<Icon name="add" onClick={(): void => addCategory('outcome')} />
					</div>
					<CategoryList categories={outcomeCategories} />
				</>
			)}

			{incomeCategories.length !== 0 && (
				<>
					<div className="categories-main__type-title">
						<h5>Доходы</h5>
						<Icon name="add" onClick={(): void => addCategory('income')} />
					</div>
					<CategoryList categories={incomeCategories} />
				</>
			)}
		</div>
	);
});
