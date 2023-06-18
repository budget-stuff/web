import { observer } from 'mobx-react-lite';
import { categoriesStore } from 'src/store/categories/categories';

export const AllCategories = observer(() => (
	<div>
		{categoriesStore.allCategories.map(cat => (
			<div key={cat._id}>{cat.name}</div>
		))}
	</div>
));
