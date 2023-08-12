import { CategoryData, CategoryTypes } from '../../../../models/categories';

export interface CategoryFormData extends Partial<CategoryData> {
	name: string;
	type: CategoryTypes;
	subcategories: SubcategoryData[];
}

export interface SubcategoryData extends Partial<CategoryData> {
	name: string;
}
