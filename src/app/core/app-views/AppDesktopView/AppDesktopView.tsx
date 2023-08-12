import { observer } from 'mobx-react-lite';
import { Categories } from '../../../content/Categories/Categories';

import { Operations } from 'src/app/content/Operations/Operations';
import { Plans } from 'src/app/content/Plans/Plans';
import './AppDesktopView.scss';

export const AppDesktopView = observer(() => (
	<div className="desktop-root">
		<div className="desktop-root__card">
			<Categories />
		</div>
		<div className="desktop-root__card">
			<Plans />
		</div>
		<div className="desktop-root__card">
			<Operations />
		</div>
	</div>
));
