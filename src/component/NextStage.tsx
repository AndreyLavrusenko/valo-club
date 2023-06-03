import {NextStageItem} from "./NextStageItem";
import {Workout, WorkoutType} from "../types/workout";
import {useEffect, useState} from "react";


type IProps = {
	workout: WorkoutType[],
	activeStage: number
}
export const NextStage = ({workout, activeStage}: IProps) => {

	return (
		<>
			{workout.map((element: WorkoutType) => {
				if (element.id > activeStage)
				return (
					<NextStageItem key={element.id} element={element} />
				)}
			)}
		</>
	);
};


