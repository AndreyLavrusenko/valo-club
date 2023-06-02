import '../style/components/next_stage.scss'
import {CurrentStageItem} from "../ui/CurrentStageItem";
import {STATUS_ITEM} from "../helpers/const";
import {StatusItem} from "../ui/StatusItem";

export const NextStageItem = () => {
	return (
		<div className="next-stage__item">
			<div className="next-stage__header">
				<CurrentStageItem current_stage={"15 этап"} />
				<p>10 минут / быстрый темп</p>
			</div>
			<div className="next-stage__info">
				<StatusItem type={STATUS_ITEM.pulse} data="200" />
				<StatusItem type={STATUS_ITEM.turns} data="2000" />
				<StatusItem type={STATUS_ITEM.condition} data="Сидя" />
			</div>
		</div>
	)
}