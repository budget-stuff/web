import { observer } from 'mobx-react-lite';
import { categoriesRouter } from '../../../store/categories/categories-router';

export const Categories = observer(() => categoriesRouter.currentView);
