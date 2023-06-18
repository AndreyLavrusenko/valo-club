import {useAppDispatch, useAppSelector} from "../hook/redux";
import {logoutSuccess} from "../redux/reducer/userSlice";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Modal} from "../ui/Modal";
import {clubAPI} from "../api/api";
import {Club} from "../types/workout";

export const Profile = () => {
    const {isAuth} = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const navigation = useNavigate();

    const [createClubModal, setCreateClubModal] = useState<boolean>(false);

    const [isPrivateClub, setIsPrivateClub] = useState<boolean>(false);
    const [clubName, setClubName] = useState<string>("");

    const [clubError, setClubError] = useState<string>("");

    const [myClubInfo, setMyClubInfo] = useState<Club | null>(null);
    const [clubLoading, setClubLoading] = useState<boolean>(true);

    const [clubIsCreated, setClubIsCreated] = useState<boolean>(false);

    useEffect(() => {
        const getMyClub = async () => {
            const res = await clubAPI.getMyClub();

            if (res.resultCode === 0) {
                setMyClubInfo(res.club);
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
        const res = await clubAPI.createClub(clubName, isPrivateClub);

        if (res.resultCode === 0) {
            console.log("Клуб успешно создан");
            setClubIsCreated(prev => !prev)

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

            {
                isAuth ? <button onClick={() => setCreateClubModal(true)}>Создать клуб</button> : null
            }

            <br/>

            {myClubInfo ? myClubInfo.name : null}

            <br/>

            <button>Найти клуб</button>

            <Modal active={createClubModal} setActive={setCreateClubModal}>
                <h3>Создать клуб</h3>

                <input type="text" placeholder={"Название клуба"} value={clubName}
                       onChange={e => setClubName(e.target.value)}/>

                <input
                    checked={isPrivateClub}
                    type="checkbox"
                    className="custom-checkbox custom-checkbox--create"
                    name="is_private_club"
                    onChange={() => console.log("")}
                />
                <label
                    htmlFor="is_private_club"
                    onClick={() => setIsPrivateClub(prev => !prev)}
                >
                    <div>Сделать клуб закрытым?</div>
                </label>

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