import {CurrentStageItem} from "../CurrentStageItem";

import {WorkoutType} from "../../types/workout";
type IProps = {
	element: WorkoutType,
	isAdmin?: boolean,
	deleteStage?: (id: number) => number,
	notLastChild?: boolean,
	minutes: string,
	prev?: boolean
}

export const NextStageWarmUp = ({element, isAdmin, deleteStage, notLastChild, minutes, prev}: IProps) => {
	return (
		<>
			{/*@ts-ignore*/}
			<div className="next-stage__item next-stage__item--warmup" style={prev ? {opacity: '0.7', marginBottom: notLastChild && '8px'} : {marginBottom: notLastChild && '8px'}}>
				<div className="next-stage__header next-stage__header--warmup">
					<div className="next-stage__header--item">
						<CurrentStageItem current_stage={`${element.id} этап`} type={"warmup"} />
						<p>{minutes} </p>
					</div>
					{isAdmin &&
						<button
							onClick={() => deleteStage ? deleteStage(element.id) : null}
							className={"next-stage__header--delete"}
						>Удалить
						</button>
					}
				</div>
			</div>
		</>
	)
}