import React, {useEffect, useState} from "react";
import {workoutAPI} from "../api/api";
import {WorkoutCatalogs} from "../types/workout";
import {Preloader} from "../common/Preloader";
import {NavLink, useNavigate} from "react-router-dom";
import {Modal} from "../ui/Modal";

export const WorkoutCatalog = () => {
	const [allWorkouts, setAllWorkouts] = useState<WorkoutCatalogs[]>([]);
	const [loading, setLoading] = useState(true);
	const [modalActive, setModalActive] = useState<boolean>(false);

	const [workoutName, setWorkoutName] = useState<string>("");


	const navigation = useNavigate()

	useEffect(() => {
		const getAllWorkouts = async () => {
			const res = await workoutAPI.getAllWorkouts();

			if (res.resultCode === 0) {
				setAllWorkouts(res.result);
			}

			setLoading(false);
		};

		getAllWorkouts();
	}, []);

	const createNewWorkout = async () => {

		const res = await workoutAPI.createNewWorkout(workoutName);

		if (res.resultCode === 0) {
			await navigation(`/create-workout/${res.workout_id}`)
		}

		setModalActive(false)
	};


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
					<button onClick={() => setModalActive(true)}>Создать</button>

					<Modal active={modalActive} setActive={setModalActive}>
						<h3>Введите название тренировки</h3>
						<input
							type="text"
							placeholder={"Название тренировки"}
							value={workoutName}
							onChange={e => setWorkoutName(e.target.value)}
						/>
						<button onClick={createNewWorkout}>Создать</button>
					</Modal>
					</>
			}
		</>
	);
};