import {NavLink, useNavigate} from "react-router-dom";
import React, {useState} from "react";

import '../style/layout/login.scss'
import {authAPI} from "../api/api";
import jwtDecode from "jwt-decode";
import {loginSuccess} from "../redux/reducer/userSlice";
import {useAppDispatch} from "../hook/redux";


export const RegistrationTrainer = () => {
	const dispatch = useAppDispatch()

	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const navigate = useNavigate();

	const trainerReg= async (event: React.FormEvent<HTMLButtonElement>) => {
		event.preventDefault();

		try {
			const res = await authAPI.register(login, password);
			if (res.resultCode === 0) {
				setError("");
				if (res.token) {
					dispatch(loginSuccess(res.token))
					window.localStorage.setItem("token", res.token);
					navigate("/");
					window.location.reload()
				}
			} else {
				setError(res.message);
			}
		} catch (err) {
			console.log(err)
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
						type="password"
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