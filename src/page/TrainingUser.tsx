import {CurrentStage} from "../component/CurrentStage";
import {NextStage} from "../component/NextStage";
import React, {useEffect, useState} from "react";
import {workoutAPI} from "../api/api";
import {Preloader} from "../common/Preloader";
import {Workout, WorkoutType} from "../types/workout";
import {convertFromMsToMinutes, convertFromMsToSeconds} from "../helpers/getDate";

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

    // Получает данные о тренировке и выводит ее
    useEffect(() => {
        getWorkoutData();
    }, []);


    // Делает запроса каждые несколько секунд и сверяет этап и началась стренировка или нет
    useEffect(() => {
        const intervalCall = setInterval(() => {
            getDataAboutWorkout();
        }, 1000);
        return () => {
            clearInterval(intervalCall);
        };
    }, [workout]);

    // Если была нажата кнопка сброса, то переводит в исходное состояние
    useEffect(() => {
        if (workout?.is_start === 0) {
            getWorkoutData()
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
                setTimeStagePast((workout.time_start - Date.now()) + workoutActive.time + prevTime);
            }
        }

    }, [workout?.active_stage, workout?.time_start, workout?.is_start]);


    const getDataAboutWorkout = async () => {
        const res = await workoutAPI.getWorkoutInterval(1);

        if (res.resultCode === 0) {
            if (workout) {
                setWorkout({...workout, is_start: res.data[0].is_start, active_stage: res.data[0].active_stage});
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
                                                            Старт
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