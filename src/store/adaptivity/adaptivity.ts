import { makeAutoObservable, runInAction } from 'mobx';
import { CLIENT_STRINGS } from './adaptivityConsts';

class Adaptivity {
	currentDeviceType: DeviceTypes = 'otherDesktop';

	screenBreakpoint: ScreenBreakpoints = 'mobile';

	constructor() {
		makeAutoObservable(this);

		this.setCurrentDeviceType();

		this.setScreenBreakpointListener();
	}

	private setCurrentDeviceType(): void {
		const userAgent = navigator.userAgent;

		this.currentDeviceType = CLIENT_STRINGS.reduce((res: DeviceTypes, item) => {
			if (item.userAgentRegExp.test(userAgent)) {
				return item.target;
			}

			return res;
		}, 'otherDesktop');
	}

	private setScreenBreakpointListener(): void {
		if (this.currentDeviceType === 'android' || this.currentDeviceType === 'ios') {
			this.screenBreakpoint = 'mobile';
		} else {
			const resizer = new ResizeObserver(entries => {
				entries.forEach(entry => {
					const currWinWidth = entry.contentRect.width;

					runInAction(() => {
						this.screenBreakpoint = currWinWidth > 1399 ? 'desktop' : 'tablet';
					});
				});
			});
			resizer.observe(document.body);
		}
	}
}

export type DeviceTypes = 'ios' | 'android' | 'mac' | 'otherDesktop';
export type ScreenBreakpoints = 'mobile' | 'tablet' | 'desktop';

export const adaptivityStore = new Adaptivity();
