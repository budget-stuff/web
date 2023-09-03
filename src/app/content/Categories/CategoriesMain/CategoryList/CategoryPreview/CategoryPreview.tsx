import { observer } from 'mobx-react-lite';
import { Icon } from 'src/app/shared/Icon/Icon';

import { MouseEvent } from 'react';
import { categoriesStore } from 'src/store/categories/categories';
import { categoriesRouter } from 'src/store/categories/categories-router';
import './CategoryPreview.scss';
import { Entity } from 'src/store/entity-operator/entity';
import { CategoryData } from 'src/models/categories';
import { Card } from 'src/app/shared/Card/Card';

export const CategoryPreview = observer<CategoryPreviewProps>(({ entity }) => {
	const onRemove = (event: MouseEvent): void => {
		event.stopPropagation();

		categoriesStore.remove(entity);
	};

	const toSelected = (): void => {
		categoriesStore.setSelected(entity.data);

		categoriesRouter.navigate('selected');
	};

	const subcategories = categoriesStore.getSubcatsFor(entity.data._id);

	return (
		<Card className="category-preview" onClick={toSelected}>
			<div className="category-preview__header">
				{entity.data.name}
				<Icon name="remove" onClick={onRemove} />
			</div>

			{subcategories.length !== 0 && (
				<div className="category-preview__subcategories-container">
					{subcategories.map(subCat => (
						<div className="category-preview__subcategory" key={subCat.id}></div>
					))}
				</div>
			)}
		</Card>
	);
});

export interface CategoryPreviewProps {
	entity: Entity<CategoryData>;
}
