import { observer } from 'mobx-react-lite';
import { operationsRouter } from 'src/store/operations/operations-router';
import { AllOperations } from './AllOperations/AllOperations';
import { action } from 'mobx';

import './OperationsMain.scss';

export const OperationsMain = observer(() => {
	const toAdd = action((): void => {
		operationsRouter.navigate('add');
	});

	return (
		<div className="operations-main">
			<h4>Все операции</h4>
			<button onClick={toAdd}>add</button>
			<AllOperations />
		</div>
	);
});
