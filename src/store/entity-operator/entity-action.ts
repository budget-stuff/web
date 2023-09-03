import { makeAutoObservable, runInAction } from 'mobx';

export class EntityAction {
	action: () => Promise<void>;
	cancel: () => void;
	isError = false;
	isPending = false;
	id: string;

	constructor(actionFunc: () => Promise<void>, cancelFunc: () => void, removeTask: (id: string) => void) {
		this.action = this.createAction(actionFunc, removeTask);
		this.cancel = this.createCancel(cancelFunc, removeTask);
		this.id = Math.random().toString();

		makeAutoObservable(this);

		this.action();
	}

	private createAction(func: () => Promise<void>, removeTask: (id: string) => void): () => Promise<void> {
		return (): Promise<void> => {
			this.isPending = true;
			this.isError = false;

			return func()
				.then(() => {
					removeTask(this.id);
				})
				.catch(err => {
					runInAction(() => {
						this.isError = true;
					});

					throw err;
				})
				.finally(() => {
					runInAction(() => {
						this.isPending = false;
					});
				});
		};
	}

	private createCancel(func: () => void, removeTask: (id: string) => void) {
		return (): void => {
			func();
			removeTask(this.id);
		};
	}
}
