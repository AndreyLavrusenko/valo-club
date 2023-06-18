import {CurrentStage} from "../component/CurrentStage";
import {NextStage} from "../component/NextStage";
import React, {useEffect, useState} from "react";
import {workoutAPI} from "../api/api";
import {Preloader} from "../common/Preloader";
import {Workout, WorkoutType} from "../types/workout";
import {Modal} from "../ui/Modal";
import {NextStageItem} from "../component/NextStageItem";
import ProgressBar from "@ramonak/react-progress-bar";
import {formatTime} from "../helpers/getDate";


export const TrainingUser = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [workout, setWorkout] = useState<Workout | null>(null);
    const [activeWorkout, setActiveWorkout] = useState<WorkoutType | null>(null);
    const [allStagesCount, setAllStagesCount] = useState(0);
    const [timeStagePast, setTimeStagePast] = useState(0);
    const [firstEnter, setFirstEnter] = useState(false);

    const [modalActive, setModalActive] = useState(false);

    const [activeWorkoutId, setActiveWorkoutId] = useState<null | string>(null);
    const [noActiveWorkout, setNoActiveWorkout] = useState(false);

    // Общее время тренировки
    const [timeAllStages, setTimeAllStages] = useState(0);
    const [timeAllStagesFormated, setTimeAllStagesFormated] = useState("");

    // Сколько времени от тренировки прошло на данный момент
    const [timeSpendAtThisMoment, setTimeSpendAtThisMoment] = useState(0);

    // Отвечает за нажатие на кнопку начать тренировку, что бы нельзя было нажать 2 раза
    const [isStartButtonPressed, setIsStartButtonPressed] = useState(false);

    const [prevStage, setPrevStage] = useState<WorkoutType | null>(null);

    const [isTrainer, setIsTrainer] = useState<boolean>(false);

    // Смотрит кому принадлежит тренировка
    useEffect(() => {
        const checkWhoseWorkout = async () => {
            if (activeWorkoutId) {
                const res = await workoutAPI.checkWhoseWorkout(activeWorkoutId)

                if (res.resultCode === 0) {
                    setIsTrainer(res.isTrainer)
                }
            }
        }

        checkWhoseWorkout()
    }, [activeWorkoutId]);

    // Получает данные о тренировке и выводит ее
    useEffect(() => {
        getActiveWorkout();
    }, [activeWorkoutId]);

    // Делает запроса каждые несколько секунд и сверяет этап и началась стренировка или нет
    useEffect(() => {
        const intervalCall = setInterval(() => {
            getDataAboutWorkout();
            // Делает запроса каждые несколько секунд и сверяет обновилась ли тренировка или нет
            getUpdatedWorkout();
        }, 1500);
        return () => {
            clearInterval(intervalCall);
        };
    }, [workout]);


    // Если была нажата кнопка сброса, то переводит в исходное состояние
    useEffect(() => {
        if (workout?.is_start === 0 && activeWorkoutId) {
            getWorkoutData(activeWorkoutId);
            setTimeSpendAtThisMoment(0);
        }
    }, [workout?.is_start]);


    // Следит за этапом
    useEffect(() => {
        const workoutActive = workout?.workout.find((item: WorkoutType) => item.id === workout?.active_stage);

        let prevTime = 0;
        if (workoutActive) {
            workout?.workout.forEach((item: WorkoutType) => {
                if (item.id < workoutActive.id) {
                    prevTime += item.time;
                }
            });

        }

        if (workoutActive) {
            // Получает предыдущий этап и выводит его сверху
            const prevWorkout = workout?.workout.find((item: WorkoutType) => item.id === workout?.active_stage - 1);
            if (prevWorkout) {
                setPrevStage(prevWorkout);
            }

            // Функция которая вернет время старта с бэка
            getTimeStart();
            // Записывает данные для текущего этапа
            setActiveWorkout(workoutActive);

            if (workout?.time_start) {
                // Получает оставшееся время текущего этапа
                setTimeStagePast((workout.time_start - workout.time_current) + workoutActive.time + prevTime);
            }
        }

    }, [workout?.active_stage, workout?.time_start, workout?.is_start]);


    // Получает данные о идущей тренировки при первом запуске приложения
    useEffect(() => {
        const workoutActive = workout?.workout.find((item: WorkoutType) => item.id === workout?.active_stage);

        let prevTime = 0;
        if (workoutActive) {

            // Получает предыдущий этап и выводит его сверху
            const prevWorkout = workout?.workout.find((item: WorkoutType) => item.id === workout?.active_stage - 1);
            if (prevWorkout) {
                setPrevStage(prevWorkout);
            }

            workout?.workout.forEach((item: WorkoutType) => {
                if (item.id < workoutActive.id) {
                    prevTime += item.time;
                }
            });
        }

        if (workoutActive) {
            // Функция которая вернет время старта с бэка
            getTimeStart();
            // Записывает данные для текущего этапа
            setActiveWorkout(workoutActive);

            if (workout?.time_start) {
                // Получает оставшееся время текущего этапа
                setTimeStagePast((workout.time_start - workout.time_current) + workoutActive.time + prevTime);
            }
        }

    }, [firstEnter]);

    const getDataAboutWorkout = async () => {
        if (activeWorkoutId) {
            const res = await workoutAPI.getWorkoutInterval(activeWorkoutId);

            if (res.resultCode === 0) {
                if (workout) {
                    setWorkout({
                        ...workout,
                        is_start: res.data[0].is_start,
                        active_stage: res.data[0].active_stage,
                        time_current: res.data[0].time_current
                    });

                    setTimeSpendAtThisMoment(workout.time_current - workout.time_start);

                    setFirstEnter(true);
                }
            }
        }
    };


    const getActiveWorkout = async () => {
        const workout_data = await workoutAPI.getActiveWorkout();

        if (workout_data.resultCode === 0) {
            if (workout_data.current_workout !== null) {
                setActiveWorkoutId(workout_data.current_workout);
                await getWorkoutData(workout_data.current_workout);
            } else {
                setLoading(false);
                setNoActiveWorkout(true);
            }
        }

    };

    // Получает данные о тренировке и выводит ее
    const getWorkoutData = async (activeWorkoutId: string) => {

        if (activeWorkoutId) {
            const res = await workoutAPI.getWorkout(activeWorkoutId);

            if (res.resultCode === 1) {
                setError(res.message);
            } else {
                setError("");
                setWorkout(res.data[0]);
                setAllStagesCount(res.data[0].workout.length);
                setPrevStage(null);
                setIsStartButtonPressed(false);
                getWorkoutLengthInMs(res.data[0].workout);
            }

        } else {
            setNoActiveWorkout(true);
        }

        setLoading(false);
    };

    // Пока тренировка не началась смотрит не обновилась ли тренировка
    const getUpdatedWorkout = async () => {

        if (workout?.is_start === 0 && activeWorkoutId) {
            const res = await workoutAPI.getUpdatedWorkout(activeWorkoutId);

            if (res.resultCode === 0) {
                if (workout) {
                    setWorkout({...workout, workout: res.workout});
                }
            }
        }
    };

    // Получает длину всей тренировки
    const getWorkoutLengthInMs = (workout: WorkoutType[]) => {
        let time = 0;

        if (workout.length > 0) {
            for (let i = 0; i < workout.length; i++) {
                time += workout[i].time;
            }
        }

        setTimeAllStages(time);

        const formatedTime = formatTime(time);
        setTimeAllStagesFormated(formatedTime);
    };


    // Получает время начала тренировки
    const getTimeStart = async () => {

        if (activeWorkoutId) {
            const res = await workoutAPI.getTimeStart(activeWorkoutId);

            if (res.resultCode === 0) {
                if (workout) {
                    setWorkout({...workout, time_start: res.time_start});
                }
            }
        }
    };

    const startWorkoutHandler = async () => {
        setIsStartButtonPressed(true);
        if (activeWorkoutId) {
            await workoutAPI.startWorkout(activeWorkoutId);
        }
    };

    const resetWorkoutHandler = async () => {
        if (activeWorkoutId) {
            await workoutAPI.resetWorkout(activeWorkoutId);
            setModalActive(false);
            setIsStartButtonPressed(false);
        }
    };

    const goToTheNextStage = async (current_stage: number) => {
        if (isTrainer && activeWorkoutId) {
            const res = await workoutAPI.goToTheNextStage(activeWorkoutId, current_stage);

            if (res && workout && res.data.resultCode === 0) {
                // Если конец тренировки
                if (res.data.active_stage === 0 && activeWorkoutId) {
                    getWorkoutData(activeWorkoutId);
                } else {
                    setWorkout({...workout, active_stage: res.data.active_stage});
                }
            }
        }
    };


    return (
        <>
            {
                loading
                    ? <Preloader/>
                    : <>
                        {
                            noActiveWorkout
                                ? <p className="error u-margin-top-xl">Нет выбранных тренировок</p>
                                : <>
                                    {
                                        error
                                            ? <p className="error u-margin-top-xl">{error}</p>
                                            : <>
                                                {
                                                    workout ?
                                                        <>
                                                            <main>

                                                                {workout.is_start

                                                                    ? <div className="progress-container">
                                                                        <div className="progress-container--header">
                                                                            <div className="status-item--subtitle">Тренировка</div>
                                                                            <p>Общее {timeAllStagesFormated}</p>
                                                                        </div>
                                                                        <ProgressBar
                                                                            className="progressBar"
                                                                            customLabel={((timeSpendAtThisMoment / timeAllStages) * 100).toFixed(0) + "%"}
                                                                            completed={timeSpendAtThisMoment}
                                                                            maxCompleted={timeAllStages}
                                                                            baseBgColor={"#FFEEE7"}
                                                                            bgColor={"#FF7B3E"}
                                                                        />
                                                                    </div>

                                                                    : null
                                                                }

                                                                {prevStage
                                                                    ? <div style={{marginTop: "12px"}}>
                                                                        <NextStageItem element={prevStage} prev={true}/>
                                                                    </div>
                                                                    : null
                                                                }

                                                                {
                                                                    activeWorkout && workout.active_stage && workout.is_start && timeStagePast

                                                                        ? <CurrentStage
                                                                            allStagesCount={allStagesCount}
                                                                            activeWorkout={activeWorkout}
                                                                            timeStagePast={timeStagePast}
                                                                            goToTheNextStage={goToTheNextStage}
                                                                        />

                                                                        : null
                                                                }

                                                                <div className="next-state">
                                                                    <NextStage
                                                                        activeStage={workout.active_stage}
                                                                        workout={workout.workout}
                                                                    />
                                                                </div>

                                                                {isTrainer && !workout.active_stage && !workout.is_start
                                                                    ? <button
                                                                        className="start__button"
                                                                        onClick={startWorkoutHandler}
                                                                        disabled={isStartButtonPressed}
                                                                    >
                                                                        {isStartButtonPressed ? "Загрузка..." : "Начать тренировку"}
                                                                    </button>
                                                                    : null
                                                                }
                                                                {isTrainer && workout.active_stage && workout.is_start
                                                                    ? <button
                                                                        className="start__button"
                                                                        onClick={() => setModalActive(true)}
                                                                    >
                                                                        Завершить тренировку
                                                                    </button>
                                                                    : null
                                                                }
                                                            </main>
                                                            <Modal active={modalActive} setActive={setModalActive}>
                                                                <div className="modal__title">Завершение тренировки</div>
                                                                <p className="modal__subtitle">Вы уверены, что хотите завершить
                                                                    запущенную тренировку?</p>
                                                                <div className="modal__content-buttons">
                                                                    <button
                                                                        className="modal__content-buttons--secondary"
                                                                        onClick={() => setModalActive(false)}
                                                                    >
                                                                        Отменить
                                                                    </button>
                                                                    <button
                                                                        className="modal__content-buttons--primary"
                                                                        onClick={resetWorkoutHandler}
                                                                    >
                                                                        Завершить тренировку
                                                                    </button>
                                                                </div>
                                                            </Modal>
                                                        </>
                                                        : <p className="error u-margin-top-xl">Не удалось загрузить тренировку</p>
                                                }
                                            </>
                                    }
                                </>
                        }
                    </>
            }
        </>
    );
};