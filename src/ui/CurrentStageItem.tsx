import "../style/components/ui-element.scss";
import {useEffect, useState} from "react";

type IProps = {
	current_stage: string
	type: string
}

export const CurrentStageItem = ({current_stage, type}: IProps) => {
	const [color, setColor] = useState("");
	const [colorBg, setColorBg] = useState("");
	const [marginLeft, setMarginLeft] = useState(0);
	const [text, setText] = useState("");

	useEffect(() => {
		if (type === "recovery") {
			setColor("#43CC7B");
			setColorBg("#EAF9F0");
			setMarginLeft(-8);
			setText("Отдых")
		} else if (type === "warmup") {
			setColor("#1CC3E6");
			setColorBg("#EFF9FF");
			setMarginLeft(-8);
			setText("Разминка")
		} else {
			setColor("#FF7B3E");
			setColorBg("#FFEEE7");
			setText(current_stage)
		}

	}, [current_stage]);

	return (
		<div className="current-stage--item" style={{background: colorBg, color: color, marginLeft: marginLeft}}>
			{text}
		</div>
	);
};