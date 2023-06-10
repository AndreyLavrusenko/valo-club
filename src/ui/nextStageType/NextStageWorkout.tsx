import {CurrentStageItem} from "../CurrentStageItem";
import {StatusItem} from "../StatusItem";
import {STATUS_ITEM} from "../../helpers/const";
import {WorkoutType} from "../../types/workout";

type IProps = {
	element: WorkoutType,
	isAdmin?: boolean,
	deleteStage?: (id: number) => number,
	notLastChild?: boolean,
	minutes: string,
	condition: string,
}

export const NextStageWorkout = ({element, isAdmin, deleteStage, notLastChild, minutes, condition}: IProps) => {
	return (
		<>
			{/*@ts-ignore*/}
			<div className="next-stage__item" style={{marginBottom: notLastChild && '8px'}}>
				<div className="next-stage__header">
					<div className="next-stage__header--item">
						<CurrentStageItem current_stage={`${element.id} этап`}/>
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
				<div className="next-stage__info">
					<StatusItem type={STATUS_ITEM.pulse} data={[element.pulse_1, element.pulse_2]}/>
					<div className="next-stage__info--divider"></div>
					<StatusItem type={STATUS_ITEM.turns} data={[element.turns_1, element.turns_2]}/>
					<div className="next-stage__info--divider"></div>
					<StatusItem type={STATUS_ITEM.condition} data={condition}/>
				</div>
			</div>
		</>
	)
}