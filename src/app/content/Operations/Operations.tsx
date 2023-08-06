import { observer } from 'mobx-react-lite';
import { operationsRouter } from 'src/store/operations/operations-router';

export const Operations = observer(() => operationsRouter.currentView);
