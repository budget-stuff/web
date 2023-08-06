export class ReqSceduler {
	private taskQueue: Array<() => Promise<void>> = [];

	private pending = false;

	private createQueueTask(req: () => Promise<any>, onError?: () => void): () => Promise<void> {
		return (): Promise<void> => {
			this.pending = true;

			return req()
				.catch(err => {
					onError?.();

					throw err;
				})
				.finally(() => {
					this.pending = false;
					this.triggerQueue();
				});
		};
	}

	/**
	 * триггерит выполнение следующего задания из очереди
	 */
	private triggerQueue(): void {
		if (this.taskQueue.length > 0 && !this.pending) {
			const task = this.taskQueue.shift();
			task?.();
		}
	}

	/**
	 * Ставит переданную функцию в очередь
	 *
	 * При множественном вызове создаст очередь асинхронных функций, выполняемых по одной друг за другом
	 *
	 * @param req асинхронная функция
	 * @param onError действие в случае ошибки
	 */
	scedule(req: () => Promise<any>, onError?: () => void): void {
		const task = this.createQueueTask(req, onError);

		this.taskQueue.push(task);

		this.triggerQueue();
	}
}

export const sceduler = new ReqSceduler();
