import {useAppDispatch, useAppSelector} from "../hook/redux";
import {logoutSuccess} from "../redux/reducer/userSlice";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Modal} from "../ui/Modal";
import {authAPI, clubAPI} from "../api/api";
import {Club, ClubInfo, User} from "../types/workout";
import {Popover} from "../ui/Popover";
import {Preloader} from "../common/Preloader";

import "../style/layout/profile.scss";

import arrow from "../assets/images/arrow-right.svg";
import success from "../assets/images/success.png";
import {declOfNum} from "../helpers/helpers";
import {ClubItem} from "../ui/ClubItem";

export const Profile = () => {
    const {isAuth} = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const navigation = useNavigate();
    const [clubLoading, setClubLoading] = useState<boolean>(true);


    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState<string>("");

    const [popoverChangeLogin, setPopoverChangeLogin] = useState<boolean>(false);
    const [popoverChangePassword, setPopoverChangePassword] = useState<boolean>(false);

    useEffect(() => {
        const getMyClub = async () => {
            const profile = await authAPI.getProfileInfo();

            if (profile) {
                if (profile.resultCode === 0) {
                    setUserInfo(profile.result);
                    if (userInfo) {
                        setLogin(userInfo.name);
                    }
                }
            }

            setClubLoading(false);
        };

        getMyClub();

    }, [clubLoading]);



    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("5593f802");
        dispatch(logoutSuccess());
        navigation("/login");
    };


    const changeUsername = async () => {
        const res = await authAPI.changeUsername(login);

        if (res) {
            if (res.resultCode === 0) {
                setPopoverChangeLogin(false);
            }
        }

    };

    const changePassword = async () => {
        const res = await authAPI.changePassword(password);

        if (res) {
            if (res.resultCode === 0) {
                setPopoverChangePassword(false);
            }
        }

    };

    return (
        <>
            <div className="profile">

                <h2 className="login__title">Профиль</h2>

                <div className="profile__user">
                    <div className="profile__user-container">
                        <div className="profile__user-main">
                            <div className="user__left">
                                <div className="user__avatar">{login ? login[0].toUpperCase() : null}</div>
                            </div>
                            <div className="user__right">
                                <div className="profile__title">{login}</div>
                            </div>
                        </div>
                        <img src={arrow} alt=""/>
                    </div>

                    <div className="profile__user-container" onClick={() => setPopoverChangeLogin(prev => !prev)}>
                        <div className="profile__user-main">
                            <div className="user__right">
                                <div className="profile__subtitle">Логин</div>
                                <div className="profile__title">{login}</div>
                            </div>
                        </div>
                        <img src={arrow} alt=""/>
                    </div>

                    <div className="profile__user-container" onClick={() => setPopoverChangePassword(prev => !prev)}>
                        <div className="profile__user-main">
                            <div className="user__right">
                                <div className="profile__subtitle">Пароль</div>
                                <div className="profile__title">Изменить пароль</div>
                            </div>
                        </div>
                        <img src={arrow} alt=""/>
                    </div>
                </div>



                <div className="profile__user" onClick={logout}>
                    <div className="profile__user-container" >
                        <div className="profile__user-main">
                            <div className="user__right">
                                <div className="profile__title">Выход из аккаунта</div>
                            </div>
                        </div>
                        <img src={arrow} alt=""/>
                    </div>
                </div>



                <Popover active={popoverChangeLogin} setActive={setPopoverChangeLogin}>
                    <div className="profile__popover profile__popover--center">
                        <h2 className="popover__title popover__title--find">Изменение логина</h2>
                        <p className="popover__subtitle">Введите новый логин</p>
                        <input
                            type="text"
                            placeholder={"Новый логин"}
                            className="popover__input"
                            onChange={e => setLogin(e.target.value)}
                            value={login}
                        />
                        <button className="popover__button popover__button--find" onClick={changeUsername}>Изменить</button>
                    </div>
                </Popover>


                <Popover active={popoverChangePassword} setActive={setPopoverChangePassword}>
                    <div className="profile__popover profile__popover--center">
                        <h2 className="popover__title popover__title--find">Изменение пароля</h2>
                        <p className="popover__subtitle">Введите новый пароль</p>
                        <input
                            type="text"
                            placeholder={"Новый пароль"}
                            className="popover__input"
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                        />
                        <button className="popover__button popover__button--find" onClick={changePassword}>Изменить</button>
                    </div>
                </Popover>

            </div>
        </>
    );
};