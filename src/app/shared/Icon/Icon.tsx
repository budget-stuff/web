import { FC, SVGProps, useEffect, useRef, useState } from 'react';
import { classNames } from 'src/utils/helpers/classnames';

import './Icon.scss';

const icons = import.meta.glob('../../../assets/icons/*.svg');

export const Icon: FC<IconProps> = ({ name, size = 'medium', ...props }) => {
	const componentRef = useRef<FC<SVGProps<SVGSVGElement>> | null>(null);
	const [loadedIconName, setLoadedIconName] = useState<string>('');

	useEffect(() => {
		// new URL('../../../assets/icons/' + name + '.svg', import.meta.url).href
		const iconPath = Object.keys(icons).find(path => path.endsWith(name + '.svg'));

		if (iconPath) {
			icons[iconPath]().then((res: any) => {
				componentRef.current = res.ReactComponent;
				// обновление стейта помогает триггернуть ре-рендер. Изменение рефа этого не делает
				setLoadedIconName(name);
			});
		}
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
