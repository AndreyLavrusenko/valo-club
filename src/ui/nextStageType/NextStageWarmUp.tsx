import {CurrentStageItem} from "../CurrentStageItem";

import {WorkoutType} from "../../types/workout";
import comment from "../../assets/images/comment.svg";
import {useEffect, useRef, useState} from "react";
import {useOutsideAlerter} from "../../hook/useOutside";
type IProps = {
	element: WorkoutType,
	isAdmin?: boolean,
	deleteStage?: (id: number) => Promise<void>,
	minutes: string,
	prev?: boolean
}

export const NextStageWarmUp = ({element, isAdmin, deleteStage, minutes, prev}: IProps) => {
	const [popupActive, setPopupActive] = useState<boolean>(false);

	const wrapperRef = useRef(null);

	const closePopup = () => {
		setPopupActive(false)
	}

	useOutsideAlerter(wrapperRef, closePopup);


	return (
		<>
			{/*@ts-ignore*/}
			<div className="next-stage__item next-stage__item--warmup" style={prev ? {opacity: "0.5"} : null}>
				<div className="next-stage__header next-stage__header--warmup">
					<div className="next-stage__header--item">
						<CurrentStageItem current_stage={`${element.id} этап`} type={"warmup"} />
						<p>{minutes} </p>
					</div>
					{isAdmin &&
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
												<div className={"dropdown-content--item"}  onClick={() => deleteStage ? deleteStage(element.id) : null}>Удалить</div>
											</div>
											: null
									}

								</div>
							</div>
						</div>
					}
				</div>
				{
					element.comment && !prev
						? <div className="next-stage__footer">
							<div className="status-item--title current-stage__comment--text">
								<img src={comment} alt=""/>
								{element.comment}
							</div>
						</div>
						: null
				}
			</div>
		</>
	);
};