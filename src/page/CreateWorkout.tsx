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
import {Popover} from "../ui/Popover";
import {EditWorkoutWarmUp} from "../ui/editWorkout/EditWorkoutWarmUp";
import {EditWorkoutFull} from "../ui/editWorkout/EditWorkoutFull";
import {Modal} from "../ui/Modal";


export const CreateWorkout = () => {
    const {isAuth} = useAppSelector(state => state.user);

    const {id} = useParams();

    const [allWorkouts, setAllWorkouts] = useState<WorkoutType[]>([]);
    const [isError, setIsError] = useState(false);
    const [isErrorEdit, setIsErrorEdit] = useState(false);

    const [isWarmUpActive, setIsWarmUpActive] = useState(false);

    const [workoutName, setWorkoutName] = useState<string>("");
    const [modalActive, setModalActive] = useState(false);
    const [popoverChange, setPopoverChange] = useState(false);
    const [modalConfirmDelete, setModalConfirmDelete] = useState(false);

    const [deleteId, setDeleteId] = useState(0);

    const [workoutEdit, setWorkoutEdit] = useState<WorkoutType | null>(null);

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

        if (id) {
            getWorkoutData();
            setModalActive(false);
        } else {
            setModalActive(true);
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

                if (id) {
                    const res = await workoutAPI.updateWorkout(allWorkouts, id);

                    if (res && res.data.resultCode === 0) {
                        await workoutAPI.setActiveWorkout(id);
                    }
                }
            }
        };

        saveWorkoutChange();
    }, [allWorkouts]);

    const createNewWorkout = async () => {

        const res = await workoutAPI.createNewWorkout(workoutName);

        if (res.resultCode === 0) {
            await navigation(`/create-workout/${res.workout_id}`);
        }

        setModalActive(false);
    };


    const getWorkoutData = async () => {
        if (id) {
            const {data} = await workoutAPI.getWorkout(id);

            if (data[0].workout.length === 0) {
                setIsWarmUpActive(true);
            } else if (data[0].workout.length > 1) {
                setAllWorkouts(data[0].workout);
            } else if (data[0].workout.length === 1) {
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

    const onChangeEdit = (e: any) => {
        if (workoutEdit) {
            if (e.target.type === "radio") {
                setWorkoutEdit({...workoutEdit, ["condition"]: e.target.value});
            } else {
                const value = e.target.value;
                setWorkoutEdit({...workoutEdit, [e.target.name]: value});
            }
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

    const setModalActiveNone = (status: boolean) => {
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

    const changeWarmup = async () => {
        if (workoutEdit) {
            if (workoutEdit.isWarmUp || workoutEdit.isRecovery) {
                // Разминка или отдых
                if (!workoutEdit.minutes && !workoutEdit.seconds) {
                    return setIsErrorEdit(true);
                }

                setIsErrorEdit(false);

                workoutEdit.time = convertTime(workoutEdit);
                delete workoutEdit.minutes;
                delete workoutEdit.seconds;

                const notChangedItem = allWorkouts.filter((item: WorkoutType) => item.id !== workoutEdit.id);

                const sortedById = [...notChangedItem, workoutEdit].sort((a,b) => a.id - b.id);

                setAllWorkouts(sortedById);

                setPopoverChange(false);

            } else {
                // Полная тренировка
                if (
                    (!workoutEdit.minutes && !workoutEdit.seconds)
                    || !workoutEdit.turns_1
                    || !workoutEdit.pulse_1
                    || !workoutEdit.condition
                ) {
                    return setIsErrorEdit(true);
                }

                setIsErrorEdit(false);

                workoutEdit.time = convertTime(workoutEdit);
                delete workoutEdit.minutes;
                delete workoutEdit.seconds;

                const notChangedItem = allWorkouts.filter((item: WorkoutType) => item.id !== workoutEdit.id);

                const sortedById = [...notChangedItem, workoutEdit].sort((a,b) => a.id - b.id);

                setAllWorkouts(sortedById);

                setPopoverChange(false);
            }
        }
    };

    const onSaveChange = async (e: any) => {
        e.preventDefault();

        // const workout = allWorkouts.reverse();

        if (id) {
            const res = await workoutAPI.updateWorkout(allWorkouts, id);

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

        setModalConfirmDelete(false)
    };

    const deleteStageConfirm = (id: number) => {
        setModalConfirmDelete(true);
        setDeleteId(id)
    };

    const changeStage = async (index: number) => {
        setPopoverChange(true);

        const item = allWorkouts.find((item: WorkoutType) => item.id === index);
        if (item) {
            setWorkoutEdit(item);
        }
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
        <>
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
                                                        <div {...provided.dragHandleProps} {...provided.draggableProps}
                                                             ref={provided.innerRef}>
                                                            <NextStageItem
                                                                element={card}
                                                                key={card.id}
                                                                isAdmin={true}
                                                                deleteStage={deleteStageConfirm}
                                                                changeStage={changeStage}
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


            <Popover active={modalActive} setActive={setModalActiveNone}>
                <div className="profile__popover">
                    <h2 className="popover__title popover__title--find">Название тренировки</h2>
                    <p className="popover__subtitle">Придумайте название для вашей тренировки</p>
                    <input
                        type="text"
                        className="popover__input"
                        placeholder={"Название тренировки"}
                        value={workoutName}
                        onChange={e => setWorkoutName(e.target.value)}
                    />
                    <button className="popover__button popover__button--find" onClick={createNewWorkout}>Создать
                    </button>
                </div>
            </Popover>

            <Popover active={popoverChange} height={"700px"} setActive={setPopoverChange}>
                <div className="profile__popover">
                    <h2 className="popover__title popover__title--find">Редактирование тренировки</h2>
                    {
                        workoutEdit
                            ? <>
                                {
                                    workoutEdit.isWarmUp || workoutEdit.isRecovery
                                        // Если разминка или восстановление
                                        ? <>
                                            <EditWorkoutWarmUp
                                                workoutData={workoutEdit}
                                                onChange={onChangeEdit}
                                                changeWarmup={changeWarmup}
                                                isError={isErrorEdit}/>
                                        </>
                                        // Если тренировка
                                        : <>
                                            <EditWorkoutFull
                                                workoutData={workoutEdit}
                                                onChange={onChangeEdit}
                                                addNewStage={changeWarmup}
                                                isError={isErrorEdit}
                                            />
                                        </>
                                }
                            </>
                            : null
                    }
                </div>
            </Popover>

            <div className="create-workout--modal">
                <Modal active={modalConfirmDelete} setActive={setModalConfirmDelete}>
                    <div className="modal__title">Удалить этап</div>
                    <div className="modal__content-create">
                        <button onClick={() => deleteStage(deleteId)} className="modal__content-create--primary">Удалить</button>
                        <button onClick={() => setModalConfirmDelete(false)} className="modal__content-create--secondary">Отменить</button>
                    </div>

                </Modal>
            </div>

        </>
    );
};