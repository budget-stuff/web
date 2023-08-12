import { makeAutoObservable, runInAction } from 'mobx';

/**
 * нужна для наследования любым store-классом
 *
 * позволяет складывать асинхронные действия в очередь задач
 *
 * Задачи в очереди сразу попробуют выполниться
 * * в случае успеха задача удаляется из очереди, она завершена
 * * в случае неудачи очередь сохранит данные действия и функцию отмены. Действие можно будет повторить, либо отменить
 *
 * @example Сохранение новой сущности
 *
 * Можно сразу положить новые данные в стор и отобразить пользователю, а запрос на сервер положить в очередь
 *
 * В 99% случаев запрос пройдет успешно и задача удалиться из очереди, но если запрос к серверу упадет - можно будет:
 * - удалить данные из стора
 * - повторить запрос сколько нужно раз
 * - предложить пользователю сделать одно из этих действий
 *
 * В итоге в 99% случаев пользователь получает супер-быстрый интерфейс, а в 1% происходит понятное, а не хаос
 */
export class Sceduler {
	private taskQueueSource: ScedulerTask[] = [];

	get taskQueue(): ScedulerTask[] {
		return this.taskQueueSource;
	}

	get isError(): boolean {
		return this.taskQueueSource.some(task => task.isError);
	}

	private removeTask(id: string): void {
		this.taskQueueSource = this.taskQueueSource.filter(task => task.id !== id);
	}

	constructor() {
		makeAutoObservable(this);
	}

	/**
	 * Ставит переданную функцию в очередь
	 *
	 * @param action асинхронная функция основного действия
	 * @param cancel действие выполняемое при омене действия
	 */
	scedule(action: () => Promise<void>, cancel: () => void): void {
		const task = new ScedulerTask(action, cancel, this.removeTask.bind(this));

		this.taskQueueSource.push(task);
	}
}

class ScedulerTask {
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

			return func()
				.then(() => {
					runInAction(() => {
						this.isError = false;
					});

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
