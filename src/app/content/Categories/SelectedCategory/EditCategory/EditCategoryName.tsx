import { yupResolver } from '@hookform/resolvers/yup';
import { observer } from 'mobx-react-lite';
import { FocusEvent, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { CategoryData } from 'src/models/categories';
import { categoriesStore } from 'src/store/categories/categories';
import { object, string } from 'yup';

import './EditCategoryName.scss';
import { Entity } from 'src/store/entity-operator/entity';

export const EditCategoryName = observer<EditCategoryNameProps>(({ category, onSubmit }) => {
	const submitButtonRef = useRef<HTMLButtonElement>(null);

	const schema = object<Partial<CategoryData>>({
		name: string().default(category.data.name)
	}).required();

	const { handleSubmit, register, watch } = useForm<Partial<CategoryData>>({
		resolver: yupResolver(schema),
		defaultValues: schema.getDefault()
	});

	const nameControl = register('name');

	const nameValue = watch('name');

	const onSubmitHandler = (data: Partial<CategoryData>): void => {
		categoriesStore.update({ ...data, _id: category.data._id }, category);
		onSubmit();
	};

	const onNameBlur = (event?: FocusEvent<HTMLInputElement>): void => {
		if (event) {
			nameControl.onBlur(event);
		}
		submitButtonRef.current?.click();
	};

	useEffect(() => {
		const listener = (event: KeyboardEvent): void => {
			if (event.key === 'Escape') {
				if (nameValue === category.data.name) {
					onSubmit();
				} else {
					console.log(nameValue);
					onNameBlur();
				}
			}
		};

		window.addEventListener('keyup', listener);

		return (): void => {
			window.removeEventListener('keyup', listener);
		};
	}, [nameValue, category]);

	return (
		<form className="edit-category" onSubmit={handleSubmit(onSubmitHandler)}>
			<input autoFocus type="text" {...nameControl} onBlur={onNameBlur} />
			<button className="edit-category__submit-button" ref={submitButtonRef}></button>
		</form>
	);
});

export interface EditCategoryNameProps {
	category: Entity<CategoryData>;
	onSubmit: () => void;
}
