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

import trash from '../assets/images/trash.svg'
import drag from '../assets/images/menu.svg'
import clone from '../assets/images/3square.svg'


export const CreateWorkoutTable = () => {
    const {isAuth} = useAppSelector(state => state.user);

    const {id} = useParams();

    const [workoutName, setWorkoutName] = useState<string>("");
    const [modalActive, setModalActive] = useState(false);
    const [modalNotOk, setModalNotOk] = useState(false);
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

        // Проверка на заполнение времени
        let isOk = true;

        workoutData.forEach(item => {
            if (!item.minutes && !item.seconds) {
                isOk = false;
            }
        });

        if (!isOk) {
            return setModalNotOk(true)
        }

        workoutData.filter(item => {
            if (item.id === 1) {
                item.isWarmUp = true
                item.isRecovery = false
            } else {
                item.isWarmUp = false
            }
        })


        if (id && isOk) {
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
            const current = editData[i];

            current.time = convertTime(current);
        }

        return editData;
    };

    const onChangeInput = (e: any, uniq: string) => {
        const {name, value, type, checked} = e.target;

        if (type === "checkbox") {
            if (name === 'condition') {
                // Меняю с sitting на standing
                if (checked) {
                    const editData = workoutData.map((item) => {
                            return item.uniq === uniq && name ? {...item, [name]: 'sitting'} : item;
                        }
                    );

                    setWorkoutData(editData);

                } else {
                    const editData = workoutData.map((item) => {
                            return item.uniq === uniq && name ? {...item, [name]: 'standing'} : item;
                        }
                    );

                    setWorkoutData(editData);
                }

                return


            } else {
                const editData = workoutData.map((item) => {
                        return item.uniq === uniq && name ? {...item, [name]: checked} : item;
                    }
                );

                setWorkoutData(editData);
            }


            return;
        }


        const editData = workoutData.map((item) => {
            return item.uniq === uniq && name ? {...item, [name]: value} : item;
        });


        const correctTime = setCorrectTime(editData);
        setWorkoutData(correctTime);

        return;
    };


    const confirmBeforeDelete = (uniq: string) => {
        setModalConfirmDelete(true);
        setDeleteId(uniq);
    };

    const deleteStage = async (uniq: string) => {
        const deleteData = workoutData.filter(item => {
            return item.uniq !== uniq;
        });

        const withCorrectId = setCorrectId(deleteData);
        setWorkoutData(withCorrectId);

        setModalConfirmDelete(false);

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
            "pulse_1": "",
            "pulse_2": null,
            "turns_1": null,
            "turns_2": null,
            "condition": "sitting",
            "comment": "",
            "isRecovery": false,
            "isWarmUp": false
        };

        // @ts-ignore
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
                                                <th className={"number-th"} style={{width: "40px"}}>№</th>
                                                <th>Повт</th>
                                                <th style={{width: "60px"}}>Отдых</th>
                                                <th style={{width: "33px"}}>М</th>
                                                <th style={{width: "34px"}}>С</th>
                                                <th style={{width: "85px"}}>Пульс</th>
                                                <th style={{width: "85px"}}>Обороты</th>
                                                <th style={{width: "59px"}}>Тип</th>
                                                <th className={"comment-th"}>Комментарий</th>
                                                <th>Удаление</th>
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
                                                                <td style={{width: '40px'}} className={"table__fix"}>
                                                                    <img style={{width: '14px'}} src={drag} alt=""/>
                                                                    <input
                                                                        disabled
                                                                        className={"input-number"}
                                                                        value={item.id}
                                                                    />
                                                                </td>
                                                                <td style={{width: "50.5px"}}>
                                                                    <div className={"table-img"}>
                                                                        <img onClick={() => cloneStage(item.uniq)}
                                                                             src={clone} alt=""/>
                                                                    </div>
                                                                </td>
                                                                <td style={{width: "61px"}}>
                                                                    <div className={"table-img"}>
                                                                        <input type="checkbox"
                                                                               className="custom-checkbox custom-checkbox--create"
                                                                               id={`isRecovery-${item.id}`}
                                                                               name={`isRecovery`}
                                                                               checked={item.isRecovery}
                                                                               onClick={(e) => onChangeInput(e, item.uniq)}/>
                                                                        <label style={{marginBottom: 0}}
                                                                               htmlFor={`isRecovery-${item.id}`}></label>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        name="minutes"
                                                                        value={item.minutes}
                                                                        pattern="[0-9]*"
                                                                        type="number"
                                                                        required
                                                                        onChange={(e) => {
                                                                            if (e.target.value.length < 4) {
                                                                                onChangeInput(e, item.uniq)
                                                                            } else {
                                                                                e.target.value = String(999)
                                                                                onChangeInput(e, item.uniq)
                                                                            }
                                                                        }}
                                                                        placeholder="Мин"
                                                                        className="create-workout__content-wrapper-item--input input-min"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        name="seconds"
                                                                        value={item.seconds}
                                                                        pattern="[0-9]*"
                                                                        type="number"
                                                                        onChange={(e) => {
                                                                            if (Number(e.target.value) <= 60) {
                                                                                onChangeInput(e, item.uniq)
                                                                            } else {
                                                                                e.target.value = String(60)
                                                                                onChangeInput(e, item.uniq)
                                                                            }
                                                                        }}
                                                                        placeholder="Сек"
                                                                        className="create-workout__content-wrapper-item--input input-min"
                                                                    />
                                                                </td>
                                                                <td className={"border"}>
                                                                    <div style={{display: "flex"}}>
                                                                        <input
                                                                            name="pulse_1"
                                                                            pattern="[0-9]*"
                                                                            type="number"
                                                                            value={item.pulse_1}
                                                                            onChange={(e) => onChangeInput(e, item.uniq)}
                                                                            placeholder="От"
                                                                            className="create-workout__content-wrapper-item--input input-three"
                                                                            disabled={item.isRecovery || item.isWarmUp}
                                                                        />

                                                                        <input
                                                                            name="pulse_2"
                                                                            type="text"
                                                                            value={item.pulse_2}
                                                                            onChange={(e) => onChangeInput(e, item.uniq)}
                                                                            placeholder="До"
                                                                            className="create-workout__content-wrapper-item--input input-three"
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className={"border"}>
                                                                    <div style={{display: "flex"}}>
                                                                        <input
                                                                            name="turns_1"
                                                                            pattern="[0-9]*"
                                                                            type="number"
                                                                            value={item.turns_1}
                                                                            onChange={(e) => onChangeInput(e, item.uniq)}
                                                                            placeholder="От"
                                                                            className="create-workout__content-wrapper-item--input input-three"
                                                                            disabled={item.isRecovery || item.isWarmUp}
                                                                        />
                                                                        <input
                                                                            name="turns_2"
                                                                            pattern="[0-9]*"
                                                                            type="number"
                                                                            value={item.turns_2}
                                                                            onChange={(e) => onChangeInput(e, item.uniq)}
                                                                            placeholder="До"
                                                                            className="create-workout__content-wrapper-item--input input-three"
                                                                            disabled={item.isRecovery || item.isWarmUp}
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div style={{display: "flex"}}>
                                                                        <div className={"table-img"}>
                                                                            <div className={"form_radio_btn"}>
                                                                                <input type="checkbox"
                                                                                       id={`condition-${item.id}`}
                                                                                       name={`condition`}
                                                                                       checked={item.condition === 'sitting'}
                                                                                       onClick={(e) => onChangeInput(e, item.uniq)}/>
                                                                                <label style={{marginBottom: 0}}
                                                                                       htmlFor={`condition-${item.id}`}>Сидя</label>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        name="comment"
                                                                        type="text"
                                                                        value={item.comment}
                                                                        style={{textAlign: "left"}}
                                                                        className={"input-comment create-workout__content-wrapper-item--input"}
                                                                        onChange={(e) => onChangeInput(e, item.uniq)}
                                                                        placeholder="Комментарий"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <div className={"table-img"}>
                                                                        <img
                                                                            onClick={() => confirmBeforeDelete(item.uniq)}
                                                                            src={trash} alt=""/>
                                                                    </div>
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

                </div>

                <button onClick={addNewStage}
                        className={"create-workout__content--button create-workout__content--button-add"}>Добавить новый
                    этап
                </button>

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

            <div className="create-workout--modal create-workout--modal-small">
                <Modal active={modalNotOk} setActive={setModalNotOk}>
                    <div className="modal__title">Не заполнено поле время</div>
                    <div className="modal__content-create">
                        <button onClick={() => setModalNotOk(false)}
                                className="modal__content-create--primary">Понятно
                        </button>
                    </div>

                </Modal>
            </div>

        </>
    );
};