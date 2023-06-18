import { autorun, makeAutoObservable, runInAction } from 'mobx';
import { api } from '../../utils/api/api';
import { CategoryData } from '../../models/categories';
import { UserStore, userStore } from '../user/user';
import { CreateCategoryData } from '../../app/content/Categories/CreateCategory/CreateCategory.models';

export class CategoriesStore {
	allCategories: CategoryData[] = [];

	constructor(private userStore: UserStore) {
		makeAutoObservable(this);

		autorun(() => {
			if (this.userStore.isLoggedin) {
				this.loadAll();
			}
		});
	}

	loadAll(): void {
		api.get<CategoryData[]>('/api/categories').then(categories => {
			runInAction(() => {
				this.allCategories = categories;
			});
		});
	}

	create(data: CreateCategoryData): void {
		api.post<CreateCategoryData, CategoryData>('/api/categories', data).then(createdCategory => {
			runInAction(() => {
				this.allCategories.push(createdCategory);
			});
		});
	}
}

export const categoriesStore = new CategoriesStore(userStore);
