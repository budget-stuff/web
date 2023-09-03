import { makeAutoObservable, runInAction } from 'mobx';
import { EntityAction } from './entity-action';

export class Entity<T> {
	actions: EntityAction[] = [];
	id: string;

	get state(): EntityState {
		if (!this.actions.length) {
			return EntityState.default;
		}

		if (this.actions.some(action => action.isError)) {
			return EntityState.error;
		}

		if (this.actions.some(action => action.isPending)) {
			return EntityState.loading;
		}

		return EntityState.default;
	}

	constructor(public data: T) {
		this.id = Math.random().toString();

		makeAutoObservable(this);
	}

	private removeTask(id: string): void {
		this.actions = this.actions.filter(task => task.id !== id);
	}

	/**
	 * Ставит переданную функцию в очередь, вызывать напрямую только в {@link EntityOperator}
	 *
	 * @param action асинхронная функция основного действия
	 * @param cancel действие выполняемое при омене действия
	 */
	scedule(onAction: () => Promise<void>, onCancel: () => void): void {
		const action = new EntityAction(onAction, onCancel, this.removeTask.bind(this));

		this.actions.push(action);
	}

	updateData(newData: Partial<T>): void {
		runInAction(() => {
			this.data = {
				...this.data,
				...newData
			};
		});
	}
}

export enum EntityState {
	default = 'default',
	loading = 'loading',
	error = 'error'
}
