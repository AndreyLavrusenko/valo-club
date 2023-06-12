import {CurrentStageItem} from "../CurrentStageItem";

import {WorkoutType} from "../../types/workout";
type IProps = {
	element: WorkoutType,
	isAdmin?: boolean,
	deleteStage?: (id: number) => Promise<void>,
	notLastChild?: boolean,
	minutes: string,
	prev?: boolean
}
export const NextStageRecovery = ({element, isAdmin, deleteStage, notLastChild, minutes, prev}: IProps) => {
	return (
		<>
			{/*@ts-ignore*/}
			<div className="next-stage__item next-stage__item--recovery" style={prev ? {opacity: '0.7', marginBottom: notLastChild && '8px'} : {marginBottom: notLastChild && '8px'}}>
				<div className="next-stage__header next-stage__header--recovery">
					<div className="next-stage__header--item">
						<CurrentStageItem current_stage={`${element.id} этап`} type={"recovery"} />
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