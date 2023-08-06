import { observer } from 'mobx-react-lite';
import { PlanCategoryData, PlanData } from 'src/models/plans';
import { plansStore } from 'src/store/plans/plans';
import { plansRouter } from 'src/store/plans/plans-router';
import { MONTH_FULL_NAMES } from '../consts/month-full-names';

export const AllPlans = observer(() => {
	const planClickHandler = (data: PlanData): void => {
		plansStore.setSelected(data);
		plansRouter.navigate('selected');
	};

	const addPlanHandler = (): void => {
		plansRouter.navigate('create');
	};

	const calcPlanAmounts = (plan: PlanData): Omit<PlanCategoryData, 'category'> => {
		const expectedWaste = plan.categories.reduce(
			(res: number, planCategory: PlanCategoryData) => (res += planCategory.expectedWaste),
			0
		);

		const realWaste = plan.categories.reduce(
			(res: number, planCategory: PlanCategoryData) => (res += planCategory.realWaste),
			0
		);

		return {
			expectedWaste,
			realWaste
		};
	};

	return (
		<>
			<h4>Все планы</h4>
			<button onClick={addPlanHandler}>создать</button>
			<div>
				{plansStore.allPlans.map(plan => {
					const amounts = calcPlanAmounts(plan);

					return (
						<div key={plan._id} onClick={(): void => planClickHandler(plan)}>
							План на {MONTH_FULL_NAMES[plan.month]}
							<div>всего запланировано: {amounts.expectedWaste}</div>
							<div>всего потрачено: {amounts.realWaste}</div>
						</div>
					);
				})}
			</div>
		</>
	);
});
