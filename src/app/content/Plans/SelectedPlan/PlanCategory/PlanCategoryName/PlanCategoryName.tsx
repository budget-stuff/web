import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Overline } from 'src/app/shared/Overline/Overline';
import { PlanCategoryData } from 'src/models/plans';
import { categoriesStore } from 'src/store/categories/categories';
import { EditPlanCategory } from '../EditPlanCategory/EditPlanCategory';

export const PlanCategoryName = observer<PlanCategoryNameProps>(({ planCategory }) => {
	const [editMode, setEditMode] = useState(false);
	const category = categoriesStore.getById(planCategory.category);

	const toggleEditMode = (): void => {
		setEditMode(prev => !prev);
	};

	return (
		<Overline title="Категория">
			{editMode ? (
				<EditPlanCategory planCategory={planCategory} onSubmit={toggleEditMode} fieldToEdit="category" />
			) : (
				<span onClick={toggleEditMode}>{category?.data.name || 'нет названия'}</span>
			)}
		</Overline>
	);
});

interface PlanCategoryNameProps {
	planCategory: PlanCategoryData;
}
