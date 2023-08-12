import { autorun, makeAutoObservable, runInAction } from 'mobx';
import { CategoryFormData } from 'src/app/content/Categories/CategoryForm/CategoryForm.models';
import { CategoryData, RootCategoryData } from '../../models/categories';
import { api } from '../../utils/api/api';
import { Sceduler } from '../sceduler';
import { UserStore, userStore } from '../user/user';

export class CategoriesStore {
	private baseUrl = '/api/categories';
	/**
	 * категории в виде плоского списка - в таком виде они храняться на сервере, источник правды для остальных
	 */
	allCategories: CategoryData[] = [];

	private selectedCategoryId: string | null = null;

	get rootCategories(): RootCategoryData[] {
		return this.allCategories
			.filter(pureCat => !pureCat.parentId)
			.map(rootCat => ({
				...rootCat,
				parentId: null,
				subcategories: this.allCategories.filter(category => category.parentId === rootCat._id)
			}));
	}

	get selectedCategory(): RootCategoryData | undefined {
		return this.rootCategories.find(cat => cat._id === this.selectedCategoryId);
	}

	constructor(private userStore: UserStore, public sceduler: Sceduler) {
		makeAutoObservable(this);

		autorun(() => {
			if (this.userStore.isLoggedin) {
				this.loadAll();
			}
		});
	}

	private addLocally(data: CategoryData): void {
		this.allCategories.push(data);
	}

	private removeLocally(id: string): void {
		this.allCategories = this.allCategories.filter(cat => cat._id !== id);
	}

	private updateLocally(data: Partial<CategoryData>, id: string): void {
		this.allCategories = this.allCategories.map(category => {
			if (category._id === id) {
				return {
					...category,
					...data
				};
			}

			return category;
		});
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

	getById(id: string): CategoryData | undefined {
		return this.allCategories.find(category => category._id === id);
	}

	loadAll(): void {
		api.get<CategoryData[]>(this.baseUrl).then(categories => {
			runInAction(() => {
				this.allCategories = categories;
			});
		});
	}

	create(data: CategoryFormData): void {
		// временный айди, нужен чтобы после обработки запроса проще было заменить сущность на ту что пришла с БЕ
		const parentTempId = Math.random().toString();

		const { subcategories, ...parentData } = data;

		const subTempIds = subcategories.map(() => Math.random().toString());

		const enrichedSubCat: Array<Omit<CategoryData, '_id'>> = subcategories.map(cat => ({
			...cat,
			type: parentData.type,
			status: 'active',
			parentId: parentTempId,
			owner: {
				email: '',
				_id: ''
			}
		}));

		this.addLocally({
			...parentData,
			_id: parentTempId,
			status: 'active',
			owner: {
				email: '',
				_id: ''
			}
		});

		enrichedSubCat.forEach((cat, i) =>
			this.addLocally({
				...cat,
				_id: subTempIds[i]
			})
		);

		const action = (): Promise<void> =>
			api
				.post<Omit<CategoryFormData, 'subcategories'>, CategoryData>(this.baseUrl, parentData)
				.then(createdParentCategory => {
					runInAction(() => {
						this.updateLocally(createdParentCategory, parentTempId);
					});

					return Promise.all(
						enrichedSubCat.map(cat => {
							const createdCatWithCorrectParentId = {
								...cat,
								parentId: createdParentCategory._id
							};

							return api.post<Omit<CategoryFormData, 'subcategories'>, CategoryData>(
								this.baseUrl,
								createdCatWithCorrectParentId
							);
						})
					);
				})
				.then(createdSub => {
					createdSub.forEach((cat, i) => {
						runInAction(() => {
							this.updateLocally(cat, subTempIds[i]);
						});
					});
				});

		const cancel = (): void => {
			this.removeLocally(parentTempId);

			subTempIds.forEach(id => {
				this.removeLocally(id);
			});
		};

		this.sceduler.scedule(action, cancel);
	}

	update(data: Partial<CategoryData> & { _id: string }, prevData: CategoryData): void {
		this.updateLocally(data, data._id);

		const action = (): Promise<void> => api.put(this.baseUrl + '/' + data._id, data) as unknown as Promise<void>;

		const cancel = (): void => {
			this.updateLocally(prevData, prevData._id);
		};

		this.sceduler.scedule(action, cancel);
	}

	remove(id: string): void {
		// временные данные, нужны чтобы восстановить при ошибке удаления на сервере
		const tempData = this.getById(id);

		if (tempData) {
			this.removeLocally(id);

			const subcategories = this.allCategories.filter(cat => cat?.parentId === id);

			subcategories.forEach(cat => {
				this.removeLocally(cat._id);
			});

			const action = (): Promise<void> =>
				api.delete(this.baseUrl + '/' + id).then(() => {
					Promise.all(subcategories.map(cat => api.delete(this.baseUrl + '/' + cat._id)));
				});

			const cancel = (): void => {
				this.addLocally(tempData);

				subcategories.forEach(cat => {
					this.addLocally(cat);
				});
			};

			this.sceduler.scedule(action, cancel);
		} else {
			throw new Error('[CategoriesStore.remove()] не нашлось категории с переданным айди, подумой');
		}
	}
}

export const categoriesStore = new CategoriesStore(userStore, new Sceduler());
