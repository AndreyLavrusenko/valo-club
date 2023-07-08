import React, {ChangeEvent, useState} from "react";
import jwtDecode from "jwt-decode";
import {NavLink, useNavigate} from "react-router-dom";
import {authAPI} from "../api/api";

import "../style/layout/login.scss";
import {useAppDispatch} from "../hook/redux";
import {loginSuccess} from "../redux/reducer/userSlice";
import {Popover} from "../ui/Popover";


export const LoginTrainer = () => {
    const dispatch = useAppDispatch();

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [changePasswordPopover, setChangePasswordPopover] = useState(false);

    const [loginChanged, setLoginChanged] = useState("");
    const [passwordChanged, setPasswordChanged] = useState("");

    const [passwordIsChanged, setPasswordIsChanged] = useState(false);
    const [passwordIsChangedError, setPasswordIsChangedError] = useState("");

    const navigate = useNavigate();

    const trainerLogin = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();

        try {
            const res = await authAPI.login(login, password);
            if (res.resultCode === 0) {
                setError("");
                if (res.token) {
                    dispatch(loginSuccess(res.token));
                    window.localStorage.setItem("token", res.token);
                    window.localStorage.setItem("5593f802", res.isAdmin);
                    navigate("/catalog");
                    window.location.reload();
                }
            } else {
                setError(res.message);
            }
        } catch (err) {
        }
    };

    const changePassword = async () => {
        const res = await authAPI.changePasswordUsingLogin(loginChanged, passwordChanged);

        if  (res) {
            if (res.resultCode === 0) {
                setPasswordIsChanged(true)
                setChangePasswordPopover(false)
            } else {
                setPasswordIsChangedError("Не удалось изменить пароль")
            }
        } else {
            setPasswordIsChangedError("Что-то пошло не так")
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
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="login__input"
                        required
                        placeholder="Пароль для входа"
                    />
                    <button className="login__button" onClick={trainerLogin}>Вход</button>
                    <NavLink to={"/registration"}>Еще нет аккаунта?</NavLink>
                    <NavLink onClick={() => setChangePasswordPopover(true)} to={"/login"}>Забыли пароль?</NavLink>
                </form>
                {error
                    ? <p className="error u-margin-top-l">{error}</p>
                    : null
                }
            </div>

            <Popover active={changePasswordPopover} setActive={setChangePasswordPopover}>
                <div className="profile__popover">
                    <h2 className="popover__title popover__title--find">Смена пароля</h2>
                    <p className="popover__subtitle">Введите свой логин и новый пароль</p>
                    <input
                        type="text"
                        className="popover__input"
                        placeholder={"Ваш логин"}
                        value={loginChanged}
                        onChange={e => setLoginChanged(e.target.value)}
                    />
                    <input
                        type="password"
                        className="popover__input"
                        placeholder={"Новый пароль"}
                        value={passwordChanged}
                        onChange={e => setPasswordChanged(e.target.value)}
                    />
                    <button className="popover__button popover__button--find" onClick={changePassword}>Изменить</button>
                    {passwordIsChangedError
                        ? <p className="error u-margin-top-l">{passwordIsChangedError}</p>
                        : null
                    }
                </div>
            </Popover>
        </>
    );
};