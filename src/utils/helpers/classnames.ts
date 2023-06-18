/**
 * преобразует переданные аргументы в строку классов css
 *
 * @param args строки или массивы строк, которые необходимо преобразовать в строку
 *
 * @returns строку, содержащую переданные css классы перечисленные через пробел
 */
export const classNames = (...args: Array<string | string[] | { [key: string]: boolean } | undefined>): string => {
	const res: string[] = args.reduce<string[]>((acc: string[], item: any) => {
		const argType = typeof item;

		if (argType === 'string' || argType === 'number') {
			acc.push(item as string);
		} else if (Array.isArray(item)) {
			if (item.length) {
				const inner = classNames(...item);

				if (inner) {
					acc.push(inner);
				}
			}
		} else if (argType === 'object') {
			Object.entries(item).forEach(([key, value]) => {
				if (value) {
					acc.push(key);
				}
			});
		}

		return acc;
	}, []);

	return res.join(' ');
};
