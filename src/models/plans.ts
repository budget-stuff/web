import { CategoryData } from './categories';
import { UserData } from './user';

export interface PlanCategoryData {
	category: CategoryData;
	expectedWaste: number;
	realWaste: number;
}

export interface PlanData {
	month: number;
	year: number;
	categories: PlanCategoryData[];
	owner: UserData;
	_id: string;
}
