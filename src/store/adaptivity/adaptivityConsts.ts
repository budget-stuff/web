import { DeviceTypes } from './adaptivity';

export const CLIENT_STRINGS: ClientStringData[] = [
	{ target: 'android', userAgentRegExp: /Android/ },
	{ target: 'ios', userAgentRegExp: /(iPhone|iPod)/ },
	{ target: 'mac', userAgentRegExp: /Mac OS X/ },
	{ target: 'mac', userAgentRegExp: /(Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ }
];

interface ClientStringData {
	target: DeviceTypes;
	userAgentRegExp: RegExp;
}
