import { observer } from 'mobx-react-lite';
import { Overline } from 'src/app/shared/Overline/Overline';
import { categoriesStore } from 'src/store/categories/categories';
import { categoriesRouter } from 'src/store/categories/categories-router';
import { CATEGORY_TYPE_NAME } from '../consts/type-names';
import { ChildCategory } from './ChildCategory/ChildCategory';

import './SelectedCategory.scss';
import { useState } from 'react';
import { EditCategoryName } from './EditCategory/EditCategoryName';
import { Icon } from 'src/app/shared/Icon/Icon';
import { CategoryData } from 'src/models/categories';
import { NEW_CATEGORY_NAME } from '../consts/new-name';

export const SelectedCategory = observer(() => {
	const [edit, setEdit] = useState(false);

	const toggleEditMode = (): void => {
		setEdit(prev => !prev);
	};

	const toMain = (): void => {
		categoriesRouter.navigate('main');
		categoriesStore.clearSelected();
	};

	const { selectedCategory } = categoriesStore;

	if (!selectedCategory) {
		return (
			<>
				<button onClick={toMain}>to main</button>
				<h4>не выбрана категория</h4>
			</>
		);
	}

	const addSubcategory = (): void => {
		const newSubcategoryData = {
			name: NEW_CATEGORY_NAME,
			parentId: selectedCategory.data._id,
			type: selectedCategory.data.type
		} as CategoryData;

		categoriesStore.create(newSubcategoryData);
	};

	const subcategories = categoriesStore.getSubcatsFor(selectedCategory.data._id);

	return (
		<div className="selected-category">
			{edit ? (
				<EditCategoryName category={selectedCategory} onSubmit={toggleEditMode} />
			) : (
				<h4 onClick={toggleEditMode}>{selectedCategory.data.name}</h4>
			)}

			<button onClick={toMain}>to main</button>
			<Overline title="тип">{CATEGORY_TYPE_NAME[selectedCategory.data.type]}</Overline>

			<div className="selected-category__header">
				<h5>Подкатегории</h5>
				<Icon name="add" onClick={addSubcategory} />
			</div>
			{subcategories.length ? (
				<div className="selected-category__subcategories">
					{subcategories.map(childCategory => (
						<ChildCategory key={childCategory.id} entity={childCategory} />
					))}
				</div>
			) : (
				'Нет подкатегорий'
			)}
		</div>
	);
});
