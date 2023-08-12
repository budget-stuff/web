import { CategoryData } from 'src/models/categories';

export const CATEGORY_TYPE_NAME: Record<CategoryData['type'], string> = {
	outcome: 'расход',
	income: 'доход',
	acc: 'накопительная'
};
