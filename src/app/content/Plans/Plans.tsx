import { observer } from 'mobx-react-lite';
import { plansRouter } from 'src/store/plans/plans-router';

export const Plans = observer(() => plansRouter.currentView);
