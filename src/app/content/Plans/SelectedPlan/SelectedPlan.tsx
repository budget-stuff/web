import { observer } from 'mobx-react-lite';
import { plansStore } from 'src/store/plans/plans';
import { plansRouter } from 'src/store/plans/plans-router';
import { PlanCategory } from './PlanCategory/PlanCategory';
import { MONTH_FULL_NAMES } from '../consts/month-full-names';

export const SelectedPlan = observer(() => {
	const toAll = (): void => {
		plansRouter.navigate('all');
	};
	const { selectedPlan } = plansStore;
	if (!selectedPlan) {
		toAll();

		return <div>Нет данных</div>;
	}

	return (
		<>
			<h4>План на {MONTH_FULL_NAMES[selectedPlan.month]}</h4>

			<button onClick={toAll}>назад</button>

			<h5>Категории</h5>

			{selectedPlan.categories.map(planCategory => (
				<PlanCategory key={planCategory.category._id} {...planCategory} />
			))}
		</>
	);
});
