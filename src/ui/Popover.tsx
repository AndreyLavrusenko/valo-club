import React, {useEffect} from "react";

type IProps = {
	active: boolean,
	setActive: (status: boolean) => void ,
	children: React.ReactNode,
	height?: string
}

export const Popover = ({active, setActive, height, children}: IProps) => {

	useEffect ( () => {
		!active ? document.body.style.overflow = 'visible':
			document.body.style.overflow = 'hidden'
	}, [active] )

	const heightStyle = height ? height : '500px'

	return (
		<>
			<div className={active ? 'popover active' : 'popover'} onClick={() => setActive(false)}>
				<div className={active ? 'popover__content active' : 'popover__content'} style={{height: heightStyle}} onClick={e => e.stopPropagation()}>
					{children}
				</div>
			</div>
		</>
	)
}