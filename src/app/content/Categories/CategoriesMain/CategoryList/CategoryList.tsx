import { FC } from 'react';
import { CategoryData } from 'src/models/categories';
import { CategoryPreview } from './CategoryPreview/CategoryPreview';

import './CategoryList.scss';
import { Entity } from 'src/store/entity-operator/entity';

export const CategoryList: FC<CategoryListProps> = ({ categories }) => (
	<div className="category-list">
		{categories.map(cat => (
			<CategoryPreview key={cat.id} entity={cat}></CategoryPreview>
		))}
	</div>
);

interface CategoryListProps {
	categories: Array<Entity<CategoryData>>;
}
