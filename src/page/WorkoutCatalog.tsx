import React, {useEffect, useState} from "react";
import {clubAPI, workoutAPI} from "../api/api";
import {WorkoutCatalogs} from "../types/workout";
import {Preloader} from "../common/Preloader";
import {NavLink, useNavigate} from "react-router-dom";
import {Modal} from "../ui/Modal";

import "../style/layout/catalog.scss";
import '../style/components/modal.scss'
import {WorkoutItem} from "../ui/WorkoutItem";
import {Popover} from "../ui/Popover";

export const WorkoutCatalog = () => {
    const [allWorkouts, setAllWorkouts] = useState<WorkoutCatalogs[]>([]);
    const [allClubWorkouts, setAllClubWorkouts] = useState<WorkoutCatalogs[]>([]);

    const [loading, setLoading] = useState(true);
    const [modalActive, setModalActive] = useState<boolean>(false);

    const [workoutName, setWorkoutName] = useState<string>("");
    const [workoutActive, setWorkoutActive] = useState("");

    const [activeSection, setActiveSection] = useState("personal");


    const navigation = useNavigate();


    useEffect(() => {
        const nav = document.querySelector(".nav__footer-item--create");
        if (nav) {
            (nav as HTMLElement).style.color = "#FF7B3E";
        }

        return () => {
            if (nav) {
                (nav as HTMLElement).style.color = "inherit";
            }
        };
    }, []);

    useEffect(() => {
        const getAllWorkouts = async () => {
            const res = await workoutAPI.getAllWorkouts();

            if (res) {
                if (res.resultCode === 0) {
                    setAllWorkouts(res.result);
                }
            }

        };

        const getActiveWorkout = async () => {
            const res = await workoutAPI.getActiveWorkout();

            if (res) {
                if (res.resultCode === 0) {
                    setWorkoutActive(res.current_workout)
                }
            }
        };


        const getAllAvailableWorkout = async () => {
            const res = await clubAPI.getAvailableClubWorkout();

            if (res) {
                if (res.resultCode === 0) {
                    setAllClubWorkouts(res.result);
                }
            }

        };

        getAllWorkouts();
        getActiveWorkout();
        getAllAvailableWorkout();

        setLoading(false);
    }, [loading]);

    const createNewWorkout = async () => {

        const res = await workoutAPI.createNewWorkout(workoutName);

        if (res.resultCode === 0) {
            await navigation(`/create-workout/${res.workout_id}`);
        }

        setModalActive(false);
    };

    const setActiveWorkout = async (id: string) => {

        if (id) {
            const res = await workoutAPI.setActiveWorkout(id);

            if (res.resultCode === 0) {
                navigation("/");
            }
        }
    };

    const setSectionActive = (section: string) => {
        setActiveSection(section);
    };


    return (
        <>
            {
                loading
                    ? <Preloader/>
                    : <>
                        <div className="catalog">
                            <h2 className="login__title">Тренировки</h2>

                            <div className="catalog__button">
                                <div
                                    onClick={() => setSectionActive("personal")}
                                    className={`catalog__button-item 
									${activeSection === "personal" ? "active" : null}`}
                                >
                                    Личные
                                </div>
                                <div
                                    onClick={() => setSectionActive("club")}
                                    className={`catalog__button-item 
									${activeSection === "club" ? "active" : null}`}
                                >
                                    Клубные
                                </div>
                            </div>

                            <div className="catalog__items">
                                {
                                    activeSection === 'personal'
                                        ?
                                            allWorkouts.map((item: WorkoutCatalogs) => (
                                                <WorkoutItem workoutActive={workoutActive} key={item.id} isMyWorkout={true}
                                                             setActiveWorkout={setActiveWorkout} item={item}/>
                                            ))
                                        :
                                        allClubWorkouts.map((item: WorkoutCatalogs) => (
                                            <WorkoutItem workoutActive={workoutActive} key={item.id} isMyWorkout={false}
                                                         setActiveWorkout={setActiveWorkout} item={item}/>
                                        ))

                                }


                            </div>

                            <button
                                onClick={() => setModalActive(true)}
                                className={"catalog__create"}
                            >
                                Создать
                            </button>

                        </div>


                        <Popover active={modalActive} setActive={setModalActive}>
                            <div className="profile__popover profile__popover--center">
                                <h2 className="popover__title popover__title--find">Введите название тренировки</h2>
                                <p className="popover__subtitle">Придумайте название для вашей тренировки</p>
                                <input
                                    type="text"
                                    className="popover__input"
                                    placeholder={"Название тренировки"}
                                    value={workoutName}
                                    onChange={e => setWorkoutName(e.target.value)}
                                />
                                <button className="popover__button popover__button--find" onClick={createNewWorkout}>Создать</button>
                            </div>
                        </Popover>
                    </>
            }
        </>
    );
};