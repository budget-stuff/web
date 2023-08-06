import { ReactElement } from 'react';

export interface MyRouter<T> {
	currentView: ReactElement;
	currentRoute: T;
	navigate: (route: T) => void;
}
