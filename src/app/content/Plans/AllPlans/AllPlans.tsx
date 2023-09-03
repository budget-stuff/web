import { observer } from 'mobx-react-lite';
import { PlanCategoryData, PlanData } from 'src/models/plans';
import { plansStore } from 'src/store/plans/plans';
import { plansRouter } from 'src/store/plans/plans-router';
import { MONTH_FULL_NAMES } from '../consts/month-full-names';
import { Entity } from 'src/store/entity-operator/entity';
import { operationsStore } from 'src/store/operations/operations';
import { OperationData } from 'src/models/operations';
import { Card } from 'src/app/shared/Card/Card';

import './AllPlans.scss';

export const AllPlans = observer(() => {
	const planClickHandler = (data: Entity<PlanData>): void => {
		plansStore.setSelected(data);
		plansRouter.navigate('selected');
	};

	const addPlanHandler = (): void => {
		plansRouter.navigate('create');
	};

	const calcPlanAmounts = (
		plan: PlanData
	): Omit<PlanCategoryData, 'category'> & { planOperations: Array<Entity<OperationData>>; realWaste: number } => {
		const planOperations = operationsStore.allOperations.filter(
			operation => operation.data.month === plan.month && operation.data.year === plan.year
		);

		const expectedWaste = plan.categories.reduce(
			(res: number, planCategory: PlanCategoryData) => (res += planCategory.expectedWaste),
			0
		);

		const realWaste = planOperations.reduce(
			(res: number, operation: Entity<OperationData>) => (res += operation.data.amount),
			0
		);

		return {
			expectedWaste,
			realWaste,
			planOperations
		};
	};

	return (
		<div className="all-plans">
			<h4>Все планы</h4>
			<button onClick={addPlanHandler}>создать</button>
			<div className="all-plans__list">
				{plansStore.allPlans.map(plan => {
					const amounts = calcPlanAmounts(plan.data);

					return (
						<Card key={plan.id} onClick={(): void => planClickHandler(plan)}>
							План на {MONTH_FULL_NAMES[plan.data.month]}
							<div>всего запланировано: {amounts.expectedWaste}</div>
							<div>всего потрачено: {amounts.realWaste}</div>
						</Card>
					);
				})}
			</div>
		</div>
	);
});
