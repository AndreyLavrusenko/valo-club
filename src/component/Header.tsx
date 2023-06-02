import logo from "../assets/images/logo.svg";
import '../style/components/header.scss'

export const Header = () => {
	return (
		<>
			<header className="header">
				<div className="header__content">
					<img src={logo} alt="Вело Клуб 47"/>
					<div className="header__burger">
						<input id="toggle" type="checkbox"></input>

						<label htmlFor="toggle" className="hamburger">
							<div className="top-bun"></div>
							<div className="meat"></div>
							<div className="bottom-bun"></div>
						</label>

						<div className="nav">
							<div className="nav-wrapper">
								<nav>
									<a href="#">Я тренер</a><br/>
								</nav>
							</div>
						</div>
					</div>
				</div>
			</header>
		</>
	)
}