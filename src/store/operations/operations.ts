import { autorun, makeAutoObservable, runInAction } from 'mobx';
import { api } from '../../utils/api/api';
import { UserStore, userStore } from '../user/user';
import { OperationData } from 'src/models/operations';
import { PlansStore, plansStore } from '../plans/plans';

export class OperationsStore {
	private sourceAllOperations: OperationData[] = [];

	get allOperations(): OperationData[] {
		return this.sourceAllOperations;
	}

	constructor(private userStore: UserStore, private planStore: PlansStore) {
		makeAutoObservable(this);

		autorun(() => {
			if (this.userStore.isLoggedin) {
				this.loadAll();
			}
		});
	}

	getById(id: string): OperationData | undefined {
		return this.sourceAllOperations.find(operation => operation._id === id);
	}

	loadAll(): void {
		api.get<OperationData[]>('/api/operations').then(operations => {
			runInAction(() => {
				this.sourceAllOperations = operations;
			});
		});
	}

	create(data: OperationData): void {
		// временный айди, нужен чтобы после обработки запроса проще было заменить сущность на ту что пришла с БЕ
		const tempId = Math.random().toString();

		this.sourceAllOperations.push({
			...data,
			_id: tempId
		});

		this.planStore.addWaste(data);

		api.post<OperationData, OperationData>('/api/operations', data)
			.then(createdOperation => {
				runInAction(() => {
					this.sourceAllOperations = this.sourceAllOperations.map(operation => {
						if (operation._id === tempId) {
							return createdOperation;
						}

						return operation;
					});
				});
			})
			.catch(() => {
				this.sourceAllOperations = this.sourceAllOperations.filter(operation => operation._id !== tempId);

				this.planStore.removeWaste(data);
			});
	}
}

export const operationsStore = new OperationsStore(userStore, plansStore);
