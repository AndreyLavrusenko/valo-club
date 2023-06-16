import React, {ChangeEvent, useState} from "react";
import jwtDecode from "jwt-decode";
import {NavLink, useNavigate} from "react-router-dom";
import {authAPI} from "../api/api";

import "../style/layout/login.scss";
import {useAppDispatch} from "../hook/redux";
import {loginSuccess} from "../redux/reducer/userSlice";


export const LoginTrainer = () => {
    const dispatch = useAppDispatch()

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const trainerLogin = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();

        try {
            const res = await authAPI.trainerAuth(login, password);
            if (res.resultCode === 0) {
                setError("");
                if (res.token) {
                    dispatch(loginSuccess())
                    window.localStorage.setItem("token", res.token);
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
                <h2 className="login__title">Вход в аккаунт</h2>
                <form className="login__container">
                    <input
                        type="text"
                        value={login}
                        onChange={e => setLogin(e.target.value)}
                        className="login__input"
                        required
                        placeholder="Логин для входа"
                    />
                    <input
                        type="text"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="login__input"
                        required
                        placeholder="Пароль для входа"
                    />
                    <button className="login__button" onClick={trainerLogin}>Вход</button>
                    <NavLink to={"/registration"}>Еще нет акканута?</NavLink>
                </form>
                {error
                    ? <p className="error u-margin-top-l">{error}</p>
                    : null
                }
            </div>
        </>
    );
};