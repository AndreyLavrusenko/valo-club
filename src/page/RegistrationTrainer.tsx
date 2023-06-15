import {NavLink, useNavigate} from "react-router-dom";
import React, {useState} from "react";

import '../style/layout/login.scss'
import {authAPI} from "../api/api";
import jwtDecode from "jwt-decode";

type IProps = {
	setIsTrainer: Function
}


export const RegistrationTrainer = ({setIsTrainer}: IProps) => {
	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const navigate = useNavigate();

	const trainerReg= async (event: React.FormEvent<HTMLButtonElement>) => {
		event.preventDefault();

		try {
			const res = await authAPI.trainerAuth(login);
			if (res.resultCode === 0) {
				setError("");
				if ((jwtDecode(res.token) as any).isTrainer) {
					window.localStorage.setItem("token", res.token);
					setIsTrainer(true);
					navigate("/");
				}
			} else {
				setError(res.message);
			}
		} catch (err) {
		}
	};

	return (
		<>
			<div className="login">
				<h2 className="login__title">Создание аккаунта</h2>
				<form className="login__container">
					<input
						type="text"
						value={login}
						onChange={e => setLogin(e.target.value)}
						className="login__input"
						required
						placeholder="Придумайте логин"
					/>
					<input
						type="text"
						value={password}
						onChange={e => setPassword(e.target.value)}
						className="login__input"
						required
						placeholder="Придумайте пароль"
					/>
					<button className="login__button" onClick={trainerReg}>Создать аккаунт</button>
					<NavLink to={"/login"}>Уже есть аккаунт?</NavLink>
				</form>
				{error
					? <p className="error u-margin-top-l">{error}</p>
					: null
				}
			</div>
		</>
	)
}