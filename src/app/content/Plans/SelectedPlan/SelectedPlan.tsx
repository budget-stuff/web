import { observer } from 'mobx-react-lite';
import { plansStore } from 'src/store/plans/plans';
import { plansRouter } from 'src/store/plans/plans-router';
import { PlanCategory } from './PlanCategory/PlanCategory';
import { MONTH_FULL_NAMES } from '../consts/month-full-names';

import './SelectedPlan.scss';

export const SelectedPlan = observer(() => {
	const toAll = (): void => {
		plansRouter.navigate('all');
	};

	if (!plansStore.selectedPlan) {
		return (
			<>
				<div>Нет данных</div>
				<button onClick={toAll}>назад</button>
			</>
		);
	}

	return (
		<div className="selected-plan">
			<h4>План на {MONTH_FULL_NAMES[plansStore.selectedPlan.data.month]}</h4>

			<button onClick={toAll}>назад</button>

			<h5>Категории</h5>

			<div className="selected-plan__categories">
				{plansStore.selectedPlan.data.categories.map(planCategory => (
					<PlanCategory key={planCategory.category} planCategory={planCategory} />
				))}
			</div>
		</div>
	);
});
