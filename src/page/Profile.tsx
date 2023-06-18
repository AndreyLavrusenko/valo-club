import {useAppDispatch, useAppSelector} from "../hook/redux";
import {logoutSuccess} from "../redux/reducer/userSlice";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Modal} from "../ui/Modal";
import {authAPI, clubAPI} from "../api/api";
import {Club, ClubInfo, User} from "../types/workout";
import {Popover} from "../ui/Popover";

import "../style/layout/profile.scss";

import success from "../assets/images/success.png";
import {Preloader} from "../common/Preloader";

export const Profile = () => {
    const {isAuth} = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const navigation = useNavigate();

    const [createClubModal, setCreateClubModal] = useState<boolean>(false);

    const [clubName, setClubName] = useState<string>("");

    const [clubError, setClubError] = useState<string>("");

    const [myClubInfo, setMyClubInfo] = useState<Club | null>(null);
    const [clubLoading, setClubLoading] = useState<boolean>(true);

    const [clubIsCreated, setClubIsCreated] = useState<boolean>(false);

    const [userInfo, setUserInfo] = useState<User | null>(null);

    const [popoverClubSuccessCreate, setPopoverClubSuccessCreate] = useState<boolean>(false);
    const [popoverClubFind, setPopoverClubFind] = useState<boolean>(false);

    const [clubFindName, setClubFindName] = useState<string>("");
    const [clubFindLoading, setClubFindLoading] = useState<boolean>(false);
    const [clubFindResult, setClubFindResult] = useState<ClubInfo[] | null>(null);
    const [clubFindError, setClubFindError] = useState<string>("");

    useEffect(() => {
        const getMyClub = async () => {
            const club = await clubAPI.getMyClub();

            if (club.resultCode === 0) {
                setMyClubInfo(club.club);
            }


            const profile = await authAPI.getProfileInfo();

            if (profile.resultCode === 0) {
                setUserInfo(profile.result);
            }

            setClubLoading(false);
        };

        getMyClub();

    }, [clubLoading, clubIsCreated]);

    // Получает клубы в которых состоит пользователь и если они попадаются в посике, то меняет им статус
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

        if (res.resultCode === 0) {
            setPopoverClubSuccessCreate(true);
            setClubIsCreated(prev => !prev);

            setClubError("");
            setCreateClubModal(false);
        } else {
            if (res.message) {
                setClubError(res.message);
            }
        }
    };


    const findClub = async () => {
        setClubFindLoading(true);

        const res = await clubAPI.searchClub(clubFindName);

        if (res.resultCode === 0) {
            setClubFindResult(res.result);
            setClubFindError("");
        } else if (res.resultCode === 1) {
            setClubFindError(res.message);
        }

        setClubFindLoading(false);
    };


    const joinToTheClub = async (id: string) => {
        const res = await clubAPI.joinToTheClub(id);

        if (res.resultCode === 0) {

        } else if (res.resultCode === 1) {

        }
    };

    return (
        <>
            <div className="profile">

                {userInfo ? "Имя - " + userInfo.name : null}

                <br/>

                {
                    isAuth && !myClubInfo ?
                        <button onClick={() => setCreateClubModal(true)}>Создать клуб</button> : null
                }

                <br/>

                {myClubInfo ? "Мой клуб - " + myClubInfo.name : null}

                <br/>


                <button onClick={() => setPopoverClubFind(true)}>Найти клуб</button>


                <h2>Клубы, в которых я состою</h2>
                {userInfo
                    ? userInfo.clubs.map((club: ClubInfo) => (
                        <div key={club.id}>{club.name}</div>
                    ))
                    : null
                }

                <Modal active={createClubModal} setActive={setCreateClubModal}>
                    <h3>Создать клуб</h3>

                    <input type="text" placeholder={"Название клуба"} value={clubName}
                           onChange={e => setClubName(e.target.value)}/>

                    <br/>

                    <button onClick={createClub}>Создать</button>
                    {clubError}
                </Modal>

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
                                                    <div key={item.id}>
                                                        <div>{item.name}</div>
                                                        <button
                                                            onClick={() => joinToTheClub(item.id)}
                                                        >
                                                            Вступить в клуб
                                                        </button>
                                                    </div>
                                                ))
                                                : <div>Клубов не найдено</div>
                                            }
                                        </>
                            }

                        </div>
                    </div>
                </Popover>

                <br/><br/>

                {
                    isAuth ? <button onClick={logout}>Выйти</button> : null
                }
            </div>
        </>
    );
};