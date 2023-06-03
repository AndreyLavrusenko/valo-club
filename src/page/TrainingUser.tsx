import {CurrentStage} from "../component/CurrentStage";
import {NextStage} from "../component/NextStage";
import React, {useEffect, useState} from "react";
import {workoutAPI} from "../api/api";
import {Preloader} from "../common/Preloader";
import {Workout, WorkoutType} from "../types/workout";

type IProps = {
    isTrainer: boolean
}

export const TrainingUser = ({isTrainer}: IProps) => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [workout, setWorkout] = useState<Workout | null>(null);
    const [activeWorkout, setActiveWorkout] = useState<WorkoutType | null>(null);
    const [allStagesCount, setAllStagesCount] = useState(0);
    const [timeStagePast, setTimeStagePast] = useState(0)

    // Получает данные о тренировке и выводит ее
    useEffect(() => {
        const getWorkoutData = async () => {
            const res = await workoutAPI.getWorkout(1);

            if (res.resultCode === 1) {
                setError(res.message);
            } else {
                setError("");
                setWorkout(res.data[0]);
                setAllStagesCount(res.data[0].workout.length)
            }

            setLoading(false);
        };

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

    // Следит за этапом
    useEffect(() => {
        const workoutActive = workout?.workout.find((item: WorkoutType) => item.id === workout?.active_stage);

        if (workoutActive) {
            // Записывает данные для текущего этапа
            setActiveWorkout(workoutActive);
            if (workout?.time_start) {
                // Получает оставшееся время текущего этапа

                setTimeStagePast((workout.time_start - Date.now()) + workoutActive.time)
            }
        }

    }, [workout?.active_stage]);


    const getDataAboutWorkout = async () => {
        const res = await workoutAPI.getWorkoutInterval(1);

        if (res.resultCode === 0) {
            if (workout) {
                setWorkout({...workout, is_start: res.data[0].is_start, active_stage: res.data[0].active_stage});
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
                                                        activeWorkout && workout.active_stage && workout.is_start
                                                            ? <CurrentStage
                                                                allStagesCount={allStagesCount}
                                                                activeWorkout={activeWorkout}
                                                                timeStagePast={timeStagePast}
                                                            />
                                                            : null
                                                    }
                                                    <div className="next-state">
                                                        <NextStage activeStage={workout.active_stage}
                                                                   workout={workout.workout}/>
                                                    </div>
                                                    {isTrainer ? <button className="start__button">Старт</button> : null}
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