import React, {useEffect, useState} from "react";
import {workoutAPI} from "../api/api";
import {WorkoutCatalogs} from "../types/workout";
import {Preloader} from "../common/Preloader";
import {NavLink} from "react-router-dom";

export const WorkoutCatalog = () => {
	const [allWorkouts, setAllWorkouts] = useState<WorkoutCatalogs[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getAllWorkouts = async () => {
			const res = await workoutAPI.getAllWorkouts();

			if (res.resultCode === 0) {
				setAllWorkouts(res.result);
			}

			setLoading(false)
		};

		getAllWorkouts();
	}, []);


	return (
		<>
			{
				loading
					? <Preloader />
					: <>
						{allWorkouts.map((item: WorkoutCatalogs) => (
							<div key={item.id}>
								<NavLink to={`/create-workout/${item.id}`}>{item.workout_name}</NavLink>
							</div>
						))}
					</>
			}
		</>
	);
};