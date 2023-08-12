import { yupResolver } from '@hookform/resolvers/yup';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useFieldArray, useForm } from 'react-hook-form';
import { Icon } from 'src/app/shared/Icon/Icon';
import { CategoryTypes } from 'src/models/categories';
import { categoriesStore } from 'src/store/categories/categories';
import { categoriesRouter } from 'src/store/categories/categories-router';
import { array, object, string } from 'yup';
import { CATEGORY_TYPE_NAME } from '../consts/type-names';
import { CategoryFormData } from './CategoryForm.models';

const CATEGORY_TYPES = Object.keys(CATEGORY_TYPE_NAME) as CategoryTypes[];

export const schema = object<CategoryFormData>({
	name: string().default(''),
	type: string().oneOf(CATEGORY_TYPES).default('outcome'),
	subcategories: array().default([])
}).required();

export const CategoryForm = observer(() => {
	const { handleSubmit, register, control } = useForm<CategoryFormData>({
		resolver: yupResolver(schema),
		defaultValues: schema.getDefault()
	});

	const { fields, append } = useFieldArray({ control, name: 'subcategories' });

	const onSubmit = (data: CategoryFormData): void => {
		categoriesStore.create(data);
		backHandler();
	};

	const addSubcategory = (): void => {
		append({
			name: ''
		});
	};

	const backHandler = action(() => {
		categoriesRouter.navigate('main');
	});

	return (
		<div className="category-form">
			<h4>Создание категории</h4>
			<button onClick={backHandler}>back</button>
			<form onSubmit={handleSubmit(onSubmit)}>
				<h6>Название</h6>
				<input {...register('name')} />

				<h6>Тип</h6>
				<select {...register('type')}>
					{CATEGORY_TYPES.map(categoryType => (
						<option key={categoryType} value={categoryType}>
							{CATEGORY_TYPE_NAME[categoryType]}
						</option>
					))}
				</select>

				<div className="category-form__subcategories-header">
					<h6>Подкатегории</h6>
					<Icon name="add" onClick={addSubcategory} />
				</div>

				<div className="category-form__subcategories-container">
					{fields.map((field, index) => (
						<div key={field.id} className="category-form__subcategories-item">
							<p>имя</p>
							<input {...register(`subcategories.${index}.name`)} />
						</div>
					))}
				</div>

				<button>создать</button>
			</form>
		</div>
	);
});
