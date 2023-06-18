import { FC, HTMLAttributes } from 'react';
import { NavLink } from 'react-router-dom';

import './MobileNav.scss';
import { classNames } from 'src/utils/helpers/classnames';

export const MobileNav: FC<HTMLAttributes<HTMLElement>> = ({ className }) => (
	<nav className={classNames('mobile-nav', className)}>
		<NavLink className="mobile-nav__item" to="/categories">
			categories
		</NavLink>

		<NavLink to="/operations" className="mobile-nav__item">
			operations
		</NavLink>

		<NavLink className="mobile-nav__item" to="/plans">
			plans
		</NavLink>
	</nav>
);
