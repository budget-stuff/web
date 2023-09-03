import { yupResolver } from '@hookform/resolvers/yup';
import { observer } from 'mobx-react-lite';
import { ChangeEvent, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { CategoryData } from 'src/models/categories';
import { categoriesStore } from 'src/store/categories/categories';
import { number, object, string } from 'yup';

import './EditPlanCategory.scss';
import { Entity } from 'src/store/entity-operator/entity';
import { PlanCategoryData } from 'src/models/plans';
import { plansStore } from 'src/store/plans/plans';

export const EditPlanCategory = observer<EditPlanCategoryProps>(({ planCategory, onSubmit, fieldToEdit }) => {
	const submitButtonRef = useRef<HTMLButtonElement>(null);

	const category = categoriesStore.getById(planCategory.category) as Entity<CategoryData>;

	const schema = object<PlanCategoryData>({
		category: string().default(planCategory.category),
		expectedWaste: number().default(planCategory.expectedWaste)
	}).required();

	const { handleSubmit, register, watch } = useForm<PlanCategoryData>({
		resolver: yupResolver(schema),
		defaultValues: schema.getDefault()
	});

	const categoryControl = register('category');
	const categoryValue = watch('category');

	const expectedWasteControl = register('expectedWaste');
	const expectedWasteValue = watch('expectedWaste');

	const onSubmitHandler = (data: PlanCategoryData): void => {
		if (plansStore.selectedPlan) {
			const categories = plansStore.selectedPlan.data.categories.map(cat => {
				if (cat.category === planCategory.category) {
					return {
						...cat,
						...data
					};
				}

				return cat;
			});

			plansStore.update({ ...plansStore.selectedPlan.data, categories }, plansStore.selectedPlan);
		}

		onSubmit();
	};

	const onBlur = (): void => {
		submitButtonRef.current?.click();
	};

	const onSelectChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
		categoryControl.onChange(evt);

		onBlur();
	};

	const availableCategories = categoriesStore.allCategories.filter(
		cat =>
			cat.data._id === planCategory.category ||
			!plansStore.selectedPlan?.data.categories.find(
				selectedCategory => selectedCategory.category === cat.data._id
			)
	);

	useEffect(() => {
		const listener = (event: KeyboardEvent): void => {
			if (event.key === 'Escape') {
				if (expectedWasteValue === planCategory.expectedWaste && categoryValue === planCategory.category) {
					onSubmit();
				} else {
					onBlur();
				}
			}
		};

		window.addEventListener('keyup', listener);

		return (): void => {
			window.removeEventListener('keyup', listener);
		};
	}, [expectedWasteValue, categoryValue, planCategory]);

	if (!category) {
		return <span>не нашли категорию</span>;
	}

	const categoryControlTemplate = (
		<select {...categoryControl} onBlur={onBlur} onChange={onSelectChange}>
			{availableCategories.map(category => (
				<option key={category.id} value={category.data._id}>
					{category.data.name}
				</option>
			))}
		</select>
	);

	const expectedWasteControlTemplate = <input autoFocus type="number" {...expectedWasteControl} onBlur={onBlur} />;

	const displayControl = useMemo(() => {
		if (fieldToEdit === 'category') {
			return categoryControlTemplate;
		}

		return expectedWasteControlTemplate;
	}, [fieldToEdit]);

	return (
		<form className="edit-category" onSubmit={handleSubmit(onSubmitHandler)}>
			{displayControl}
			<button className="edit-category__submit-button" ref={submitButtonRef}></button>
		</form>
	);
});

export interface EditPlanCategoryProps {
	planCategory: PlanCategoryData;
	fieldToEdit: 'category' | 'expectedWaste';
	onSubmit: () => void;
}
