import React, {ChangeEvent, useState} from "react";
import jwtDecode from "jwt-decode";
import {useNavigate} from "react-router-dom";
import {authAPI} from "../api/api";

import '../style/layout/login.scss'

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
                <h2 className="login__title">Вход для тренера</h2>
                <form className="login__container">
                    <input
                        type="number"
                        value={login}
                        pattern="[0-9]*"
                        onChange={onChange}
                        className="login__input"
                        required
                        placeholder="Логин для входа"
                    />
                    <button className="login__button" onClick={trainerLogin}>Вход</button>
                </form>
                {error
                    ? <p className="error u-margin-top-l">{error}</p>
                    : null
                }
            </div>
        </>
    );
};