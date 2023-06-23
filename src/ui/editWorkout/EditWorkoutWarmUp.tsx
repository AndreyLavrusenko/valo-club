import {StatusItem} from "../StatusItem";
import {useEffect, useState} from "react";


type IProps = {
	workoutData: any,
	onChange: (e: any) => void,
	isError: boolean,
	changeWarmup: (e: any) => void
}


export const EditWorkoutWarmUp = ({workoutData, isError, changeWarmup, onChange}: IProps) => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		workoutData.minutes =  Math.floor(workoutData.time / 60000);
		workoutData.seconds = ((workoutData.time % 60000) / 1000).toFixed(0)
		setLoading(false)
	}, [loading]);

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
			<div className="create-workout__content-wrapper-item-comment">
				<div className="status-item--subtitle">Комментарий</div>
				<textarea value={workoutData.comment} onChange={onChange} name="comment"></textarea>
			</div>


			<button onClick={changeWarmup} className="create-workout__content--button">Сохранить</button>
			{isError && <p className="error">Пожалуйста, заполните все поля</p>}
		</>
	);
};