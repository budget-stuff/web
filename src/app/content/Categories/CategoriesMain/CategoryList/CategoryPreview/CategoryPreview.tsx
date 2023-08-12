import { observer } from 'mobx-react-lite';
import { Icon } from 'src/app/shared/Icon/Icon';
import { RootCategoryData } from 'src/models/categories';

import { MouseEvent } from 'react';
import { categoriesStore } from 'src/store/categories/categories';
import { categoriesRouter } from 'src/store/categories/categories-router';
import './CategoryPreview.scss';

export const CategoryPreview = observer<RootCategoryData>(category => {
	const onRemove = (event: MouseEvent): void => {
		event.stopPropagation();

		categoriesStore.remove(category._id);
	};

	const toSelected = (): void => {
		categoriesStore.setSelected(category);

		categoriesRouter.navigate('selected');
	};

	return (
		<div className="category-preview" onClick={toSelected}>
			<div className="category-preview__header">
				{category.name}
				<Icon name="remove" onClick={onRemove} />
			</div>

			{category.subcategories.length !== 0 && (
				<div className="category-preview__subcategories-container">
					{category.subcategories.map(subCat => (
						<div className="category-preview__subcategory" key={subCat._id}></div>
					))}
				</div>
			)}
		</div>
	);
});
