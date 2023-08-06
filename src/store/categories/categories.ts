import { autorun, makeAutoObservable, runInAction } from 'mobx';
import { CreateCategoryData } from '../../app/content/Categories/CreateCategory/CreateCategory.models';
import { CategoryData } from '../../models/categories';
import { api } from '../../utils/api/api';
import { UserStore, userStore } from '../user/user';

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

	getById(id: string): CategoryData | undefined {
		return this.allCategories.find(category => category._id === id);
	}

	loadAll(): void {
		api.get<CategoryData[]>('/api/categories').then(categories => {
			runInAction(() => {
				this.allCategories = categories;
			});
		});
	}

	create(data: CreateCategoryData): void {
		// временный айди, нужен чтобы после обработки запроса проще было заменить сущность на ту что пришла с БЕ
		const tempId = Math.random().toString();

		this.allCategories.push({
			...data,
			_id: tempId,
			type: 'outcome',
			status: 'active',
			owner: {
				email: '',
				_id: ''
			}
		});

		api.post<CreateCategoryData, CategoryData>('/api/categories', data)
			.then(createdCategory => {
				runInAction(() => {
					this.allCategories = this.allCategories.map(category => {
						if (category._id === tempId) {
							return createdCategory;
						}

						return category;
					});
				});
			})
			.catch(() => {
				this.allCategories = this.allCategories.filter(cat => cat._id !== tempId);
			});
	}
}

export const categoriesStore = new CategoriesStore(userStore);
