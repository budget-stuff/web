import { FC, useState } from 'react';
import { CategoryData } from 'src/models/categories';
import { categoriesStore } from 'src/store/categories/categories';
import { action } from 'mobx';
import { Icon } from 'src/app/shared/Icon/Icon';

import './ChildCategory.scss';
import { EditCategoryName } from '../EditCategory/EditCategoryName';
import { Entity } from 'src/store/entity-operator/entity';
import { Card } from 'src/app/shared/Card/Card';

export const ChildCategory: FC<ChildCategoryProps> = ({ entity }) => {
	const [editMode, setEditMode] = useState(false);

	const toggleEditMode = (): void => {
		setEditMode(prev => !prev);
	};

	const onRemove = action((): void => {
		categoriesStore.remove(entity);
	});

	return (
		<Card className="child-category">
			{editMode ? (
				<EditCategoryName category={entity} onSubmit={toggleEditMode} />
			) : (
				<span onClick={toggleEditMode}>{entity.data.name}</span>
			)}

			<Icon name="remove" onClick={onRemove} />
		</Card>
	);
};

interface ChildCategoryProps {
	entity: Entity<CategoryData>;
}
