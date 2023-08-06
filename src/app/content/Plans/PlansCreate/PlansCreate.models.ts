import { PlanCategoryData, PlanData } from 'src/models/plans';

export interface PlansCreateData extends Omit<PlanData, 'owner' | 'categories'> {
	categories: PlanCategiryDTO[];
}

export interface PlanCategiryDTO extends Omit<PlanCategoryData, 'category' | 'realWaste'> {
	category: string;
}
