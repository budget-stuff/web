import { observer } from 'mobx-react-lite';
import { categoriesStore } from 'src/store/categories/categories';

export const CategoriesErrorTaskQueue = observer(() => (
	<>
		{categoriesStore.sceduler.isError && (
			<div style={{ display: 'flex', gap: '12px' }}>
				{categoriesStore.sceduler.taskQueue
					.filter(task => task.isError)
					.map(task => (
						<div
							onClick={task.cancel}
							key={task.id}
							style={{ width: '50px', height: '50px', backgroundColor: 'green' }}
						></div>
					))}
			</div>
		)}
	</>
));
