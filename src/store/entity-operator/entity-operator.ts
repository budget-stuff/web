import { makeAutoObservable, runInAction } from 'mobx';
import { Entity } from './entity';

export class EntityOperator<T> {
	items: Array<Entity<T>> = [];

	constructor() {
		makeAutoObservable(this);
	}

	private addLocally(data: Entity<T>): void {
		runInAction(() => {
			this.items.push(data);
		});
	}

	private removeLocally(id: string): void {
		runInAction(() => {
			this.items = this.items.filter(item => item.id !== id);
		});
	}

	createEntity(data: T, request: () => Promise<T>): void {
		const item = new Entity(data);

		this.addLocally(item);

		const action = (): Promise<void> =>
			request().then(createdData => {
				runInAction(() => {
					item.updateData(createdData);
				});
			});

		const cancel = (): void => {
			this.removeLocally(item.id);
		};

		item.scedule(action, cancel);
	}

	updateEntity(data: Partial<T>, item: Entity<T>, request: () => Promise<T>): void {
		const prevData = {
			...item.data
		};

		runInAction(() => {
			item.updateData(data);
		});

		const action = (): Promise<void> =>
			request().then(updatedData => {
				runInAction(() => {
					item.updateData(updatedData);
				});
			});

		const cancel = (): void => {
			runInAction(() => {
				item.updateData(prevData);
			});
		};

		item.scedule(action, cancel);
	}

	removeEntity(item: Entity<T>, request: () => Promise<never>): void {
		this.removeLocally(item.id);

		const action = (): Promise<void> => request();

		const cancel = (): void => {
			this.addLocally(item);
		};

		item.scedule(action, cancel);
	}

	init(initialData: T[]): void {
		if (!this.items.length) {
			initialData.forEach(item => {
				const entity = new Entity(item);

				this.addLocally(entity);
			});
		}
	}
}
