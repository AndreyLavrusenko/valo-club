import {CurrentStage} from "../component/CurrentStage";
import {NextStage} from "../component/NextStage";
import React, {useEffect, useState} from "react";
import {workoutAPI} from "../api/api";
import {Preloader} from "../common/Preloader";
import {Workout, WorkoutType} from "../types/workout";
import {Modal} from "../ui/Modal";
import ProgressBar from "@ramonak/react-progress-bar";
import {formatTime, formatTimeWithHours} from "../helpers/getDate";
import start_video from "../assets/images/emoji/start.mp4";
import hard_video from "../assets/images/emoji/hard.mp4";
import chill_video from "../assets/images/emoji/chill.mp4";
import end_video from "../assets/images/emoji/end.mp4";

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

    //Пуль для графика
    const [pulse, setPulse] = useState<string[]>([]);
    const [time, setTime] = useState<number[]>([]);
    const [pulseLoading, setPulseLoading] = useState(false);

    const [isWorkoutStartVideo, setIsWorkoutStartVideo] = useState(false);
    const [isWorkoutHardVideo, setIsWorkoutHardVideo] = useState(false);
    const [isWorkoutChillVideo, setIsWorkoutChillVideo] = useState(false);
    const [isWorkoutEndVideo, setIsWorkoutEndVideo] = useState(false);

    // Смотрит кому принадлежит тренировка
    useEffect(() => {
        const checkWhoseWorkout = async () => {
            if (activeWorkoutId) {
                const res = await workoutAPI.checkWhoseWorkout(activeWorkoutId);

                if (res.resultCode === 0) {
                    setIsTrainer(res.isTrainer);
                }
            }
        };

        checkWhoseWorkout();
    }, [activeWorkoutId]);

    // Получает данные о тренировке и выводит ее
    useEffect(() => {
        getActiveWorkout();
    }, [activeWorkoutId]);

    // Делает запроса каждые несколько секунд и сверяет этап и началась стренировка или нет
    useEffect(() => {
        const intervalCall = setInterval(() => {
            getDataAboutWorkout();
            // Делает запроса каждые несколько секунд и сверяет обновиться ли тренировка или нет
            getUpdatedWorkout();
        }, 1500);
        return () => {
            clearInterval(intervalCall);
        };
    }, [workout]);

    useEffect(() => {
        if (workout) {
            // Получаю пульс для графика
            const workout_pulse = [];
            const workout_time = [0];

            let lastElem = null;
            let allTime = 0;

            for (let i = 0; i < workout.workout.length; i++) {
                const current = workout.workout[i];

                if (current.pulse_2) {
                    // Если это число, то сразу записываю в массив
                    if (!isNaN(current.pulse_2)) {
                        workout_pulse.push(workout.workout[i].pulse_2);
                        lastElem = workout.workout[i].pulse_2
                    } else {
                        // Превращает строку в число
                        //@ts-ignore
                        workout_pulse.push(current.pulse_2.match(/\d+/)[0]);
                        //@ts-ignore
                        lastElem = current.pulse_2.match(/\d+/)[0]
                    }
                } else {
                    // Если нет пульса 2, то закидываю пульс 1
                    workout_pulse.push(workout.workout[i].pulse_1);
                    lastElem = workout.workout[i].pulse_1
                }

                if (current.minutes) {
                    allTime += Number(current.minutes);
                    workout_time.push(allTime);
                } else if (current.seconds) {
                    allTime += 0.5
                    workout_time.push(allTime);
                }
            }

            setPulseLoading(true);

            workout_pulse.push(lastElem)

            for (let j = 0; j < workout_pulse.length; j++) {
                if (workout_pulse[j] === '') {
                    let currentIndex = j

                    if (workout_pulse[currentIndex - 1]) {
                        workout_pulse[j] = workout_pulse[currentIndex - 1]
                    } else if (workout_pulse[currentIndex + 1]) {
                        workout_pulse[j] = workout_pulse[currentIndex + 1]
                    } else {
                        workout_pulse[j] = '140'
                    }
                }
            }

            workout_time.pop()
            //@ts-ignore
            workout_time.push(Number(timeAllStagesFormated.match(/\d+/)[0]))

            // @ts-ignore
            setPulse(workout_pulse);
            setTime(workout_time);
        }
    }, [workout?.is_start, pulseLoading]);


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

            // Функция, которая вернет время старта с бэка
            getTimeStart();
            // Записывает данные для текущего этапа
            setActiveWorkout(workoutActive);

            if (workout?.time_start) {
                // Получает оставшееся время текущего этапа
                setTimeStagePast((workout.time_start - workout.time_current) + workoutActive.time + prevTime);
            }
        }

    }, [workout?.active_stage, workout?.time_start, workout?.is_start]);


    // Получает данные об идущей тренировки при первом запуске приложения
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

        if (workout_data) {
            if (workout_data.resultCode === 0) {
                if (workout_data.current_workout !== null) {
                    setActiveWorkoutId(workout_data.current_workout);
                    await getWorkoutData(workout_data.current_workout);
                } else {
                    setLoading(false);
                    setNoActiveWorkout(true);
                }
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

        const formatedTime = formatTimeWithHours(time);
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
            // Добавление гифки в начале тренировки
            setTimeout(() => {
                setIsWorkoutStartVideo(true);

                // Скрывает анимацию через 6 секунд
                setTimeout(() => {
                    setIsWorkoutStartVideo(false);
                }, 6000);
            }, 6000);
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

                    // Получаю пульс и если он больше 165 то показываю гиф
                    const activeStage = workout.workout.find(item => item.id === res.data.active_stage);

                    if (activeStage) {
                        // Если это обычный этап тренировки
                        if (!activeStage.isRecovery) {
                            if (activeStage.pulse_2) {
                                // Если это число, то сразу записываю в массив
                                if (!isNaN(activeStage.pulse_2)) {
                                    if (activeStage.pulse_2 >= 165 && !isWorkoutStartVideo) {
                                        setTimeout(() => {
                                            setIsWorkoutHardVideo(true)

                                            setTimeout(() => {
                                                setIsWorkoutHardVideo(false)
                                            }, 6000)
                                        }, 6000)
                                    }
                                } else {
                                    // Превращает строку в число
                                    //@ts-ignore
                                    const pulse2Number = activeStage.pulse_2.match(/\d+/)[0];
                                    if (pulse2Number >= 165 && !isWorkoutStartVideo) {
                                        setTimeout(() => {
                                            setIsWorkoutHardVideo(true)

                                            setTimeout(() => {
                                                setIsWorkoutHardVideo(false)
                                            }, 6000)
                                        }, 6000)
                                    }
                                }
                            } else {
                                // Если нет пульса 2, то закидываю пульс 1
                                if (activeStage.pulse_1 && Number(activeStage.pulse_1) >= 165 && !isWorkoutStartVideo) {
                                    setTimeout(() => {
                                        setIsWorkoutHardVideo(true)

                                        setTimeout(() => {
                                            setIsWorkoutHardVideo(false)
                                        }, 6000)
                                    }, 6000)
                                }
                            }
                        } else {
                            // Если это этап восстановления
                            setTimeout(() => {
                                setIsWorkoutChillVideo(true)

                                setTimeout(() => {
                                    setIsWorkoutChillVideo(false)
                                }, 6000)
                            }, 6000)
                        }

                        if (activeStage.id === allStagesCount) {
                            // Если это этап восстановления
                            setTimeout(() => {
                                setIsWorkoutEndVideo(true)

                                setTimeout(() => {
                                    setIsWorkoutEndVideo(false)
                                }, 6000)

                            }, activeStage.time - 10000)
                        }
                    }
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

                                                                {/*{isWorkoutStartVideo ?*/}
                                                                {/*    <video className={"video"} playsInline={true} autoPlay={true} loop muted>*/}
                                                                {/*        <source src={start_video} type="video/mp4"/>*/}
                                                                {/*    </video>*/}
                                                                {/*    : null*/}
                                                                {/*}*/}

                                                                {/*{isWorkoutHardVideo ?*/}
                                                                {/*    <video className={"video"} playsInline={true} autoPlay={true} loop muted>*/}
                                                                {/*        <source src={hard_video} type="video/mp4"/>*/}
                                                                {/*    </video>*/}
                                                                {/*    : null*/}
                                                                {/*}*/}

                                                                {/*{isWorkoutChillVideo ?*/}
                                                                {/*    <video className={"video"} playsInline={true} autoPlay={true} loop muted>*/}
                                                                {/*        <source src={chill_video} type="video/mp4"/>*/}
                                                                {/*    </video>*/}
                                                                {/*    : null*/}
                                                                {/*}*/}

                                                                {/*{isWorkoutEndVideo ?*/}
                                                                {/*    <video className={"video"} playsInline={true} autoPlay={true} loop muted>*/}
                                                                {/*        <source src={end_video} type="video/mp4"/>*/}
                                                                {/*    </video>*/}
                                                                {/*    : null*/}
                                                                {/*}*/}


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

                                                                {
                                                                    activeWorkout && workout.active_stage && workout.is_start && timeStagePast

                                                                        ? <CurrentStage
                                                                            allStagesCount={allStagesCount}
                                                                            activeWorkout={activeWorkout}
                                                                            timeStagePast={timeStagePast}
                                                                            goToTheNextStage={goToTheNextStage}
                                                                            pulse={pulse}
                                                                            time={time}
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