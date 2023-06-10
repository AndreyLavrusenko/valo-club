import {CurrentStageItem} from "../CurrentStageItem";

import {WorkoutType} from "../../types/workout";
type IProps = {
	element: WorkoutType,
	isAdmin?: boolean,
	deleteStage?: (id: number) => number,
	notLastChild?: boolean,
	minutes: string
}
export const NextStageRecovery = ({element, isAdmin, deleteStage, notLastChild, minutes}: IProps) => {
	return (
		<>
			{/*@ts-ignore*/}
			<div className="next-stage__item next-stage__item--recovery" style={{marginBottom: notLastChild && '8px'}}>
				<div className="next-stage__header next-stage__header--recovery">
					<div className="next-stage__header--item">
						<CurrentStageItem current_stage={`${element.id} этап`} />
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