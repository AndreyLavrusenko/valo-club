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
	workoutActive: string
}
export const WorkoutItem = ({item, setActiveWorkout, isMyWorkout, workoutActive}: IProps) => {
	const [active, setActive] = useState<boolean>(false);

	const navigation = useNavigate();

	useEffect(() => {
		if (workoutActive === item.id) {
			setActive(true)
		}
	}, []);

	const selectWorkout = (id: string, isEdit: boolean) => {
		if (isEdit) {
			navigation(`/create-workout/${id}`);
		} else {
			setActiveWorkout(id);
		}
	};

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
						? <div className="workout__item--edit" onClick={() => selectWorkout(item.id, true)}>
							Изменить
						</div>
						: null
				}
			</div>
		</>
	);
};