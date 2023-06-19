import preloader from '../assets/images/preloader.svg'

type IProps = {
	fromTop?: string
}

export const Preloader = ({fromTop}: IProps) => {

	const marginTop = fromTop ? fromTop : '50%'

	return (
		<>
			<img
				className="preloader"
				style={{top: marginTop }}
				src={preloader}
				alt=""
			/>
		</>
	)
}