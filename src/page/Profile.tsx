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

    const [createClubPopover, setCreateClubPopover] = useState<boolean>(false);

    const [clubName, setClubName] = useState<string>("");
    const [allClubsCount, setAllClubsCount] = useState<number>(0);
    const [allMyClubs, setAllMyClubs] = useState<string[]>([]);

    const [clubError, setClubError] = useState<string>("");

    const [myClubInfo, setMyClubInfo] = useState<Club | null>(null);
    const [clubLoading, setClubLoading] = useState<boolean>(true);

    const [clubIsCreated, setClubIsCreated] = useState<boolean>(false);

    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState<string>("");

    const [popoverClubSuccessCreate, setPopoverClubSuccessCreate] = useState<boolean>(false);
    const [popoverClubFind, setPopoverClubFind] = useState<boolean>(false);
    const [popoverChangeLogin, setPopoverChangeLogin] = useState<boolean>(false);
    const [popoverChangePassword, setPopoverChangePassword] = useState<boolean>(false);

    const [clubFindName, setClubFindName] = useState<string>("");
    const [clubFindLoading, setClubFindLoading] = useState<boolean>(false);
    const [clubFindResult, setClubFindResult] = useState<ClubInfo[] | null>(null);
    const [clubFindError, setClubFindError] = useState<string>("");

    useEffect(() => {
        const getMyClub = async () => {
            const club = await clubAPI.getMyClub();

            if (club) {
                if (club.resultCode === 0) {
                    setMyClubInfo(club.club);
                }
            }


            const profile = await authAPI.getProfileInfo();

            if (profile) {
                if (profile.resultCode === 0) {
                    setUserInfo(profile.result);
                    if (userInfo) {
                        setLogin(userInfo.name);
                    }
                }
            }

            const allClubs = await clubAPI.getAllClubs();

            if (allClubs) {
                if (allClubs.resultCode === 0) {
                    setAllClubsCount(allClubs.clubs);
                }
            }


            const allMyClubs = await clubAPI.getAllMyClubs()

            if (allMyClubs) {
                if (allMyClubs.resultCode === 0) {
                    setAllMyClubs(allMyClubs.result)
                }
            }

            setClubLoading(false);
        };

        getMyClub();

    }, [clubLoading, clubIsCreated]);

    // Получает клубы в которых состоит пользователь и если они попадаются в поиске, то меняет им статус
    useEffect(() => {

    }, []);

    // Очищает инпуты в поиске клуба
    useEffect(() => {
        setClubFindName("");
        setClubFindLoading(false);
        setClubFindResult(null);
        setClubFindError("");
    }, [popoverClubFind]);


    const logout = () => {
        localStorage.removeItem("token");
        dispatch(logoutSuccess());
        navigation("/login");
    };

    const createClub = async () => {
        const res = await clubAPI.createClub(clubName, false);

        if (res) {
            if (res.resultCode === 0) {
                setPopoverClubSuccessCreate(true);
                setClubIsCreated(prev => !prev);

                setClubError("");
                setCreateClubPopover(false);
            } else {
                if (res.message) {
                    setClubError(res.message);
                }
            }
        }

    };


    const findClub = async () => {
        setClubFindLoading(true);

        const res = await clubAPI.searchClub(clubFindName);

        if (res) {
            if (res.resultCode === 0) {
                setClubFindResult(res.result);
                setClubFindError("");
            } else if (res.resultCode === 1) {
                setClubFindError(res.message);
            }
        }


        setClubFindLoading(false);
    };


    const joinToTheClub = async (id: string) => {
        const res = await clubAPI.joinToTheClub(id);

        if (res) {
            if (res.resultCode === 0) {

            } else if (res.resultCode === 1) {

            }
        }

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
                                <div className="profile__subtitle">{myClubInfo ? myClubInfo.name : null}</div>
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


                <div className="profile__user">

                    {
                        isAuth && !myClubInfo
                            ? <>
                                <div className="profile__user-container" onClick={() => setCreateClubPopover(true)}>
                                    <div className="profile__user-main">
                                        <div className="user__right">
                                            <div className="profile__title">Создать клуб</div>
                                        </div>
                                    </div>
                                    <img src={arrow} alt=""/>
                                </div>
                            </>
                            : <>
                                <div className="profile__user-container">
                                    <div className="profile__user-main">
                                        <div className="user__right">
                                            <div className="profile__title">Мой клуб</div>
                                            <div className="profile__subtitle">{myClubInfo ? myClubInfo.name : null}</div>
                                        </div>
                                    </div>
                                    <img src={arrow} alt=""/>
                                </div>

                            </>
                    }


                    {
                        allMyClubs
                            ? <>
                                <div className="profile__user-container">
                                    <div className="profile__user-main">
                                        <div className="user__right">
                                            <div className="profile__title">Участие в клубах</div>
                                            <div className="profile__subtitle">Вы участник {allMyClubs.length} {declOfNum(allClubsCount, ["клуба", "клубов", "клубов"])}</div>
                                        </div>
                                    </div>
                                    <img src={arrow} alt=""/>
                                </div>
                            </>
                            : null
                    }


                    {
                        allClubsCount
                            ? <>
                                <div className="profile__user-container" onClick={() => setPopoverClubFind(true)}>
                                    <div className="profile__user-main">
                                        <div className="user__right">
                                            <div className="profile__title">Найти клуб</div>
                                            <div className="profile__subtitle">Всего {allClubsCount} {declOfNum(allClubsCount, ["клуб", "клуба", "клубов"])}</div>
                                        </div>
                                    </div>
                                    <img src={arrow} alt=""/>
                                </div>
                            </>
                            : null
                    }

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


                <Popover active={createClubPopover} setActive={setCreateClubPopover}>
                    <h3>Создать клуб</h3>

                    <input type="text" placeholder={"Название клуба"} value={clubName}
                           onChange={e => setClubName(e.target.value)}/>

                    <br/>

                    <button onClick={createClub}>Создать</button>
                    {clubError}
                </Popover>

                <Popover active={popoverClubSuccessCreate} setActive={setPopoverClubSuccessCreate}>
                    <div className="profile__popover profile__popover--center">
                        <img src={success} alt=""/>
                        <h2 className="popover__title popover__title--success">Поздравляем!</h2>
                        <p className="popover__subtitle">Вы успешно создали клуб</p>
                        <button
                            className="popover__button popover__button--success"
                            onClick={() => setPopoverClubSuccessCreate(false)}
                        >
                            Отлично
                        </button>
                    </div>
                </Popover>

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

                <Popover active={popoverClubFind} setActive={setPopoverClubFind}>
                    <div className="profile__popover">
                        <h2 className="popover__title popover__title--find">Вступление в клуб</h2>
                        <p className="popover__subtitle">Введите название клуба, в которых хотите вступить</p>
                        <input
                            type="text"
                            placeholder={"Название клуба"}
                            className="popover__input"
                            onChange={e => setClubFindName(e.target.value)}
                            value={clubFindName}
                        />
                        <button className="popover__button popover__button--find" onClick={findClub}>Найти</button>

                        <div className="popover__result">
                            {
                                clubFindError
                                    ? <p className={"error"}>{clubFindError}</p>
                                    :
                                    clubFindLoading
                                        ? <Preloader fromTop={"65%"}/>
                                        : <>
                                            {
                                                clubFindResult
                                                    ? clubFindResult.map((item: ClubInfo) => (
                                                        <ClubItem
                                                            key={item.id}
                                                            name={item.name}
                                                            id={item.id}
                                                            joinToTheClub={joinToTheClub}
                                                            allMyClubs={allMyClubs}
                                                        />
                                                    ))
                                                    : null

                                            }
                                        </>
                            }

                        </div>
                    </div>
                </Popover>

            </div>
        </>
    );
};