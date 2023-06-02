import '../style/components/ui-element.scss'

type IProps = {
	current_stage: string
}

export const CurrentStageItem = ({current_stage}: IProps) => {
	return (
		<div className="current-stage--item">
			{current_stage}
		</div>
	)
}