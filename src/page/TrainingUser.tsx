import {CurrentStage} from "../component/CurrentStage";
import {NextStage} from "../component/NextStage";
import React, {useEffect, useState} from "react";
import {workoutAPI} from "../api/api";
import {Preloader} from "../common/Preloader";
import {Workout, WorkoutType} from "../types/workout";
import { useWakeLock } from "react-screen-wake-lock";

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

    const { isSupported, released, request, release } = useWakeLock({
        onRequest: () => alert('Screen Wake Lock: requested!'),
        onError: () => alert('An error happened 💥'),
        onRelease: () => alert('Screen Wake Lock: released!'),
    });

    // Получает данные о тренировке и выводит ее
    useEffect(() => {
        getWorkoutData();

        addWakeLock();
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
    // Если не заработает сюда workout?.time_current


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
        await workoutAPI.startWorkout(1);
    };

    const resetWorkoutHandler = async () => {
        await workoutAPI.resetWorkout(1);
    };

    // Не блокирует экран в приложении
    const addWakeLock = async () => {

    };

    const goToTheNextStage = async (current_stage: number) => {
        const res = await workoutAPI.goToTheNextStage(1, current_stage);

        if (res && workout && res.data.resultCode === 0) {
            // Если конец тренировки
            if (res.data.active_stage === 0) {
                getWorkoutData();
            } else {
                setWorkout({...workout, active_stage: res.data.active_stage});
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
                                                        <NextStage activeStage={workout.active_stage}
                                                                   workout={workout.workout}/>
                                                    </div>
                                                    {isTrainer && !workout.active_stage && !workout.is_start
                                                        ? <button
                                                            className="start__button"
                                                            onClick={startWorkoutHandler}
                                                        >
                                                            Начать тренировку
                                                        </button>
                                                        : null
                                                    }
                                                    {isTrainer && workout.active_stage && workout.is_start
                                                        ? <button
                                                            className="start__button"
                                                            onClick={resetWorkoutHandler}
                                                        >
                                                            Сбросить
                                                        </button>
                                                        : null
                                                    }
                                                </main>
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