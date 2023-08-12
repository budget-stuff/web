import { UserData } from './user';

export type CategoryTypes = 'income' | 'outcome' | 'acc';
export type CategoryStatuses = 'active' | 'archive';

export interface CategoryData {
	name: string;
	_id: string;
	type: CategoryTypes;
	status: CategoryStatuses;
	owner: UserData;
	parentId?: string | null;
}

export interface RootCategoryData extends CategoryData {
	parentId: null;
	subcategories: CategoryData[];
}
