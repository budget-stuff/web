import { yupResolver } from '@hookform/resolvers/yup';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { CategoryData } from 'src/models/categories';
import { OperationForm } from 'src/models/operations';
import { UserData } from 'src/models/user';
import { categoriesStore } from 'src/store/categories/categories';
import { operationsStore } from 'src/store/operations/operations';
import { operationsRouter } from 'src/store/operations/operations-router';
import { userStore } from 'src/store/user/user';
import { date, number, object, string } from 'yup';

export const AddOperation = observer(() => {
	const allCategoriesIds = categoriesStore.allCategories.map(cat => cat._id);

	const schema = object<OperationForm>({
		comment: string().default(''),
		type: string().oneOf(['income', 'outcome']).default('outcome'),
		amount: number().default(0),
		date: date().default(new Date()),
		category: string().oneOf(allCategoriesIds)
	}).required();

	const {
		handleSubmit,
		register,
		formState: { errors }
	} = useForm<OperationForm>({
		resolver: yupResolver(schema),
		defaultValues: schema.getDefault()
	});

	const onSubmit = (data: OperationForm): void => {
		console.log(data);
		operationsStore.create({
			...data,
			category: categoriesStore.getById(data.category) as CategoryData,
			owner: userStore.user as UserData,
			date: data.date.toISOString(),
			_id: null as unknown as string
		});
		// toMainHandler();
	};

	const toMain = action(() => {
		operationsRouter.navigate('main');
	});

	return (
		<div>
			<h4>Создание операции</h4>
			<button onClick={toMain}>back</button>

			<form onSubmit={handleSubmit(onSubmit)}>
				<select {...register('type')}>
					<option value="income">доход</option>
					<option value="outcome">расход</option>
				</select>

				<input type="date" {...register('date')} />

				<select {...register('category')}>
					{categoriesStore.allCategories.map(category => (
						<option key={category._id} value={category._id}>
							{category.name}
						</option>
					))}
				</select>

				<input type="number" {...register('amount')} />

				<input {...register('comment')} />

				<button>save</button>

				{Object.values(errors).map(err => (
					<div>{err.message}</div>
				))}
			</form>
		</div>
	);
});
