import { FC } from 'react';
import { RootCategoryData } from 'src/models/categories';
import { CategoryPreview } from './CategoryPreview/CategoryPreview';

import './CategoryList.scss';

export const CategoryList: FC<CategoryListProps> = ({ categories }) => (
	<div className="category-list">
		{categories.map(cat => (
			<CategoryPreview key={cat._id} {...cat}></CategoryPreview>
		))}
	</div>
);

interface CategoryListProps {
	categories: RootCategoryData[];
}
