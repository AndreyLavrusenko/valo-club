import {useAppDispatch, useAppSelector} from "../hook/redux";
import {logoutSuccess} from "../redux/reducer/userSlice";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Modal} from "../ui/Modal";
import {authAPI, clubAPI} from "../api/api";
import {Club, ClubInfo, User} from "../types/workout";

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

    useEffect(() => {
        const getMyClub = async () => {
            const club = await clubAPI.getMyClub();

            if (club.resultCode === 0) {
                setMyClubInfo(club.club);
            }


            const profile = await authAPI.getProfileInfo()

            if (profile.resultCode === 0) {
                setUserInfo(profile.result)
            }

            setClubLoading(false);
        };

        getMyClub();

    }, [clubLoading, clubIsCreated]);


    const logout = () => {
        localStorage.removeItem("token");
        dispatch(logoutSuccess());
        navigation("/login");
    };

    const createClub = async () => {
        const res = await clubAPI.createClub(clubName, false);

        if (res.resultCode === 0) {
            console.log("Клуб успешно создан");
            setClubIsCreated(prev => !prev);

            setClubError("");
            setCreateClubModal(false);
        } else {
            if (res.message) {
                setClubError(res.message);
            }
        }
    };

    return (
        <>

            {userInfo ? userInfo.name : null}

            <br/>

            {
                isAuth ? <button onClick={() => setCreateClubModal(true)}>Создать клуб</button> : null
            }

            <br/>

            {myClubInfo ? myClubInfo.name : null}

            <br/>


            <button>Найти клуб</button>


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

            <br/><br/>

            {
                isAuth ? <button onClick={logout}>Выйти</button> : null
            }
        </>
    );
};