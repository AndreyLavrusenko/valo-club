import '../style/components/current_stage.scss'
import {CurrentStageItem} from "../ui/CurrentStageItem";
import {TimerCountDown} from "../ui/TimerCountDown";
import {StatusItem} from "../ui/StatusItem";
import {STATUS_ITEM} from "../helpers/const";

export const CurrentStage = () => {
	return (
		<div className="current-stage">
			<div className="current-stage__header">
				<div className="current-stage__header--stage--count">
					<h2 className="current-stage__header--stage--title">Текущий этап</h2>
					<CurrentStageItem current_stage={"14"} />
				</div>
				<div className="current-stage__header--all">
					Всего: 40
				</div>
			</div>
			<div className="current-stage__content">
				<div className="current-stage__content--wrapper">
					<TimerCountDown />
					<div className="current-stage__content--items">
						<StatusItem type={STATUS_ITEM.pulse} data="200" />
						<StatusItem type={STATUS_ITEM.turns} data="2000" />
						<StatusItem type={STATUS_ITEM.condition} data="Сидя" />
					</div>
				</div>
			</div>
		</div>
	)
}