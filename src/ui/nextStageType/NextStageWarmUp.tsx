import {CurrentStageItem} from "../CurrentStageItem";

import {WorkoutType} from "../../types/workout";
import comment from "../../assets/images/comment.svg";
import {useEffect, useRef, useState} from "react";
import {useOutsideAlerter} from "../../hook/useOutside";
import {Dots} from "./ui/Dots";
type IProps = {
	element: WorkoutType,
	isAdmin?: boolean,
	deleteStage?: (id: number) => Promise<void>,
	minutes: string,
	prev?: boolean
}

export const NextStageWarmUp = ({element, isAdmin, deleteStage, minutes, prev}: IProps) => {

	return (
		<>
			{/*@ts-ignore*/}
			<div className="next-stage__item next-stage__item--warmup" style={prev ? {opacity: "0.5"} : null}>
				<div className="next-stage__header next-stage__header--warmup">
					<div className="next-stage__header--item">
						<CurrentStageItem current_stage={`${element.id} этап`} type={"warmup"} />
						<p>{minutes} </p>
					</div>
					{isAdmin &&
						<Dots deleteStage={deleteStage} id={element.id} />
					}
				</div>
				{
					element.comment && !prev
						? <div className="next-stage__footer">
							<div className="status-item--title current-stage__comment--text">
								<img src={comment} alt=""/>
								{element.comment}
							</div>
						</div>
						: null
				}
			</div>
		</>
	);
};