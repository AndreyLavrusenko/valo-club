import {NextStageItem} from "./NextStageItem";
import {Workout, WorkoutType} from "../types/workout";
import {useEffect, useState} from "react";


type IProps = {
	workout: Workout
}
export const NextStage = ({workout}: IProps) => {
	const [workoutInfo, setWorkoutInfo] = useState([]);

	useEffect(() => {
		// @ts-ignore
		setWorkoutInfo(JSON.parse(workout.workout))
	}, []);

	return (
		<>
			{workoutInfo.map((element: WorkoutType) => (
				<NextStageItem key={element.id} element={element} />
			))}
		</>
	);
};


