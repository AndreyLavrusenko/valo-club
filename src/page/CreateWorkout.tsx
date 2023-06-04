import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {StatusItem} from "../ui/StatusItem";

import "../style/layout/create_workout.scss";
import {workoutAPI} from "../api/api";
import {WorkoutType} from "../types/workout";
import {convertFromMinutesToMs} from "../helpers/getDate";
import {NextStageItem} from "../component/NextStageItem";

type IProps = {
    isTrainer: boolean
}

export const CreateWorkout = ({isTrainer}: IProps) => {
	const [allWorkouts, setAllWorkouts] = useState<WorkoutType[]>([]);
	const [isError, setIsError] = useState(false);

	const [workoutData, setWorkoutData] = useState({
		id: 1,
		time: undefined,
		pulse: undefined,
		turns: undefined,
		condition: undefined
	});

    const navigation = useNavigate();

    useEffect(() => {
        if (!isTrainer) {
            navigation("/");
        }

		getWorkoutData()

    }, []);


	const getWorkoutData = async () => {
		const {data} = await workoutAPI.getWorkout(1)

		if (data[0].workout.length > 1) {
			setAllWorkouts(data[0].workout.reverse())
		} else {
			setAllWorkouts(data[0].workout)
		}

	}

	const onChange = (e: any) => {
		if (e.target.type === "radio") {
			setWorkoutData({...workoutData, ["condition"]: e.target.value});
		} else {
			const value =  e.target.value;
			setWorkoutData({...workoutData, [e.target.name]: value});
		}
	};

	const addNewStage = async (e: any) => {
		e.preventDefault();

		if (!workoutData.time || !workoutData.turns || !workoutData.pulse || !workoutData.condition) {
			return setIsError(true);
		}

		setIsError(false)

		// Получаение id по порядку
		let id = 1

		if (allWorkouts.length > 1) {
			id = allWorkouts.length + 1
		}

		const timeInMs = convertFromMinutesToMs(workoutData.time)

		if (timeInMs && id) {
			const deployArr = {
				id,
				time: timeInMs,
				pulse: Number(workoutData.pulse),
				turns: Number(workoutData.turns),
				condition: workoutData.condition
			}

			setAllWorkouts([deployArr, ...allWorkouts])
		}
	};

	const onSaveChange = async (e: any) => {
		e.preventDefault()

		const workout = allWorkouts.reverse()

		const res = await workoutAPI.updateWorkout(workout, 1)

		if (res && res.data.resultCode === 0) {
			navigation('/')
		}
	}

	const deleteStage = (index: number) => {
		// Удаляет копию из массива
		const deleteCopy = [...allWorkouts].filter((item: WorkoutType) => item.id !== index)
		// Проходит по всем элементам и меняет им id
		for (let i = 0; i < deleteCopy.length; i++) {
			deleteCopy[i].id = i + 1
		}

		deleteCopy.reverse()

		setAllWorkouts([...deleteCopy])
	}

    return (
        <div className="create-workout">
            <div className="create-workout__header">
                <div className="create-workout__header--title">Создание тренировки</div>
                <div className="create-workout__header--count">Этапов: {allWorkouts.length}</div>
            </div>
            <div className="create-workout__content">
                <div className="create-workout__content--title">Выберите значения для этапа</div>
                <div className="create-workout__content-wrapper-item">
                    <StatusItem type={"Время"}/>
                    <input
						value={workoutData.time}
						name={"time"}
						onChange={onChange}
						required
						type="number"
						placeholder={"Минуты"}
					   className="create-workout__content-wrapper-item--input"
					/>
                </div>
                <div className="create-workout__content-wrapper-item">
                    <StatusItem type={"Пульс"}/>
                    <input
						value={workoutData.pulse}
						name={"pulse"}
						onChange={onChange}
						required
						type="number"
						placeholder={"Уд / мин"}
					   className="create-workout__content-wrapper-item--input"
					/>
                </div>
				<div className="create-workout__content-wrapper-item">
					<StatusItem type={"Обороты"}/>
					<input
						value={workoutData.turns}
						name={"turns"}
						onChange={onChange}
						required
						type="number"
						placeholder={"Значние"}
						className="create-workout__content-wrapper-item--input"
					/>
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
				<button onClick={addNewStage} className="create-workout__content--button">Добавить</button>
				{isError && <p className="error">Пожалуйста, заполните все поля</p>}
            </div>
			<div className="create-workout__cards">
				{
					allWorkouts.map((card: WorkoutType) => (
						<NextStageItem
							key={card.id}
							element={card}
							isAdmin={true}
							//@ts-ignore
							deleteStage={deleteStage}
						/>
					))
				}
			</div>
			<button onClick={onSaveChange} className="create-workout__footer--button">Сохранить</button>
        </div>
    );
};