import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Overline } from 'src/app/shared/Overline/Overline';
import { PlanCategoryData } from 'src/models/plans';
import { EditPlanCategory } from '../EditPlanCategory/EditPlanCategory';

export const PlanCategoryExpectedWaste = observer<PlanCategoryExpectedWasteProps>(({ planCategory }) => {
	const [editMode, setEditMode] = useState(false);

	const toggleEditMode = (): void => {
		setEditMode(prev => !prev);
	};

	return (
		<Overline title="ожидаемые расходы">
			{editMode ? (
				<EditPlanCategory planCategory={planCategory} onSubmit={toggleEditMode} fieldToEdit="expectedWaste" />
			) : (
				<span onClick={toggleEditMode}>{planCategory.expectedWaste}</span>
			)}
		</Overline>
	);
});

interface PlanCategoryExpectedWasteProps {
	planCategory: PlanCategoryData;
}
