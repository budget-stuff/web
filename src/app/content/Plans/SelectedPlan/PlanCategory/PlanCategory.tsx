import { FC } from 'react';
import { PlanCategoryData } from 'src/models/plans';

export const PlanCategory: FC<PlanCategoryData> = ({ category, expectedWaste, realWaste }) => (
	<div>
		<h6>Название</h6>
		<div>{category.name}</div>
		<div>ожидаемые расходы</div>
		<div>{expectedWaste}</div>
		<div>реальные расходы</div>
		<div>{realWaste}</div>
	</div>
);
