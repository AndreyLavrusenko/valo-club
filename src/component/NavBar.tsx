import "../style/components/navbar.scss";
import {NavLink} from "react-router-dom";
import {useEffect} from "react";
import {useAppSelector} from "../hook/redux";

export const NavBar = () => {
	const {isAuth} = useAppSelector(state => state.user);

	return (
		<div className="nav__footer">
			<NavLink to="/" className="nav__footer-item">Тренировка</NavLink>
			<div className="nav__footer-divider"></div>
			{
				isAuth
					? <NavLink to="/catalog" className="nav__footer-item">Создать</NavLink>
					: <NavLink to="/login" className="nav__footer-item">Логин</NavLink>
			}
			<div className="nav__footer-divider"></div>
			{
				isAuth
					? <NavLink to="/profile" className="nav__footer-item">Профиль</NavLink>
					: <NavLink to="/login" className="nav__footer-item">Логин</NavLink>
			}

		</div>
	);
};