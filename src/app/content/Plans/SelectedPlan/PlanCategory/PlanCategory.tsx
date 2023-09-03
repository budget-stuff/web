import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { Card } from 'src/app/shared/Card/Card';
import { CategoryData } from 'src/models/categories';
import { OperationData } from 'src/models/operations';
import { PlanCategoryData } from 'src/models/plans';
import { Entity } from 'src/store/entity-operator/entity';
import { plansStore } from 'src/store/plans/plans';

import './PlanCategory.scss';
import { Overline } from 'src/app/shared/Overline/Overline';
import { PlanCategoryName } from './PlanCategoryName/PlanCategoryName';
import { PlanCategoryExpectedWaste } from './PlanCategoryExpectedWaste/PlanCategoryExpectedWaste';

export const PlanCategory: FC<PlanCategoryProps> = observer(({ planCategory }) => {
	const realWaste = plansStore.selectedPlanOperations
		.filter(operation => operation.data.category === planCategory.category)
		.reduce((res: number, item: Entity<OperationData>) => (res += item.data.amount), 0);

	return (
		<Card className="plan-category">
			<PlanCategoryName planCategory={planCategory} />
			<PlanCategoryExpectedWaste planCategory={planCategory} />
			<Overline title="реальные расходы">{realWaste}</Overline>
		</Card>
	);
});

interface PlanCategoryProps {
	planCategory: PlanCategoryData;
	category?: Entity<CategoryData>;
}
