import { FC } from 'react';

import './Overline.scss';

export const Overline: FC<OverlineProps> = ({ title, text }) => (
	<div className="overline">
		<span className="overline__title">{title}</span>
		<span className="overline__text">{text}</span>
	</div>
);

export interface OverlineProps {
	title: string;
	text: string;
}
