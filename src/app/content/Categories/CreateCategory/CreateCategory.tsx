import { yupResolver } from '@hookform/resolvers/yup';
import { observer } from 'mobx-react-lite';
import { object, string } from 'yup';
import { CreateCategoryData } from './CreateCategory.models';
import { useForm } from 'react-hook-form';
import { categoriesStore } from '../../../../store/categories/categories';
import { action } from 'mobx';
import { categoriesRouter } from 'src/store/categories/categories-router';

export const schema = object<CreateCategoryData>({
	name: string().default('')
}).required();

export const CreateCategory = observer(() => {
	const { handleSubmit, register } = useForm<CreateCategoryData>({
		resolver: yupResolver(schema),
		defaultValues: schema.getDefault()
	});

	const onSubmit = (data: CreateCategoryData): void => {
		categoriesStore.create(data);
		// toMainHandler();
	};

	const toMainHandler = action(() => {
		categoriesRouter.navigate('main');
	});

	return (
		<div>
			<h4>Создание категории</h4>
			<button onClick={toMainHandler}>back</button>
			<form onSubmit={handleSubmit(onSubmit)}>
				<input {...register('name')} />
				<button>создать</button>
			</form>
		</div>
	);
});
