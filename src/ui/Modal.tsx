import '../style/components/modal.scss'
import React, {useEffect} from "react";

type IProps = {
	active: boolean,
	setActive: (status: boolean) => void,
	children: React.ReactNode
}

export const Modal = ({active, setActive, children}: IProps) => {

	useEffect ( () => {
		!active ? document.body.style.overflow = 'visible':
			document.body.style.overflow = 'hidden'
	}, [active] )

	return (
		<>
			<div className={active ? 'modal active' : 'modal'} onClick={() => setActive(false)}>
				<div className={active ? 'modal__content active' : 'modal__content'} onClick={e => e.stopPropagation()}>
					{children}
				</div>
			</div>
		</>
	)
}