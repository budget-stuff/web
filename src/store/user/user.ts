import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '../../utils/api/api';
import { UserData } from '../../models/user';

export class UserStore {
	user: UserData | null = null;

	get isLoggedin(): boolean {
		return Boolean(this.user);
	}

	constructor() {
		makeAutoObservable(this);

		this.loadData();
	}

	loadData(): void {
		api.get<UserData>('/api/auth/profile').then(res => {
			runInAction(() => {
				this.user = res;
			});
		});
	}

	googleAuth(): void {
		location.href = location.origin + '/api/auth';
	}
}

export const userStore = new UserStore();
