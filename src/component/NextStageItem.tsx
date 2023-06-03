import '../style/components/next_stage.scss'
import {CurrentStageItem} from "../ui/CurrentStageItem";
import {CONDITION_TYPE, STATUS_ITEM} from "../helpers/const";
import {StatusItem} from "../ui/StatusItem";
import {WorkoutType} from "../types/workout";
import {convertFromMsToMinutes, declOfNum} from "../helpers/getDate";


type IProps = {
	element: WorkoutType
}

export const NextStageItem = ({element}: IProps) => {

	// @ts-ignore
	const condition = CONDITION_TYPE[element.condition]

	const minutes = convertFromMsToMinutes(element.time)
	const minutesWord = declOfNum(minutes, ['минута', 'минуты', 'минут'])

	return (
		<div className="next-stage__item">
			<div className="next-stage__header">
				<CurrentStageItem current_stage={`${element.id} этап`} />
				<p>{minutes} {minutesWord} </p>
			</div>
			<div className="next-stage__info">
				<StatusItem type={STATUS_ITEM.pulse} data={element.pulse} />
				<StatusItem type={STATUS_ITEM.turns} data={element.turns} />
				<StatusItem type={STATUS_ITEM.condition} data={condition} />
			</div>
		</div>
	)
}