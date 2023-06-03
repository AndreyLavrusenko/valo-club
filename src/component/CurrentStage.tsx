import "../style/components/current_stage.scss";
import {CurrentStageItem} from "../ui/CurrentStageItem";
import {TimerCountDown} from "../ui/TimerCountDown";
import {StatusItem} from "../ui/StatusItem";
import {CONDITION_TYPE, STATUS_ITEM} from "../helpers/const";
import {WorkoutType} from "../types/workout";
import {useEffect, useRef, useState} from "react";
import {convertFromMsToSeconds} from "../helpers/getDate";

type IProps = {
	activeWorkout: WorkoutType,
	allStagesCount: number,
	timeStagePast: number,
	goToTheNextStage: (current_stage: number) => {}
}

export const CurrentStage = ({activeWorkout, allStagesCount, timeStagePast, goToTheNextStage}: IProps) => {
	const [timer, setTimer] = useState(timeStagePast);
	const timerId = useRef();

	useEffect(() => {
		(timerId.current as any) = setInterval(() => {
			setTimer(prev => prev - 1000);
		}, 1000);

		return () => clearInterval(timerId.current);

	}, []);


	useEffect(() => {

		if (convertFromMsToSeconds(timer) <= 2) {
			// Переход на след этап
			goToTheNextStage(activeWorkout.id)
		}

		if (convertFromMsToSeconds(timer) <= 0) {
			clearInterval(timerId.current)
			setTimer(0)
		}
	}, [timer]);

	const currentStage = activeWorkout.id;

	// @ts-ignore
	const condition = CONDITION_TYPE[activeWorkout.condition];


	return (
		<div className="current-stage">
			<div className="current-stage__header">
				<div className="current-stage__header--stage--count">
					<h2 className="current-stage__header--stage--title">Текущий этап</h2>
					<CurrentStageItem current_stage={`${currentStage}`} />
				</div>
				<div className="current-stage__header--all">
					Всего: {allStagesCount}
				</div>
			</div>
			<div className="current-stage__content">
				<div className="current-stage__content--wrapper">
					<TimerCountDown timer={timer} />
					<div className="current-stage__content--items">
						<StatusItem type={STATUS_ITEM.pulse} data={activeWorkout.pulse} />
						<StatusItem type={STATUS_ITEM.turns} data={activeWorkout.turns} />
						<StatusItem type={STATUS_ITEM.condition} data={condition} />
					</div>
				</div>
			</div>
		</div>
	);
};