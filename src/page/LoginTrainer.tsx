import React, {ChangeEvent, useState} from "react";
import jwtDecode from "jwt-decode";
import {useNavigate} from "react-router-dom";
import {authAPI} from "../api/api";

type IProps = {
	setIsTrainer: Function
}

export const LoginTrainer = ({setIsTrainer}: IProps) => {
	const [login, setLogin] = useState("");
	const [error, setError] = useState("");

	const navigate = useNavigate();

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target) {
			setLogin(e.target.value);
		}
	};

	const trainerLogin = async (event: React.FormEvent<HTMLButtonElement>) => {
		event.preventDefault();

		try {
			const res = await authAPI.trainerAuth(login);
			if (res.resultCode === 0) {
				setError("");
				if ((jwtDecode(res.token) as any).isTrainer) {
					window.localStorage.setItem("token", res.token);
					setIsTrainer(true)
					navigate("/trainer");
				}
			} else {
				setError(res.message);
			}
		} catch (err) {}
	};

	return (
		<>
			<form>
				<input type="number" value={login} onChange={onChange} required placeholder="Введите логин для входа"/>
				<button onClick={trainerLogin}>Вход</button>
				{error
					? <p>{error}</p>
					: null}
			</form>
		</>
	);
};