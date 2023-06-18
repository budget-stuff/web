import { DeviceTypes } from './adaptivity';

export const CLIENT_STRINGS: ClientStringData[] = [
	{ target: 'android', userAgentRegExp: /Android/ },
	{ target: 'ios', userAgentRegExp: /(iPhone|iPod)/ }
];

interface ClientStringData {
	target: DeviceTypes;
	userAgentRegExp: RegExp;
}
