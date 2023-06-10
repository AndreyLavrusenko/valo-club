import "../style/components/next_stage.scss";
import {CurrentStageItem} from "../ui/CurrentStageItem";
import {CONDITION_TYPE, STATUS_ITEM} from "../helpers/const";
import {StatusItem} from "../ui/StatusItem";
import {WorkoutType} from "../types/workout";
import {convertFromMsToMinutes, declOfNum, millisToMinutesAndSeconds} from "../helpers/getDate";
import {useEffect} from "react";


type IProps = {
	element: WorkoutType,
	isAdmin?: boolean,
	deleteStage?: (id: number) => number,
	notLastChild?: boolean
}

export const NextStageItem = ({element, isAdmin, deleteStage, notLastChild}: IProps) => {

	// @ts-ignore
	const condition = CONDITION_TYPE[element.condition];

	const minutes = millisToMinutesAndSeconds(element.time);

	return (
		<>
			{element.isRecovery

				// Отдых

				// @ts-ignore
				? <div className="next-stage__item next-stage__item--recovery" style={{marginBottom: notLastChild && '8px'}}>
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

				// Тренировка

				: // @ts-ignore
				<div className="next-stage__item" style={{marginBottom: notLastChild && '8px'}}>
					<div className="next-stage__header">
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
					<div className="next-stage__info">
						<StatusItem type={STATUS_ITEM.pulse} data={[element.pulse_1, element.pulse_2]} />
						<div className="next-stage__info--divider"></div>
						<StatusItem type={STATUS_ITEM.turns} data={[element.turns_1, element.turns_2]} />
						<div className="next-stage__info--divider"></div>
						<StatusItem type={STATUS_ITEM.condition} data={condition} />
					</div>
				</div>
			}
		</>
	);
};