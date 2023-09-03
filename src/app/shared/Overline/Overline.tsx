import { FC, ReactNode } from 'react';

import './Overline.scss';

export const Overline: FC<OverlineProps> = ({ title, children }) => (
	<div className="overline">
		<span className="overline__title">{title}</span>
		<span className="overline__text">{children}</span>
	</div>
);

export interface OverlineProps {
	title: string;
	children: ReactNode;
}
