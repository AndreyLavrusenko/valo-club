import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

import {workoutAPI} from "../api/api";
import {WorkoutType} from "../types/workout";
import {convertFromMinutesToMs, convertFromSecondsToMs} from "../helpers/getDate";
import {NextStageItem} from "../component/NextStageItem";
import {CreateWorkoutWarmUp} from "../ui/createWorkout/CreateWorkoutWarmUp";
import {CreateWorkoutFull} from "../ui/createWorkout/CreateWorkoutFull";

import "../style/layout/create_workout.scss";


type IProps = {
    isTrainer: boolean
}

export const CreateWorkout = ({isTrainer}: IProps) => {
    const [allWorkouts, setAllWorkouts] = useState<WorkoutType[]>([]);
    const [isError, setIsError] = useState(false);

    const [isWarmUpActive, setIsWarmUpActive] = useState(false);

    // Смотрит сейчас тренировка или отдых
    const [isRecovery, setIsRecovery] = useState(false);

    const [workoutData, setWorkoutData] = useState({
        id: 1,
        minutes: "",
        seconds: "",
        pulse_1: "",
        pulse_2: "",
        turns_1: "",
        turns_2: "",
        condition: "",
        comment: "",
        isRecovery: isRecovery,
        isWarmUp: false
    });

    const navigation = useNavigate();

    useEffect(() => {
        if (!isTrainer) {
            navigation("/");
        }

        getWorkoutData();

    }, []);

    useEffect(() => {
        if (allWorkouts.length === 0) {
            setIsWarmUpActive(true)
        } else {
            setIsWarmUpActive(false)
        }
    }, [allWorkouts]);


    const getWorkoutData = async () => {
        const {data} = await workoutAPI.getWorkout(1);

        if (data[0].workout.length === 0) {
            setIsWarmUpActive(true);
        } else if (data[0].workout.length > 1) {
            setAllWorkouts(data[0].workout.reverse());
        } else if (data[0].workout.length === 1){
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

    const convertTime = (workoutData: any) => {
        let timeInMs = 0

        if (workoutData.minutes) {
            timeInMs += convertFromMinutesToMs(Number(workoutData.minutes));
        }

        if (workoutData.seconds) {
            timeInMs += convertFromSecondsToMs(Number(workoutData.seconds));
        }

        return timeInMs
    }

    const getId = () => {
        let id = 0

        if (allWorkouts.length >= 1) {
            id = allWorkouts.length + 1;
        }

        return id
    }

    const clearWorkoutField = () => {
        setWorkoutData({
            ...workoutData,
            minutes: "",
            seconds: "",
            pulse_1: "",
            pulse_2: "",
            condition: "",
            turns_1: "",
            turns_2: ""
        });
    }

    const addWarmUp = async (e: any) => {
        e.preventDefault();

        if (!workoutData.minutes && !workoutData.seconds) {
            return setIsError(true);
        }

        setIsError(false);

        // Получаение id по порядку
        let id = getId()


        let timeInMs = convertTime(workoutData)

        if (timeInMs && id) {

            const deployArrWorkout = {
                id,
                time: timeInMs,
                isRecovery: false,
                isWarmUp: true,
            };

            setAllWorkouts([deployArrWorkout, ...allWorkouts]);
            setIsWarmUpActive(false);

            clearWorkoutField()
        }
    };

    const addNewStage = async (e: any) => {
        e.preventDefault();

        // Если восстановление
        if (isRecovery) {

            if (!workoutData.minutes && !workoutData.seconds) {
                return setIsError(true);
            }

            setIsError(false);

            // Получаение id по порядку
            let id = getId()

            let timeInMs = convertTime(workoutData)

            if (timeInMs && id) {

                const deployArrWorkout = {
                    id,
                    time: timeInMs,
                    isRecovery: true,
                    isWarmUp: false,
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
            let id = getId()

            let timeInMs = convertTime(workoutData)

            if (timeInMs && id) {

                const deployArrWorkout = {
                    id,
                    time: timeInMs,
                    pulse_1: workoutData.pulse_1,
                    pulse_2: workoutData.pulse_2 ? Number(workoutData.pulse_2) : 0,
                    turns_1: Number(workoutData.turns_1),
                    turns_2: workoutData.turns_2 ? Number(workoutData.turns_2) : 0,
                    condition: workoutData.condition,
                    isRecovery: false,
                    isWarmUp: false,

                };

                setAllWorkouts([deployArrWorkout, ...allWorkouts]);
            }
        }

        clearWorkoutField()

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

                {
                    isWarmUpActive
                     ? <>
                            <CreateWorkoutWarmUp
                                workoutData={workoutData}
                                onChange={onChange}
                                addWarmUp={addWarmUp}
                                isError={isError}/>
                        </>
                        : <>
                            <CreateWorkoutFull
                                 addNewStage={addNewStage}
                                 isError={isError}
                                 onChange={onChange}
                                 workoutData={workoutData}
                                 isRecovery={isRecovery}
                                 setIsRecovery={setIsRecovery}
                            />
                        </>
                }


            </div>
            <div className="create-workout__cards">
                {
                    allWorkouts.map((card: WorkoutType) => (

                        <NextStageItem
                            element={card}
                            key={card.id}
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