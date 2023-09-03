import { autorun, makeAutoObservable, runInAction } from 'mobx';
import { CategoryData } from '../../models/categories';
import { api } from '../../utils/api/api';
import { UserStore, userStore } from '../user/user';
import { EntityOperator } from '../entity-operator/entity-operator';
import { Entity } from '../entity-operator/entity';

export class CategoriesStore {
	private baseUrl = '/api/categories';

	private operator = new EntityOperator<CategoryData>();
	/**
	 * категории в виде плоского списка - в таком виде они храняться на сервере, источник правды для остальных
	 */
	get allCategories(): Array<Entity<CategoryData>> {
		return this.operator.items;
	}

	private selectedCategoryId: string | null = null;

	get rootCategories(): Array<Entity<CategoryData>> {
		return this.allCategories.filter(pureCat => !pureCat.data.parentId);
	}

	get selectedCategory(): Entity<CategoryData> | undefined {
		return this.rootCategories.find(cat => cat.data._id === this.selectedCategoryId);
	}

	constructor(private userStore: UserStore) {
		makeAutoObservable(this);

		autorun(() => {
			if (this.userStore.isLoggedin) {
				this.loadAll();
			}
		});
	}

	private loadAll(): void {
		api.get<CategoryData[]>(this.baseUrl).then(categories => {
			runInAction(() => {
				this.operator.init(categories);
			});
		});
	}

	getSubcatsFor(_id: string): Array<Entity<CategoryData>> {
		return this.allCategories.filter(category => category.data.parentId === _id);
	}

	setSelected(data: CategoryData): void {
		if (!data.parentId) {
			this.selectedCategoryId = data._id;
		} else {
			throw new Error(
				'[CategoriesStore] можно выбрать только рутовую категорию (у категории не должно быть поля parendId)'
			);
		}
	}

	clearSelected(): void {
		this.selectedCategoryId = null;
	}

	getById(id: string): Entity<CategoryData> | undefined {
		return this.allCategories.find(category => category.data._id === id);
	}

	create(data: CategoryData): void {
		const request = (): Promise<CategoryData> => api.post<CategoryData, CategoryData>(this.baseUrl, data);

		this.operator.createEntity(data, request);
	}

	update(data: Partial<CategoryData> & { _id: string }, item: Entity<CategoryData>): void {
		const request = (): Promise<CategoryData> =>
			api.put<Partial<CategoryData> & { _id: string }, CategoryData>(this.baseUrl + '/' + data._id, data);

		this.operator.updateEntity(data, item, request);
	}

	remove(item: Entity<CategoryData>): void {
		const subcategories = this.allCategories.filter(category => category.data.parentId === item.data._id);

		const request = (id: string) => (): Promise<never> => api.delete(this.baseUrl + '/' + id);

		this.operator.removeEntity(item, request(item.data._id));

		subcategories.forEach(subItem => {
			this.operator.removeEntity(subItem, request(subItem.data._id));
		});
	}
}

export const categoriesStore = new CategoriesStore(userStore);
