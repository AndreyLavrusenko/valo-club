import "../style/components/current_stage.scss";
import {CurrentStageItem} from "../ui/CurrentStageItem";
import {TimerCountDown} from "../ui/TimerCountDown";
import {StatusItem} from "../ui/StatusItem";
import {CONDITION_TYPE, STATUS_ITEM} from "../helpers/const";
import {WorkoutType} from "../types/workout";
import {memo, useEffect, useRef, useState} from "react";
import {convertFromMsToMinutes, convertFromMsToSeconds} from "../helpers/getDate";
import preloader from '../assets/images/preloader.svg'
import {ProgressBar} from "../ui/ProgressBar";


type IProps = {
	activeWorkout: WorkoutType,
	allStagesCount: number,
	timeStagePast: number,
	goToTheNextStage: (current_stage: number) => {}
}

export const CurrentStage = memo(({activeWorkout, allStagesCount, timeStagePast, goToTheNextStage}: IProps) => {
	const [timer, setTimer] = useState(timeStagePast);
	const [isTimerCorrectAfterReload, setIsTimerCorrectAfterReload] = useState(false);
	const timerId = useRef();

	useEffect(() => {
		(timerId.current as any) = setInterval(() => {
			setTimer(prev => prev - 1000);
			setTimeout(() => {
				setIsTimerCorrectAfterReload(true)
			}, 1000)
		}, 1000);

		return () => clearInterval(timerId.current);

	}, [timer]);

	useEffect(() => {
		if (timeStagePast !== 0) {
			setTimer(timeStagePast);
		}
	}, [timeStagePast]);

	useEffect(() => {
		if (convertFromMsToSeconds(timer) <= 0) {
			// Переход на след этап
			goToTheNextStage(activeWorkout.id);
			clearInterval(timerId.current);
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
					{
						isTimerCorrectAfterReload
							? <TimerCountDown timer={timer} />
							: <img src={preloader} alt=""/>
					}

					{/* Не показывать ничего если это разминка или отдых */}
					{
						!activeWorkout.isWarmUp && !activeWorkout.isRecovery
							? <div className="current-stage__content--items">
								<StatusItem type={STATUS_ITEM.pulse} data={[activeWorkout.pulse_1, activeWorkout.pulse_2]} />
								<StatusItem type={STATUS_ITEM.turns} data={[activeWorkout.turns_1, activeWorkout.turns_2]} />
								<StatusItem type={STATUS_ITEM.condition} data={condition} />
							</div>
							: null
					}

				</div>
			</div>

			{
				activeWorkout.pulse_2
					? <ProgressBar max={10} current={activeWorkout.pulse_2} type={"pulse"} />
					: null
			}

			{
				activeWorkout.comment
					? <div className="current-stage__comment">
						<div className="status-item--subtitle">
							{activeWorkout.comment}
						</div>
					</div>
					: null
			}
		</div>
	);
});