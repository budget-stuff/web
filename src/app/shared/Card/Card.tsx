import { FC, HTMLAttributes } from 'react';
import { classNames } from 'src/utils/helpers/classnames';

import './Card.scss';

export const Card: FC<HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
	<div className={classNames('card', className)} {...props}>
		{children}
	</div>
);
