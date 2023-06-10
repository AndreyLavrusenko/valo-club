import {CurrentStage} from "../component/CurrentStage";
import {NextStage} from "../component/NextStage";
import React, {useEffect, useState} from "react";
import {workoutAPI} from "../api/api";
import {Preloader} from "../common/Preloader";
import {Workout, WorkoutType} from "../types/workout";
import {Modal} from "../ui/Modal";
import {NextStageItem} from "../component/NextStageItem";
import ProgressBar from "@ramonak/react-progress-bar";
import { useWakeLock } from 'react-screen-wake-lock';

type IProps = {
    isTrainer: boolean
}

export const TrainingUser = ({isTrainer}: IProps) => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [workout, setWorkout] = useState<Workout | null>(null);
    const [activeWorkout, setActiveWorkout] = useState<WorkoutType | null>(null);
    const [allStagesCount, setAllStagesCount] = useState(0);
    const [timeStagePast, setTimeStagePast] = useState(0);
    const [firstEnter, setFirstEnter] = useState(false);

    const [modalActive, setModalActive] = useState(false);

    // Общее время тренировки
    const [timeAllStages, setTimeAllStages] = useState(0);

    // Сколько времени от тренировки прошло на данный момент
    const [timeSpendAtThisMoment, setTimeSpendAtThisMoment] = useState(0);

    // Отвечает за нажатие на кнопку начать тренировку, что бы нельзя было нажать 2 раза
    const [isStartButtonPressed, setIsStartButtonPressed] = useState(false);

    const [prevStage, setPrevStage] = useState<WorkoutType | null>(null);

    const { isSupported, released, request, release } = useWakeLock({
        onRequest: () => alert('Screen Wake Lock: requested!'),
        onError: () => alert('An error happened 💥'),
        onRelease: () => alert('Screen Wake Lock: released!'),
    });

    // Получает данные о тренировке и выводит ее
    useEffect(() => {
        getWorkoutData();
    }, []);

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
        if (workout?.is_start === 0) {
            getWorkoutData();
            setTimeSpendAtThisMoment(0)
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

            setTimeSpendAtThisMoment(prevTime)
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
        const res = await workoutAPI.getWorkoutInterval(1);

        if (res.resultCode === 0) {
            if (workout) {
                setWorkout({
                    ...workout,
                    is_start: res.data[0].is_start,
                    active_stage: res.data[0].active_stage,
                    time_current: res.data[0].time_current
                });

                setFirstEnter(true);
            }
        }
    };

    // Получает данные о тренировке и выводит ее
    const getWorkoutData = async () => {
        const res = await workoutAPI.getWorkout(1);

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

        setLoading(false);
    };

    // Пока тренировка не началась смотрит не обновилась ли тренировка
    const getUpdatedWorkout = async () => {

        if (workout?.is_start === 0) {
            const res = await workoutAPI.getUpdatedWorkout(1);

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
    };
    

    // Получает время начала тренировки
    const getTimeStart = async () => {

        const res = await workoutAPI.getTimeStart(1);

        if (res.resultCode === 0) {
            if (workout) {
                setWorkout({...workout, time_start: res.time_start});
            }
        }
    };

    const startWorkoutHandler = async () => {
        setIsStartButtonPressed(true);
        await workoutAPI.startWorkout(1);
    };

    const resetWorkoutHandler = async () => {
        await workoutAPI.resetWorkout(1);
        setModalActive(false);
        setIsStartButtonPressed(false);
    };

    const goToTheNextStage = async (current_stage: number) => {
        if (isTrainer) {
            const res = await workoutAPI.goToTheNextStage(1, current_stage);

            if (res && workout && res.data.resultCode === 0) {
                // Если конец тренировки
                if (res.data.active_stage === 0) {
                    getWorkoutData();
                } else {
                    setWorkout({...workout, active_stage: res.data.active_stage});
                }
            }
        }
    };


    return (
        <>
            {
                loading ? <Preloader/>
                    :
                    <>
                        {
                            error
                                ? <p className="error u-margin-top-xl">{error}</p>
                                : <>
                                    {
                                        workout ?
                                            <>
                                                <main>
                                                    <div>
                                                        <p>
                                                            Screen Wake Lock API supported: <b>{`${isSupported}`}</b>
                                                            <br />
                                                            Released: <b>{`${released}`}</b>
                                                        </p>
                                                        <button
                                                            type="button"
                                                            onClick={() => (released === false ? release() : request())}
                                                        >
                                                            {released === false ? 'Release' : 'Request'}
                                                        </button>
                                                    </div>
                                                    {prevStage
                                                        ? <div style={{marginTop: "16px"}}>
                                                            <NextStageItem notLastChild={true} element={prevStage} />
                                                          </div>
                                                        : null
                                                    }

                                                    {workout.is_start

                                                        ? <ProgressBar
                                                            className="progressBar"
                                                            customLabel={((timeSpendAtThisMoment / timeAllStages) * 100).toFixed(0) + '%'}
                                                            completed={timeSpendAtThisMoment}
                                                            maxCompleted={timeAllStages}
                                                            baseBgColor={"#FFEEE7"}
                                                            bgColor={"#FF7B3E"}
                                                        />

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
                                                            Сбросить
                                                        </button>
                                                        : null
                                                    }
                                                </main>
                                                <Modal active={modalActive} setActive={setModalActive}>
                                                    <div className="modal__title">Завершение тренировки</div>
                                                    <p className="modal__subtitle">Вы уверены, что хотите завершить запущенную тренировку?</p>
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
    );
};