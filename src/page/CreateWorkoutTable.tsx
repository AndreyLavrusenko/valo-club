import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";

import {workoutAPI} from "../api/api";
import {useAppSelector} from "../hook/redux";
import {WorkoutType} from "../types/workout";
import {convertFromMinutesToMs, convertFromSecondsToMs} from "../helpers/getDate";
//@ts-ignore
import {DragDropContext, Draggable, DraggableProvided, Droppable, DroppableProvided} from "react-beautiful-dnd";

import "../style/layout/create_workout.scss";
import {Popover} from "../ui/Popover";
import {Modal} from "../ui/Modal";


export const CreateWorkoutTable = () => {
    const {isAuth} = useAppSelector(state => state.user);

    const {id} = useParams();

    const [workoutName, setWorkoutName] = useState<string>("");
    const [modalActive, setModalActive] = useState(false);
    const [modalConfirmDelete, setModalConfirmDelete] = useState(false);

    const [deleteId, setDeleteId] = useState("");

    const [workoutData, setWorkoutData] = useState<WorkoutType[]>([]);

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
        workoutData.map(item => {
            item.minutes = Math.floor(item.time / 60000).toString();
            item.seconds = ((item.time % 60000) / 1000).toFixed(0);
        });
    }, []);


    const saveWorkoutChange = async () => {
        if (workoutData.length > 0) {

            if (id) {
                await workoutAPI.updateWorkout(workoutData, id);
            }
        }
    };

    const createNewWorkout = async () => {

        const res = await workoutAPI.createNewWorkout(workoutName);

        if (res) {
            if (res.resultCode === 0) {
                await navigation(`/create-workout-table/${res.workout_id}`);
            }

            setModalActive(false);
        }
    };


    const getWorkoutData = async () => {
        if (id) {
            const {data} = await workoutAPI.getWorkout(id);

            setWorkoutData(data[0].workout);
        }
    };


    const setModalActiveNone = (status: boolean) => {
    };


    const onSaveChange = async (e: any) => {
        e.preventDefault();

        if (id) {
            const res = await workoutAPI.updateWorkout(workoutData, id);

            if (res && res.data.resultCode === 0) {
                await workoutAPI.setActiveWorkout(id);
                navigation("/");
            }
        }
    };


    const handleDrop = async (e: any) => {
        const {source, destination, type} = e;

        if (!destination) return;

        if (destination.droppableId === source.droppableId && source.index === destination.index) return;

        if (type === "group") {
            const reorderedStore = [...workoutData];
            const sourceIndex = source.index;
            const destinationIndex = destination.index;

            const [removedWorkout] = reorderedStore.splice(sourceIndex, 1);
            reorderedStore.splice(destinationIndex, 0, removedWorkout);

            const correctReorderWorkout = setCorrectId(reorderedStore);
            setWorkoutData(correctReorderWorkout);
            await saveWorkoutChange();
        }
    };

    const convertTime = (workoutItem: WorkoutType) => {
        let timeInMs = 0;

        if (workoutItem.minutes) {
            timeInMs += convertFromMinutesToMs(Number(workoutItem.minutes));
        }

        if (workoutItem.seconds) {
            timeInMs += convertFromSecondsToMs(Number(workoutItem.seconds));
        }

        return timeInMs;
    };

    const setCorrectTime = (editData: WorkoutType[]) => {
        for (let i = 0; i < editData.length; i++) {
            const current = editData[i]

            current.time = convertTime(current)
        }

        return editData
    }

    const onChangeInput = (e: any, uniq: string) => {
        const {name, value, id, type, checked} = e.target;

        if (type === "radio") {
            const editData = workoutData.map((item) => {
                    return item.uniq === uniq && name ? {...item, [id]: value} : item;
                }
            );

            setWorkoutData(editData);

            return;
        }

        if (type === "checkbox") {
            const editData = workoutData.map((item) => {
                    return item.uniq === uniq && name ? {...item, [name]: checked} : item;
                }
            );

            setWorkoutData(editData);

            return;
        }


        const editData = workoutData.map((item) => {
            return item.uniq === uniq && name ? {...item, [name]: value} : item;
        });


        const correctTime = setCorrectTime(editData)
        setWorkoutData(correctTime);

        return;
    };


    const confirmBeforeDelete = (uniq: string) => {
        setModalConfirmDelete(true)
        setDeleteId(uniq)
    }

    const deleteStage = async (uniq: string) => {
        const deleteData = workoutData.filter(item => {
            return item.uniq !== uniq;
        });

        const withCorrectId = setCorrectId(deleteData);
        setWorkoutData(withCorrectId);

        setModalConfirmDelete(false)

        await saveWorkoutChange();
    };

    const setCorrectId = (data: WorkoutType[]) => {
        let idx = 1;
        for (let i = 0; i <= data.length - 1; i++) {
            data[i].id = idx;
            idx += 1;
        }

        return data;
    };

    const getId = () => {
        let id = 1;

        if (workoutData.length >= 1) {
            id = workoutData.length + 1;
        }

        return id;
    };

    const addNewStage = async () => {
        const obj = {
            "uniq": Date.now().toString(),
            "id": getId(),
            "time": 0,
            "pulse_1": "0",
            "pulse_2": 0,
            "turns_1": 0,
            "turns_2": 0,
            "condition": "sitting",
            "comment": "",
            "isRecovery": false,
            "isWarmUp": false
        };

        setWorkoutData([...workoutData, obj]);

        await saveWorkoutChange();
    };

    const cloneStage = async (uniq: string) => {
        const copyElement = workoutData.find(item => item.uniq === uniq);

        if (copyElement) {
            const deepCopy = JSON.parse(JSON.stringify(copyElement));

            deepCopy.uniq = Date.now().toString();
            deepCopy.id = getId();

            setWorkoutData([...workoutData, deepCopy]);

            await saveWorkoutChange();
        }
    };


    return (
        <>
            <div className="create-workout">
                <div className="create-workout__header">
                    <div className="create-workout__header--title">Создание тренировки</div>
                    <div className="create-workout__header--count">Этапов: {workoutData.length}</div>
                </div>
                <div className="create-workout__content">


                    <DragDropContext onDragEnd={handleDrop}>
                        <>
                            <Droppable droppableId={"ROOT"} type="group">
                                {(provided: DroppableProvided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        <table>
                                            <thead>
                                            <tr>
                                                <th>№</th>
                                                <th>Разминка</th>
                                                <th>Отдых</th>
                                                <th>Минуты</th>
                                                <th>Секунды</th>
                                                <th className={"comment-th"}>Комментарий</th>
                                                <th>Пульс</th>
                                                <th>Пульс 2</th>
                                                <th>Обороты</th>
                                                <th>Обороты 2</th>
                                                <th>Положение</th>
                                                <th>Удаление</th>
                                                <th>Дублировать</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                workoutData.map((item: WorkoutType, index: number) => (

                                                    <Draggable draggableId={item.id.toString()} key={item.id}
                                                               index={index}>
                                                        {(provided: DraggableProvided) => (
                                                            <tr {...provided.dragHandleProps} {...provided.draggableProps}
                                                                ref={provided.innerRef} key={item.uniq}>
                                                                <td>
                                                                    <input
                                                                        disabled
                                                                        value={item.id}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        name="isWarmUp"
                                                                        checked={item.isWarmUp}
                                                                        type="checkbox"
                                                                        onChange={(e) => onChangeInput(e, item.uniq)}
                                                                        placeholder="Разминка"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        name="isRecovery"
                                                                        checked={item.isRecovery}
                                                                        type="checkbox"
                                                                        onChange={(e) => onChangeInput(e, item.uniq)}
                                                                        placeholder="Отдых"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        name="minutes"
                                                                        value={item.minutes}
                                                                        type="text"
                                                                        required
                                                                        onChange={(e) => onChangeInput(e, item.uniq)}
                                                                        placeholder="Минуты"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        name="seconds"
                                                                        value={item.seconds}
                                                                        type="text"
                                                                        onChange={(e) => onChangeInput(e, item.uniq)}
                                                                        placeholder="Секунды"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        name="comment"
                                                                        type="text"
                                                                        value={item.comment}
                                                                        className={"input-comment"}
                                                                        onChange={(e) => onChangeInput(e, item.uniq)}
                                                                        placeholder="Комментарий"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        name="pulse_1"
                                                                        type="text"
                                                                        value={item.pulse_1}
                                                                        onChange={(e) => onChangeInput(e, item.uniq)}
                                                                        placeholder="Пульс"
                                                                        disabled={item.isRecovery || item.isWarmUp}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        name="pulse_2"
                                                                        type="text"
                                                                        value={item.pulse_2}
                                                                        onChange={(e) => onChangeInput(e, item.uniq)}
                                                                        placeholder="Пульс 2"
                                                                        disabled={item.isRecovery || item.isWarmUp}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        name="turns_1"
                                                                        type="text"
                                                                        value={item.turns_1}
                                                                        onChange={(e) => onChangeInput(e, item.uniq)}
                                                                        placeholder="Обороты"
                                                                        disabled={item.isRecovery || item.isWarmUp}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        name="turns_2"
                                                                        type="text"
                                                                        value={item.turns_2}
                                                                        onChange={(e) => onChangeInput(e, item.uniq)}
                                                                        placeholder="Обороты 2"
                                                                        disabled={item.isRecovery || item.isWarmUp}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        value={"sitting"}
                                                                        name={`condition-${item.id}`}
                                                                        onChange={(e) => onChangeInput(e, item.uniq)}
                                                                        checked={item.condition === "sitting"}
                                                                        id={`condition`}
                                                                        disabled={item.isRecovery || item.isWarmUp}
                                                                        type="radio"
                                                                    />
                                                                    <input
                                                                        value={"standing"}
                                                                        name={`condition-${item.id}`}
                                                                        onChange={(e) => onChangeInput(e, item.uniq)}
                                                                        checked={item.condition === "standing"}
                                                                        id={`condition`}
                                                                        disabled={item.isRecovery || item.isWarmUp}
                                                                        type="radio"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        onClick={() => confirmBeforeDelete(item.uniq)}>Удалить
                                                                    </button>
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        onClick={() => cloneStage(item.uniq)}>Дублировать
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </Draggable>
                                                ))
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </Droppable>
                        </>
                    </DragDropContext>

                    <button onClick={addNewStage}>Добавить новый этап</button>

                </div>

                <button onClick={onSaveChange} className="create-workout__footer--button">Сохранить тренировку</button>
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


            <div className="create-workout--modal">
                <Modal active={modalConfirmDelete} setActive={setModalConfirmDelete}>
                    <div className="modal__title">Удалить этап</div>
                    <div className="modal__content-create">
                        <button onClick={() => deleteStage(deleteId)}
                                className="modal__content-create--primary">Удалить
                        </button>
                        <button onClick={() => setModalConfirmDelete(false)}
                                className="modal__content-create--secondary">Отменить
                        </button>
                    </div>

                </Modal>
            </div>

        </>
    );
};