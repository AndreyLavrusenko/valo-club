import '../style/components/navbar.scss'
import {NavLink} from "react-router-dom";

export const NavBar = () => {
	return (
		<div className="nav__footer">
			<NavLink to="/" className="nav__footer-item">Тренировка</NavLink>
			<div className="nav__footer-divider"></div>
			<div className="nav__footer-item">Создать</div>
			<div className="nav__footer-divider"></div>
			<NavLink to="/login" className="nav__footer-item">Логин</NavLink>
		</div>
	)
}