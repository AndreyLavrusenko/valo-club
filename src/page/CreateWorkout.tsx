import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";

import {workoutAPI} from "../api/api";
import {useAppSelector} from "../hook/redux";
import {WorkoutType} from "../types/workout";
import {convertFromMinutesToMs, convertFromSecondsToMs} from "../helpers/getDate";
import {NextStageItem} from "../component/NextStageItem";
import {CreateWorkoutWarmUp} from "../ui/createWorkout/CreateWorkoutWarmUp";
import {CreateWorkoutFull} from "../ui/createWorkout/CreateWorkoutFull";
//@ts-ignore
import {DragDropContext, Draggable, DraggableProvided, Droppable, DroppableProvided} from "react-beautiful-dnd";

import "../style/layout/create_workout.scss";

import play from "../assets/images/play.svg";


export const CreateWorkout = () => {
    const {isAuth} = useAppSelector(state => state.user);

    const { id } = useParams();

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

        if (!isAuth) {
            navigation("/");
        }

        getWorkoutData();

        const nav = document.querySelector('.nav__footer-item--create')
        if (nav) {
            (nav as HTMLElement).style.color = '#FF7B3E'
        }

        const navIcon = document.querySelector('.nav__footer-item--create-path')
        if (navIcon) {
            (navIcon as HTMLElement).style.fill = '#FF7B3E'
        }

        return () => {
            if (nav) {
                (nav as HTMLElement).style.color = 'inherit'
            }

            if (navIcon) {
                (navIcon as HTMLElement).style.fill = 'currentColor'
            }
        }

    }, []);

    useEffect(() => {
        if (allWorkouts.length === 0) {
            setIsWarmUpActive(true);
        } else {
            setIsWarmUpActive(false);
        }
    }, [allWorkouts]);


    // Сохраняет изменения в тренировке
    useEffect(() => {
        const saveWorkoutChange = async () => {

            if (allWorkouts.length > 0) {
                const workout = allWorkouts.reverse();

                if (id) {
                    const res = await workoutAPI.updateWorkout(workout, id);

                    if (res && res.data.resultCode === 0) {
                        await workoutAPI.setActiveWorkout(id);
                    }
                }
            }
        }

        saveWorkoutChange()
    }, [allWorkouts]);


    const getWorkoutData = async () => {
        console.log('get workout data')
        if (id) {
            const {data} = await workoutAPI.getWorkout(id);

            if (data[0].workout.length === 0) {
                setIsWarmUpActive(true);
            } else if (data[0].workout.length > 1) {
                setAllWorkouts(data[0].workout.reverse());
            } else if (data[0].workout.length === 1){
                setAllWorkouts(data[0].workout);
            }
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
        let timeInMs = 0;

        if (workoutData.minutes) {
            timeInMs += convertFromMinutesToMs(Number(workoutData.minutes));
        }

        if (workoutData.seconds) {
            timeInMs += convertFromSecondsToMs(Number(workoutData.seconds));
        }

        return timeInMs;
    };

    const getId = () => {
        let id = 1;

        if (allWorkouts.length >= 1) {
            id = allWorkouts.length + 1;
        }

        return id;
    };

    const clearWorkoutField = () => {
        setWorkoutData({
            ...workoutData,
            minutes: "",
            seconds: "",
            pulse_1: "",
            pulse_2: "",
            condition: "",
            comment: "",
            turns_1: "",
            turns_2: ""
        });
    };

    const addWarmUp = async (e: any) => {
        e.preventDefault();


        if (!workoutData.minutes && !workoutData.seconds) {
            return setIsError(true);
        }

        setIsError(false);

        // Получаение id по порядку
        let id = getId();

        let timeInMs = convertTime(workoutData);

        if (timeInMs && id) {

            const deployArrWorkout = {
                id,
                time: timeInMs,
                isRecovery: false,
                isWarmUp: true,
                comment: workoutData.comment,
            };

            setAllWorkouts([deployArrWorkout, ...allWorkouts]);
            setIsWarmUpActive(false);
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
            let id = getId();

            let timeInMs = convertTime(workoutData);

            if (timeInMs && id) {

                const deployArrWorkout = {
                    id,
                    time: timeInMs,
                    isRecovery: true,
                    isWarmUp: false,
                    comment: workoutData.comment,
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
            let id = getId();

            let timeInMs = convertTime(workoutData);

            if (timeInMs && id) {

                const deployArrWorkout = {
                    id,
                    time: timeInMs,
                    pulse_1: workoutData.pulse_1,
                    pulse_2: workoutData.pulse_2 ? Number(workoutData.pulse_2) : 0,
                    turns_1: Number(workoutData.turns_1),
                    turns_2: workoutData.turns_2 ? Number(workoutData.turns_2) : 0,
                    condition: workoutData.condition,
                    comment: workoutData.comment,
                    isRecovery: false,
                    isWarmUp: false,

                };

                setAllWorkouts([deployArrWorkout, ...allWorkouts]);
            }

        }
    };

    const onSaveChange = async (e: any) => {
        e.preventDefault();

        const workout = allWorkouts.reverse();

        if (id) {
            const res = await workoutAPI.updateWorkout(workout, id);

            if (res && res.data.resultCode === 0) {
                await workoutAPI.setActiveWorkout(id);
                navigation("/");
            }
        }
    };


    const deleteStage = async (index: number) => {
        // Удаляет копию из массива
        const deleteCopy = [...allWorkouts].filter((item: WorkoutType) => item.id !== index);
        // Проходит по всем элементам и меняет им id

        const correctArr = setCorrectId(deleteCopy);

        setAllWorkouts(correctArr);
    };

    const setCorrectId = (data: WorkoutType[]) => {
        let idx = 1;
        for (let i = data.length - 1; i >= 0; i--) {
            data[i].id = idx;
            idx += 1;
        }

        return data;
    };

    const handleDrop = (e: any) => {
        const {source, destination, type} = e;

        if (!destination) return;

        if (destination.droppableId === source.droppableId && source.index === destination.index) return;

        if (type === "group") {
            const reorderedStore = [...allWorkouts];
            const sourceIndex = source.index;
            const destinationIndex = destination.index;

            const [removedWorkout] = reorderedStore.splice(sourceIndex, 1);
            reorderedStore.splice(destinationIndex, 0, removedWorkout);

            const correctReorderWorkout = setCorrectId(reorderedStore);
            setAllWorkouts(correctReorderWorkout);
        }
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
                <DragDropContext onDragEnd={handleDrop}>
                    <div>
                        <Droppable droppableId={"ROOT"} type="group">
                            {(provided: DroppableProvided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {
                                        allWorkouts.map((card: WorkoutType, index: number) => (

                                            <Draggable draggableId={card.id.toString()} key={card.id} index={index}>
                                                {(provided: DraggableProvided) => (
                                                    <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                                        <NextStageItem
                                                            element={card}
                                                            key={card.id}
                                                            isAdmin={true}
                                                            deleteStage={deleteStage}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))
                                    }
                                </div>
                            )}
                        </Droppable>
                    </div>
                </DragDropContext>
            </div>

            <button onClick={onSaveChange} className="create-workout__footer--button">Выбрать тренировку</button>
        </div>
    );
};