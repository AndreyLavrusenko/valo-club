import {memo, useEffect, useState} from "react";
type IProps = {

	max: number,
	current: number,
	type: string
}

export const ProgressBar = memo(({max = 10, current, type}: IProps) => {
	const [count, setCount] = useState(0);
	const [color, setColor] = useState(0);

	useEffect(() => {
		if (type === "pulse") {
			if (current < 100) {
				setCount(1)
			} else if (current >= 100 && current < 110) {
				setCount(2)
			} else if (current >= 110 && current < 120) {
				setCount(3)
			} else if (current >= 120 && current < 130) {
				setCount(4)
			}
		}
	}, []);

	return (
		<>
			<div className="progress-bar">
				{Array.from(Array(count), (el, i) => {
					return <div className="progress-bar--item" key={i}></div>;
				})}
			</div>
		</>
	);
});