import {StatusItem} from "../StatusItem";
import {WorkoutType} from "../../types/workout";


type IProps = {
	workoutData: any,
	isError: boolean,
	onChange: (e: any) => void,
	addWarmUp: (e: any) => void
}


export const CreateWorkoutWarmUp = ({workoutData, isError, onChange, addWarmUp}: IProps) => {
	return (
		<>
			<div className="create-workout__content--title">Укажите время разминки</div>

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


			<button onClick={addWarmUp} className="create-workout__content--button">Добавить</button>
			{isError && <p className="error">Пожалуйста, заполните все поля</p>}
		</>
	)
}