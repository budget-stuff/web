import { yupResolver } from '@hookform/resolvers/yup';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { ChangeEvent } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { categoriesStore } from 'src/store/categories/categories';
import { plansRouter } from 'src/store/plans/plans-router';
import { array, number, object } from 'yup';
import { PlansCreateData } from './PlansCreate.models';
import { CategoryData } from 'src/models/categories';
import { plansStore } from 'src/store/plans/plans';
import { MONTH_FULL_NAMES } from '../consts/month-full-names';

import './PlansCreate.scss';
import { PlanCategoryData } from 'src/models/plans';

const today = new Date();
const currYear = today.getFullYear();

export const schema = object<PlansCreateData>({
	month: number().min(1).max(12),
	year: number()
		.min(currYear)
		.max(currYear + 2)
		.default(currYear),
	categories: array().default([])
}).required();

export const PlansCreate = observer(() => {
	const { handleSubmit, register, control, getValues } = useForm<PlansCreateData>({
		resolver: yupResolver(schema),
		defaultValues: schema.getDefault()
	});

	const { fields, append } = useFieldArray({ control, name: 'categories' });

	const selectedCategories = getValues('categories');
	const selectedYear = getValues('year');

	const availableCategories = categoriesStore.allCategories.filter(
		category => !selectedCategories.find(selectedCategory => selectedCategory.category === category._id)
	);

	const onSubmit = (data: PlansCreateData): void => {
		// в форме собираем только айдишники категорий (так их просит бек)
		// мапим их на данные категорий для создания плана
		const mappedCategories: PlanCategoryData[] = data.categories.map(formCategory => ({
			...formCategory,
			category: categoriesStore.getById(formCategory.category) as CategoryData,
			realWaste: 0
		}));

		plansStore.create(data, mappedCategories);
		// toMainHandler();
		console.log(data);
	};

	const categorySelectHandler = (evt: ChangeEvent<HTMLSelectElement>): void => {
		const categoryId = evt.target.value;

		append({
			category: categoryId,
			expectedWaste: 0
		});
	};

	const toAllHandler = action(() => {
		plansRouter.navigate('all');
	});

	const monthOptionElements = MONTH_FULL_NAMES.map((monthName, index) => {
		// планы все планы за выбранный год
		const selectedYearPlans = plansStore.allPlans.filter(plan => plan.year === selectedYear);

		// в выбранном году ищем план на текущий месяц, если план уже создан - пользователь не может сделать это снова
		const planAlreadyCreated = Boolean(selectedYearPlans.find(plan => plan.month === index));

		return (
			<option key={monthName} value={index} disabled={planAlreadyCreated}>
				{monthName}
			</option>
		);
	});

	return (
		<div>
			<h4>Создание плана</h4>
			<button onClick={toAllHandler}>back</button>
			<form onSubmit={handleSubmit(onSubmit)} className="create-plan-form">
				<div>
					план на&#8194;
					<select {...register('month')}>
						<option value="">-</option>
						{monthOptionElements}
					</select>
					&#8194;
					<select {...register('year')}>
						<option value={currYear}>{currYear}</option>
						<option value={currYear + 1}>{currYear + 1}</option>
						<option value={currYear + 2}>{currYear + 2}</option>
					</select>
					&#8194;года
				</div>
				Категории
				<div className="create-plan-form__categories">
					{fields.map((field, index) => {
						const category = categoriesStore.getById(field.category) as CategoryData;

						return (
							<div key={field.id} className="create-plan-form__categories-item">
								<div>{category.name}</div>
								Ожидаемые траты
								<input {...register(`categories.${index}.expectedWaste`)} />
							</div>
						);
					})}
					<div className="create-plan-form__categories-item">
						добавить
						<select onChange={categorySelectHandler}>
							<option value="">-</option>
							{availableCategories.map(category => (
								<option key={category._id} value={category._id}>
									{category.name}
								</option>
							))}
						</select>
					</div>
				</div>
				<button>создать</button>
			</form>
		</div>
	);
});
