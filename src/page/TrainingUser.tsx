import {CurrentStage} from "../component/CurrentStage";
import {NextStage} from "../component/NextStage";
import React, {useEffect, useState} from "react";
import {workoutAPI} from "../api/api";
import {Preloader} from "../common/Preloader";
import {Workout} from "../types/workout";

export const TrainingUser = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [workout, setWorkout] = useState<Workout | null>(null);

    useEffect(() => {
        const getWorkoutData = async () => {
            const res = await workoutAPI.getWorkout(1);

            if (res.resultCode === 1) {
                setError(res.message);
            } else {
                setError("");
                setWorkout(res.data[0]);
            }

            setLoading(false);
        };

        getWorkoutData();
    }, []);


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
                                                    {workout.is_start === 1 && <CurrentStage/>}
                                                    <div className="next-state">
                                                        <NextStage workout={workout}/>
                                                    </div>
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