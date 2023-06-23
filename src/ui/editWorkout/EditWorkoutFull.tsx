import {StatusItem} from "../StatusItem";
import {useEffect, useRef, useState} from "react";


type IProps = {
    workoutData: any,
    onChange: (e: any) => void,
    addNewStage: (e: any) => void,
    isError: boolean
}

export const EditWorkoutFull = ({workoutData, onChange, addNewStage, isError}: IProps) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        workoutData.minutes = Math.floor(workoutData.time / 60000);
        workoutData.seconds = ((workoutData.time % 60000) / 1000).toFixed(0)
        setLoading(false)
    }, [loading]);

    return (
        <>
            <div className="create-workout__content--title">Выберите значения для этапа</div>

            <div className="create-workout__content-wrapper-item">
                <StatusItem type={"Время"}/>
                <div>
                    <input
                        value={workoutData.minutes}
                        name={"minutes"}
                        onChange={onChange}
                        required
                        max={59}
                        pattern="[0-9]*"
                        type="number"
                        placeholder={"Мин"}
                        className="create-workout__content-wrapper-item--input create-workout__content-wrapper-item--input-small"
                    />
                    <input
                        value={workoutData.seconds}
                        name={"seconds"}
                        onChange={onChange}
                        required
                        max={59}
                        pattern="[0-9]*"
                        type="number"
                        placeholder={"Сек"}
                        className="create-workout__content-wrapper-item--input create-workout__content-wrapper-item--input-small"
                    />
                </div>
            </div>

            <div className="create-workout__content-wrapper-item">
                <StatusItem type={"Пульс"}/>
                <div>
                    <input
                        value={workoutData.pulse_1}
                        name={"pulse_1"}
                        onChange={onChange}
                        required
                        type="text"
                        placeholder={"От"}
                        className="create-workout__content-wrapper-item--input create-workout__content-wrapper-item--input-small"
                    />
                    <input
                        value={workoutData.pulse_2}
                        name={"pulse_2"}
                        onChange={onChange}
                        required
                        type="number"
                        pattern="[0-9]*"
                        placeholder={"До"}
                        className="create-workout__content-wrapper-item--input create-workout__content-wrapper-item--input-small"
                    />
                </div>

            </div>
            <div className="create-workout__content-wrapper-item">
                <StatusItem type={"Обороты"}/>
                <div>
                    <input
                        value={workoutData.turns_1}
                        name={"turns_1"}
                        onChange={onChange}
                        required
                        type="number"
                        pattern="[0-9]*"
                        placeholder={"От"}
                        className="create-workout__content-wrapper-item--input create-workout__content-wrapper-item--input-small"
                    />
                    <input
                        value={workoutData.turns_2}
                        name={"turns_2"}
                        onChange={onChange}
                        type="number"
                        pattern="[0-9]*"
                        placeholder={"До"}
                        className="create-workout__content-wrapper-item--input create-workout__content-wrapper-item--input-small"
                    />
                </div>

            </div>
            <div className="create-workout__content-wrapper-item">
                <StatusItem type={"Условие"}/>
                <div>
                    <div className="form_radio_btn">
                        <input
                            value={"sitting"}
                            name={"condition"}
                            onChange={onChange}
                            id="radio-2"
                            type="radio"
                        />
                        <label htmlFor="radio-2">Сидя</label>
                    </div>
                    <div className="form_radio_btn">
                        <input
                            value={"standing"}
                            name={"condition"}
                            onChange={onChange}
                            id="radio-3"
                            type="radio"
                        />
                        <label htmlFor="radio-3">Стоя</label>
                    </div>
                </div>
            </div>

            <div className="create-workout__content-wrapper-item-comment">
                <div className="status-item--subtitle">Комментарий</div>
                <textarea value={workoutData.comment} onChange={onChange} name="comment"></textarea>
            </div>
            <button onClick={addNewStage} className="create-workout__content--button">Добавить</button>
            {isError && <p className="error">Пожалуйста, заполните все поля</p>}
        </>
    )
}