import { autorun, makeAutoObservable, runInAction } from 'mobx';
import { PlansCreateData } from 'src/app/content/Plans/PlansCreate/PlansCreate.models';
import { OperationData } from 'src/models/operations';
import { PlanData } from 'src/models/plans';
import { UserData } from 'src/models/user';
import { api } from '../../utils/api/api';
import { UserStore, userStore } from '../user/user';
import { EntityOperator } from '../entity-operator/entity-operator';
import { Entity } from '../entity-operator/entity';
import { OperationsStore, operationsStore } from '../operations/operations';

export class PlansStore {
	private baseUrl = '/api/plans';
	private operator = new EntityOperator<PlanData>();

	selectedPlan: Entity<PlanData> | undefined = undefined;

	get selectedPlanOperations(): Array<Entity<OperationData>> {
		if (this.selectedPlan) {
			return this.operationsStore.allOperations.filter(
				operation =>
					operation.data.month === this.selectedPlan?.data.month &&
					operation.data.year === this.selectedPlan?.data.year
			);
		}

		return [];
	}

	get allPlans(): Array<Entity<PlanData>> {
		return this.operator.items;
	}

	constructor(private userStore: UserStore, private operationsStore: OperationsStore) {
		makeAutoObservable(this);

		autorun(() => {
			if (this.userStore.isLoggedin) {
				this.loadAll();
			}
		});
	}

	setSelected(data: Entity<PlanData>): void {
		this.selectedPlan = data;
	}

	loadAll(): void {
		api.get<PlanData[]>(this.baseUrl).then(plans => {
			runInAction(() => {
				this.operator.init(plans);

				const today = new Date();

				const selectedPlan = this.allPlans.find(
					plan => plan.data.month === today.getMonth() && plan.data.year === today.getFullYear()
				);

				if (selectedPlan) {
					this.setSelected(selectedPlan);
				}
			});
		});
	}

	create(data: PlansCreateData): void {
		const mockPlanData = {
			...data,
			owner: userStore.user as UserData,
			_id: ''
		};

		const request = (): Promise<PlanData> => api.post<PlansCreateData, PlanData>(this.baseUrl, data);

		this.operator.createEntity(mockPlanData, request);
	}

	update(data: Partial<PlanData> & { _id: string }, item: Entity<PlanData>): void {
		const request = (): Promise<PlanData> =>
			api.put<Partial<PlanData> & { _id: string }, PlanData>(this.baseUrl + '/' + data._id, data);

		this.operator.updateEntity(data, item, request);
	}
}

export const plansStore: PlansStore = new PlansStore(userStore, operationsStore);
