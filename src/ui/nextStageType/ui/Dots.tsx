import {useRef, useState} from "react";
import {useOutsideAlerter} from "../../../hook/useOutside";

type IProps = {
	id: number,
	deleteStage?: (id: number) => Promise<void>
}

export const Dots = ({deleteStage, id}: IProps) => {
	const [popupActive, setPopupActive] = useState<boolean>(false);

	const wrapperRef = useRef(null);

	const closePopup = () => {
		setPopupActive(false)
	}

	useOutsideAlerter(wrapperRef, closePopup);

	return (
		<>
			<div className="dropdown-dots">
				<div className="header">

					<div className="dropdown" ref={wrapperRef}>
						<ul className="dropbtn icons btn-right showLeft" onClick={() => setPopupActive(prev => !prev)}>
							<li></li>
							<li></li>
							<li></li>
						</ul>
						{
							popupActive
								? <div id="myDropdown" className="dropdown-content">
									<div className={"dropdown-content--item"} >Изменить</div>
									<div className={"dropdown-content--item"}  onClick={() => deleteStage ? deleteStage(id) : null}>Удалить</div>
								</div>
								: null
						}

					</div>
				</div>
			</div>
		</>
	)
}