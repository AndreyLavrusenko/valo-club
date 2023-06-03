import "../style/components/ui-element.scss";
import {useEffect, useState} from "react";
import {STATUS_ITEM} from "../helpers/const";

import pulse from '../assets/images/heart.svg'
import turns from '../assets/images/speedometer.svg'
import condition from '../assets/images/candle.svg'

type IProps = {
	type: string,
	data: number | string,
}

export const StatusItem = ({type, data}: IProps) => {
	const [color, setColor] = useState("");
	const [title, setTitle] = useState("");
	const [icon, setIcon] = useState("");

	useEffect(() => {
		switch (type) {
			case 'Пульс':
				setColor("#FFE5E9")
				setTitle("Пульс")
				setIcon(pulse)
				break;

			case 'Обороты':
				setColor("#EBE8FB")
				setTitle("Обороты")
				setIcon(turns)
				break;

			case 'Условие':
				setColor('#EFF9FF')
				setTitle("Условие")
				setIcon(condition)
				break;
		}
	}, []);


	return (
		<div className="status-item">
			<div className="status-item__round" style={{backgroundColor: color}}>
				<img src={icon} alt=""/>
			</div>
			<div className="status-item--text">
				<div className="status-item--subtitle">{data}</div>
				<div className="status-item--title">{title}</div>
			</div>
		</div>
	);
};