import { observer } from 'mobx-react-lite';
import { MONTH_FULL_NAMES } from 'src/app/content/Plans/consts/month-full-names';
import { Card } from 'src/app/shared/Card/Card';
import { OperationData } from 'src/models/operations';
import { Entity } from 'src/store/entity-operator/entity';
import { operationsStore } from 'src/store/operations/operations';

import './AllOperations.scss';

const sorter = (first: Entity<OperationData>, second: Entity<OperationData>): number =>
	second.data.timestamp - first.data.timestamp;

const dateFormatter = (timestamp: number): string => {
	const date = new Date(timestamp);

	const month = date.getMonth();
	const year = date.getFullYear();
	const day = date.getDay();

	return date.toDateString();

	return `${day}.${MONTH_FULL_NAMES[month]}.${year}`;
};

export const AllOperations = observer(() => {
	const sorted = operationsStore.allOperations.slice().sort(sorter);

	return (
		<div className="all-operations">
			{sorted.map(operation => (
				<Card key={operation.id}>
					<div>{operation.data.amount}</div>
					<div>{dateFormatter(operation.data.timestamp)}</div>
					<div>{operation.state}</div>
				</Card>
			))}

			{!operationsStore.allOperations.length && 'пока пусто'}
		</div>
	);
});
