import React, {useEffect} from "react";

type IProps = {
	active: boolean,
	setActive: (status: boolean) => void,
	children: React.ReactNode
}

export const Popover = ({active, setActive, children}: IProps) => {

	useEffect ( () => {
		!active ? document.body.style.overflow = 'visible':
			document.body.style.overflow = 'hidden'
	}, [active] )

	return (
		<>
			<div className={active ? 'popover active' : 'popover'} onClick={() => setActive(false)}>
				<div className={active ? 'popover__content active' : 'popover__content'} onClick={e => e.stopPropagation()}>
					{children}
				</div>
			</div>
		</>
	)
}