import { FC, SVGProps, useEffect, useRef, useState } from 'react';
import { classNames } from 'src/utils/helpers/classnames';

import './Icon.scss';

export const Icon: FC<IconProps> = ({ name, size = 'medium', ...props }) => {
	const componentRef = useRef<FC<SVGProps<SVGSVGElement>> | null>(null);
	const [loadedIconName, setLoadedIconName] = useState<string>('');

	useEffect(() => {
		import('../../../assets/icons/' + name + '.svg').then(res => {
			componentRef.current = res.ReactComponent;
			// обновление стейта помогает триггернуть ре-рендер. Изменение рефа этого не делает
			setLoadedIconName(name);
		});
	}, [name]);

	return (
		<>
			{loadedIconName && componentRef.current ? (
				<componentRef.current className={classNames('icon', 'icon--' + size)} {...props} />
			) : (
				name
			)}
		</>
	);
};

export interface IconProps extends SVGProps<SVGSVGElement> {
	name: IconNames;
	size?: 'small' | 'medium' | 'large';
}

export type IconNames = 'remove' | 'add' | 'edit';
