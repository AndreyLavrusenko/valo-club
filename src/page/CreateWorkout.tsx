import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {StatusItem} from "../ui/StatusItem";

import {workoutAPI} from "../api/api";
import {WorkoutType} from "../types/workout";
import {convertFromMinutesToMs, convertFromSecondsToMs} from "../helpers/getDate";
import {NextStageItem} from "../component/NextStageItem";

import "../style/layout/create_workout.scss";

type IProps = {
    isTrainer: boolean
}

export const CreateWorkout = ({isTrainer}: IProps) => {
    const [allWorkouts, setAllWorkouts] = useState<WorkoutType[]>([]);
    const [isError, setIsError] = useState(false);

    // Смотрит сейчас тренировка или отдых
    const [isRecovery, setIsRecovery] = useState(false);

    const [workoutData, setWorkoutData] = useState({
        id: 1,
        minutes: undefined,
        seconds: undefined,
        pulse_1: undefined,
        pulse_2: undefined,
        turns_1: undefined,
        turns_2: undefined,
        condition: undefined,
        isRecovery: isRecovery,
    });

    const navigation = useNavigate();

    useEffect(() => {
        if (!isTrainer) {
            navigation("/");
        }

        getWorkoutData();

    }, []);


    const getWorkoutData = async () => {
        const {data} = await workoutAPI.getWorkout(1);

        if (data[0].workout.length > 1) {
            setAllWorkouts(data[0].workout.reverse());
        } else {
            setAllWorkouts(data[0].workout);
        }

    };

    const onChange = (e: any) => {
        if (e.target.type === "radio") {
            setWorkoutData({...workoutData, ["condition"]: e.target.value});
        } else {
            const value = e.target.value;
            setWorkoutData({...workoutData, [e.target.name]: value});
        }
    };

    const addNewStage = async (e: any) => {
        e.preventDefault();

        if (isRecovery) {

            if (!workoutData.minutes && !workoutData.seconds) {
                return setIsError(true);
            }

            setIsError(false);

            // Получаение id по порядку
            let id = 1;

            if (allWorkouts.length >= 1) {
                id = allWorkouts.length + 1;
            }


            let timeInMs = 0;

            if (workoutData.minutes) {
                timeInMs += convertFromMinutesToMs(workoutData.minutes);
            }

            if (workoutData.seconds) {
                timeInMs += convertFromSecondsToMs(workoutData.seconds);
            }

            if (timeInMs && id) {

                const deployArrWorkout = {
                    id,
                    time: timeInMs,
                    isRecovery: true
                };

                setAllWorkouts([deployArrWorkout, ...allWorkouts]);
            }

        } else {
            // Если этап тренировки и все поля заполнены
            if (
                (!workoutData.minutes && !workoutData.seconds)
                || !workoutData.turns_1
                || !workoutData.pulse_1
                || !workoutData.condition
            ) {
                return setIsError(true);
            }

            setIsError(false);

            // Получаение id по порядку
            let id = 1;

            if (allWorkouts.length >= 1) {
                id = allWorkouts.length + 1;
            }


            let timeInMs = 0;

            if (workoutData.minutes) {
                timeInMs += convertFromMinutesToMs(workoutData.minutes);
            }

            if (workoutData.seconds) {
                timeInMs += convertFromSecondsToMs(workoutData.seconds);
            }

            if (timeInMs && id) {

                const deployArrWorkout = {
                    id,
                    time: timeInMs,
                    pulse_1: workoutData.pulse_1,
                    pulse_2: workoutData.pulse_2 ? Number(workoutData.pulse_2) : 0,
                    turns_1: Number(workoutData.turns_1),
                    turns_2: workoutData.turns_2 ? Number(workoutData.turns_2) : 0,
                    condition: workoutData.condition,
                    isRecovery: false
                };

                setAllWorkouts([deployArrWorkout, ...allWorkouts]);
            }
        }

    };

    const onSaveChange = async (e: any) => {
        e.preventDefault();

        const workout = allWorkouts.reverse();

        const res = await workoutAPI.updateWorkout(workout, 1);

        if (res && res.data.resultCode === 0) {
            navigation("/");
        }
    };

    const deleteStage = async (index: number) => {
        // Удаляет копию из массива
        const deleteCopy = [...allWorkouts].filter((item: WorkoutType) => item.id !== index);
        // Проходит по всем элементам и меняет им id

        let idx = 1;
        for (let i = deleteCopy.length - 1; i >= 0; i--) {
            deleteCopy[i].id = idx;
            idx += 1;
        }

        setAllWorkouts(deleteCopy);
    };

    return (
        <div className="create-workout">
            <div className="create-workout__header">
                <div className="create-workout__header--title">Создание тренировки</div>
                <div className="create-workout__header--count">Этапов: {allWorkouts.length}</div>
            </div>
            <div className="create-workout__content">
                <div className="create-workout__content--title">Выберите значения для этапа</div>

                <input type="checkbox" className="custom-checkbox custom-checkbox--create" name="isChill"
                       checked={isRecovery}/>
                <label htmlFor="isChill" onClick={() => setIsRecovery(!isRecovery)}>
                    <div style={{marginLeft: '10px'}}>Этап отдыха</div>
                </label>

                <div className="create-workout__content-wrapper-item">
                    <StatusItem type={"Время"}/>
                    <div>
                        <input
                            value={workoutData.minutes}
                            name={"minutes"}
                            onChange={onChange}
                            required
                            max={59}
                            pattern="[0-9]*"
                            type="number"
                            placeholder={"Мин"}
                            className="create-workout__content-wrapper-item--input create-workout__content-wrapper-item--input-small"
                        />
                        <input
                            value={workoutData.seconds}
                            name={"seconds"}
                            onChange={onChange}
                            required
                            max={59}
                            pattern="[0-9]*"
                            type="number"
                            placeholder={"Сек"}
                            className="create-workout__content-wrapper-item--input create-workout__content-wrapper-item--input-small"
                        />
                    </div>
                </div>
                {
                    isRecovery
                        ? null
                        : <>
                            <div className="create-workout__content-wrapper-item">
                                <StatusItem type={"Пульс"}/>
                                <div>
                                    <input
                                        value={workoutData.pulse_1}
                                        name={"pulse_1"}
                                        onChange={onChange}
                                        required
                                        type="text"
                                        placeholder={"От"}
                                        className="create-workout__content-wrapper-item--input create-workout__content-wrapper-item--input-small"
                                    />
                                    <input
                                        value={workoutData.pulse_2}
                                        name={"pulse_2"}
                                        onChange={onChange}
                                        required
                                        type="number"
                                        pattern="[0-9]*"
                                        placeholder={"До"}
                                        className="create-workout__content-wrapper-item--input create-workout__content-wrapper-item--input-small"
                                    />
                                </div>

                            </div>
                            <div className="create-workout__content-wrapper-item">
                                <StatusItem type={"Обороты"}/>
                                <div>
                                    <input
                                        value={workoutData.turns_1}
                                        name={"turns_1"}
                                        onChange={onChange}
                                        required
                                        type="number"
                                        pattern="[0-9]*"
                                        placeholder={"От"}
                                        className="create-workout__content-wrapper-item--input create-workout__content-wrapper-item--input-small"
                                    />
                                    <input
                                        value={workoutData.turns_2}
                                        name={"turns_2"}
                                        onChange={onChange}
                                        type="number"
                                        pattern="[0-9]*"
                                        placeholder={"До"}
                                        className="create-workout__content-wrapper-item--input create-workout__content-wrapper-item--input-small"
                                    />
                                </div>

                            </div>
                            <div className="create-workout__content-wrapper-item">
                                <StatusItem type={"Условие"}/>
                                <div>
                                    <div className="form_radio_btn">
                                        <input
                                            value={"sitting"}
                                            name={"condition"}
                                            onChange={onChange}
                                            id="radio-2"
                                            type="radio"
                                        />
                                        <label htmlFor="radio-2">Сидя</label>
                                    </div>
                                    <div className="form_radio_btn">
                                        <input
                                            value={"standing"}
                                            name={"condition"}
                                            onChange={onChange}
                                            id="radio-3"
                                            type="radio"
                                        />
                                        <label htmlFor="radio-3">Стоя</label>
                                    </div>
                                </div>
                            </div>
                        </>
                }
                <button onClick={addNewStage} className="create-workout__content--button">Добавить</button>
                {isError && <p className="error">Пожалуйста, заполните все поля</p>}
            </div>
            <div className="create-workout__cards">
                {
                    allWorkouts.map((card: WorkoutType) => (
                        <NextStageItem
                            key={card.id}
                            element={card}
                            isAdmin={true}
                            //@ts-ignore
                            deleteStage={deleteStage}
                        />
                    ))
                }
            </div>
            <button onClick={onSaveChange} className="create-workout__footer--button">Сохранить</button>
        </div>
    );
};