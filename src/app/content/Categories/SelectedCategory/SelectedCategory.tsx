import { observer } from 'mobx-react-lite';
import { Overline } from 'src/app/shared/Overline/Overline';
import { categoriesStore } from 'src/store/categories/categories';
import { categoriesRouter } from 'src/store/categories/categories-router';
import { CATEGORY_TYPE_NAME } from '../consts/type-names';
import { ChildCategory } from './ChildCategory/ChildCategory';

import './SelectedCategory.scss';
import { useState } from 'react';
import { EditCategory } from './EditCategory/EditCategory';

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

	return (
		<div className="selected-category">
			{edit ? (
				<EditCategory category={selectedCategory} onSubmit={toggleEditMode} />
			) : (
				<h4 onClick={toggleEditMode}>{selectedCategory.name}</h4>
			)}

			<button onClick={toMain}>to main</button>
			<Overline title="тип" text={CATEGORY_TYPE_NAME[selectedCategory.type]} />

			<h5>Подкатегории</h5>
			{selectedCategory.subcategories.length ? (
				<div className="selected-category__subcategories">
					{selectedCategory.subcategories.map(childCategory => (
						<ChildCategory key={childCategory._id} {...childCategory} />
					))}
				</div>
			) : (
				'Нет подкатегорий'
			)}
		</div>
	);
});
