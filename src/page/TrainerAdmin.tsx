import {CurrentStage} from "../component/CurrentStage";
import {NextStage} from "../component/NextStage";
import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export const TrainerAdmin = () => {
	const navigation = useNavigate()

	useEffect(() => {
		if (!localStorage.getItem('token')) {
			navigation('/')
		}
	}, []);

	return (
		<>
			<main>
				<CurrentStage />
				<div className="next-state">
					{/*<NextStage />*/}
				</div>
			</main>
		</>
	);
};