import {CurrentStage} from "../component/CurrentStage";
import {NextStage} from "../component/NextStage";
import React from "react";

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
	)
}