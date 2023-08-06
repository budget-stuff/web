import { CategoryData } from './categories';
import { UserData } from './user';

export interface OperationData {
	comment?: string;
	type: 'income' | 'outcome';
	amount: number;
	date: string;
	owner: UserData;
	category: CategoryData;
	_id: string;
}

export interface OperationForm extends Omit<OperationData, '_id' | 'category' | 'owner' | 'date'> {
	category: string;
	date: Date;
}
