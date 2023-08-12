import { FC, useState } from 'react';
import { CategoryData } from 'src/models/categories';
import { categoriesStore } from 'src/store/categories/categories';
import { action } from 'mobx';
import { Icon } from 'src/app/shared/Icon/Icon';

import './ChildCategory.scss';
import { EditCategory } from '../EditCategory/EditCategory';

export const ChildCategory: FC<CategoryData> = category => {
	const [editMode, setEditMode] = useState(false);

	const toggleEditMode = (): void => {
		setEditMode(prev => !prev);
	};

	const onRemove = action((): void => {
		categoriesStore.remove(category._id);
	});

	return (
		<div className="child-category">
			{editMode ? (
				<EditCategory category={category} onSubmit={toggleEditMode} />
			) : (
				<span onClick={toggleEditMode}>{category.name}</span>
			)}

			<Icon name="remove" onClick={onRemove} />
		</div>
	);
};
