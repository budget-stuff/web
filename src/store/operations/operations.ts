import { autorun, makeAutoObservable, runInAction } from 'mobx';
import { api } from '../../utils/api/api';
import { UserStore, userStore } from '../user/user';
import { OperationData } from 'src/models/operations';
import { EntityOperator } from '../entity-operator/entity-operator';
import { Entity } from '../entity-operator/entity';

export class OperationsStore {
	private operator = new EntityOperator<OperationData>();

	get allOperations(): Array<Entity<OperationData>> {
		return this.operator.items;
	}

	constructor(private userStore: UserStore) {
		makeAutoObservable(this);

		autorun(() => {
			if (this.userStore.isLoggedin) {
				this.loadAll();
			}
		});
	}

	getById(id: string): Entity<OperationData> | undefined {
		return this.operator.items.find(operation => operation.id === id);
	}

	loadAll(): void {
		api.get<OperationData[]>('/api/operations').then(operations => {
			runInAction(() => {
				this.operator.init(operations);
			});
		});
	}

	create(data: OperationData): void {
		const request = (): Promise<OperationData> => api.post<OperationData, OperationData>('/api/operations', data);

		this.operator.createEntity(data, request);
	}
}

export const operationsStore = new OperationsStore(userStore);
