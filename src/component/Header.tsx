import logo from "../assets/images/logo.svg";
import '../style/components/header.scss'
import {NavLink} from "react-router-dom";
import {useRef} from "react";

type IProps = {
	isTrainer: boolean
	setIsTrainer: Function
}

export const Header = ({isTrainer, setIsTrainer}: IProps) => {
	const ref = useRef<HTMLInputElement>(null);

	const hideBurgerHandler = () => {
		if (ref.current) {
			ref.current.checked = false
		}
	}

	const logout = () => {
		localStorage.removeItem('token')
		setIsTrainer(false)

		if (ref.current) {
			ref.current.checked = false
		}
	}

	return (
		<>
			<header className="header">
				<div className="header__content">
					<NavLink to={'/'}>
						<img src={logo} alt="Вело Клуб 47"/>
					</NavLink>
					<div className="header__burger">
						<input  ref={ref} id="toggle" type="checkbox"></input>

						<label htmlFor="toggle" className="hamburger">
							<div className="top-bun"></div>
							<div className="meat"></div>
							<div className="bottom-bun"></div>
						</label>

						<div className="nav">
							<div className="nav-wrapper">
								<nav>
									{isTrainer
										? <NavLink to={'/create-workout'} onClick={hideBurgerHandler}>Создание тренировки</NavLink>
										: null
									}
									{isTrainer
										? <NavLink to={'/'} onClick={logout}>Выйти</NavLink>
										: <NavLink to={'/login'} onClick={hideBurgerHandler}>Войти как тренер</NavLink>
									}
								</nav>
							</div>
						</div>
					</div>
				</div>
			</header>
		</>
	)
}