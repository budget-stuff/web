import { observer } from 'mobx-react-lite';
import { operationsStore } from 'src/store/operations/operations';

export const AllOperations = observer(() => (
	<div>
		{operationsStore.allOperations.map(operation => (
			<div key={operation._id}>
				<div>{operation.amount}</div>
				<div>{operation.date}</div>
			</div>
		))}

		{!operationsStore.allOperations.length && 'пока пусто'}
	</div>
));
