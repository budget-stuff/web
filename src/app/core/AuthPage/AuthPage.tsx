import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { userStore } from '../../../store/user/user';

import './AuthPage.scss';

export const AuthPage = observer(() => {
	const navigate = useNavigate();

	const isLoggedin = useMemo(() => userStore.isLoggedin, [userStore.isLoggedin]);

	useEffect(() => {
		if (isLoggedin) {
			navigate('/');
		}
	}, [isLoggedin]);

	return (
		<div className="auth-page">
			чот ты не авторизованный какой-то
			<button onClick={(): void => userStore.googleAuth()}>google</button>
		</div>
	);
});
