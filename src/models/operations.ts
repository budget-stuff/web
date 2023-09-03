import { UserData } from './user';

export interface OperationData {
	comment?: string;
	type: 'income' | 'outcome';
	amount: number;
	timestamp: number;
	month: number;
	year: number;
	owner: UserData;
	/**
	 * хранит айдишник категории к которой относится операция
	 */
	category: string;
	_id: string;
}

export interface OperationForm extends Omit<OperationData, '_id' | 'category' | 'owner' | 'date'> {
	category: string;
	date: Date;
}
