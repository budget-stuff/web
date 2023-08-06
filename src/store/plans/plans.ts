import { autorun, makeAutoObservable, runInAction } from 'mobx';
import { PlansCreateData } from 'src/app/content/Plans/PlansCreate/PlansCreate.models';
import { OperationData } from 'src/models/operations';
import { PlanCategoryData, PlanData } from 'src/models/plans';
import { UserData } from 'src/models/user';
import { api } from '../../utils/api/api';
import { UserStore, userStore } from '../user/user';

export class PlansStore {
	allPlans: PlanData[] = [];
	selectedPlan: PlanData | undefined = undefined;

	constructor(private userStore: UserStore) {
		makeAutoObservable(this);

		autorun(() => {
			if (this.userStore.isLoggedin) {
				this.loadAll();
			}
		});
	}

	setSelected(data: PlanData): void {
		this.selectedPlan = data;
	}

	loadAll(): void {
		api.get<PlanData[]>('/api/plans').then(plans => {
			runInAction(() => {
				this.allPlans = plans;

				const today = new Date();

				this.selectedPlan = plans.find(
					plan => plan.month === today.getMonth() && plan.year === today.getFullYear()
				);
			});
		});
	}

	create(data: PlansCreateData, categories: PlanCategoryData[]): void {
		// временный айди, нужен чтобы после обработки запроса проще было заменить сущность на ту что пришла с БЕ
		const tempId = Math.random().toString();

		this.allPlans.push({
			...data,
			owner: userStore.user as UserData,
			_id: tempId,
			categories
		});

		api.post<PlansCreateData, PlanData>('/api/plans', data)
			.then(createdPlan => {
				runInAction(() => {
					this.allPlans = this.allPlans.map(plan => {
						if (plan._id === tempId) {
							return createdPlan;
						}

						return plan;
					});
				});
			})
			.catch(() => {
				this.allPlans = this.allPlans.filter(plan => plan._id !== tempId);
			});
	}

	addWaste(operation: OperationData): void {
		this.allPlans = this.allPlans.map(plan => {
			const operationDate = new Date(operation.date);

			const operationMonth = operationDate.getMonth();
			const operationYear = operationDate.getFullYear();

			const dateMatchesWithPlan = plan.month === operationMonth && plan.year === operationYear;

			if (dateMatchesWithPlan) {
				const categoryMatchesWithPlan = plan.categories.find(
					planCategory => planCategory.category._id === operation.category._id
				);

				if (categoryMatchesWithPlan) {
					categoryMatchesWithPlan.realWaste += operation.amount;
				}
			}

			return plan;
		});
	}

	removeWaste(operation: OperationData): void {
		this.allPlans = this.allPlans.map(plan => {
			const operationDate = new Date(operation.date);

			const operationMonth = operationDate.getMonth();
			const operationYear = operationDate.getFullYear();

			const dateMatchesWithPlan = plan.month === operationMonth && plan.year === operationYear;

			if (dateMatchesWithPlan) {
				const categoryMatchesWithPlan = plan.categories.find(
					planCategory => planCategory.category._id === operation.category._id
				);

				if (categoryMatchesWithPlan) {
					categoryMatchesWithPlan.realWaste -= operation.amount;
				}
			}

			return plan;
		});
	}
}

export const plansStore = new PlansStore(userStore);
