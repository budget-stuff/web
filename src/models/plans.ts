import { UserData } from './user';

export interface PlanCategoryData {
	/**
	 * айдишник нужной категории
	 */
	category: string;
	expectedWaste: number;
}

export interface PlanData {
	month: number;
	year: number;
	categories: PlanCategoryData[];
	owner: UserData;
	_id: string;
}
