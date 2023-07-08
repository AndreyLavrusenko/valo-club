import {useEffect, useState} from "react";

import "../style/ui/workout.scss";

import gray__arrow from "../assets/images/arrow-right.svg";
import orange__arrow from "../assets/images/tick-circle.svg";
import {WorkoutCatalogs} from "../types/workout";
import {useNavigate} from "react-router-dom";


type IProps = {
	item: WorkoutCatalogs,
	setActiveWorkout: (id: string) => void,
	isMyWorkout: boolean,
	workoutActive: string,
	deleteSelectedWorkout: (workout_id: string) => void
}
export const WorkoutItem = ({item, setActiveWorkout, isMyWorkout, workoutActive, deleteSelectedWorkout}: IProps) => {
	const [active, setActive] = useState<boolean>(false);

	const navigation = useNavigate();

	useEffect(() => {
		if (workoutActive === item.id) {
			setActive(true)
		}
	}, []);

	const selectWorkout = (id: string, isEdit: boolean) => {
		if (isEdit) {
			navigation(`/create-workout-table/${id}`);
		} else {
			setActiveWorkout(id);
		}
	};

	const deleteWorkoutHandler = (workout_id: string) => {
		deleteSelectedWorkout(workout_id)
	}

	return (
		<>
			<div
				className={`workout__item ${active ? 'active--workout' : ''}`}
			>
				<div className="workout__item-content" onClick={() => selectWorkout(item.id, false)}>
					<div className="workout__item--title">{item.workout_name}</div>
					{
						active ? <img src={orange__arrow} alt=""/> : <img src={gray__arrow} alt=""/>
					}
				</div>
				{
					isMyWorkout
						? <>
							<div className="workout__item--edit">
								<div onClick={() => selectWorkout(item.id, true)}>Изменить</div>
								<div onClick={() => deleteWorkoutHandler(item.id)}>Удалить</div>
							</div>
						</>
						: null
				}
			</div>
		</>
	);
};