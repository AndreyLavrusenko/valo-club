import {CurrentStage} from "../component/CurrentStage";
import {NextStage} from "../component/NextStage";
import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export const TrainingUser = () => {
	return (
		<>
			<main>
				<CurrentStage />
				<div className="next-state">
					<NextStage />
				</div>
			</main>
		</>
	);
};