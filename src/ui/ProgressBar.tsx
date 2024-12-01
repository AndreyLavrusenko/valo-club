import {memo, useEffect, useState} from "react";

type IProps = {

	max: number,
	current: number,
	type: string
}

export const ProgressBar = memo(({max = 10, current, type}: IProps) => {
	const [count, setCount] = useState(0);
	const [color, setColor] = useState("");

	useEffect(() => {
		if (type === "pulse") {
			if (current < 100) {
				setCount(1)
				setColor("#43CC7B")
			} else if (current >= 100 && current < 110) {
				setCount(2)
				setColor("#43CC7B")

			} else if (current >= 110 && current < 130) {
				setCount(3)
				setColor("#43CC7B")
			} else if (current >= 130 && current < 150) {
				setCount(4)
				setColor("#FFDC3E")
			} else if (current >= 150 && current < 155) {
				setCount(5)
				setColor("#FFDC3E")
			} else if (current >= 155 && current < 160) {
				setCount(6)
				setColor("#FF7B3E")
			} else if (current >= 160 && current < 165) {
				setCount(7)
				setColor("#FF7B3E")
			} else if (current >= 165 && current < 170) {
				setCount(8)
				setColor("#FF545A")
			} else if (current >= 170 && current < 175) {
				setCount(9)
				setColor("#FF545A")
			} else {
				setCount(10)
				setColor("#FF545A")
			}
		}
	}, [current]);


	return (
		<>
			<div className="progress-bar">
				<p style={{color: color}}>{count}/10</p>

				<svg style={{marginLeft: '4px'}} width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M22.6918 19.2027C17.8166 23.0775 10.9757 23.9973 2.06525 23.9493C2.06525 23.9493 0.402674 24.4212 0.0216512 22.4857C0.0216512 22.4857 -0.320393 13.9121 1.71454 7.89379C1.71454 7.89379 1.62796 5.43849 1.72756 3.83093C1.74485 3.555 1.87476 3.29906 2.09556 3.11114C4.65441 0.927747 5.8061 0.607853 5.8061 0.607853L9.5253 0C10.1141 0.371903 11.4044 1.71552 11.1922 4.10284L11.2398 3.93889L12.6686 4.30883C13.1675 4.44905 13.4946 4.93482 13.4869 5.39851C13.4825 5.87837 12.24 6.23825 12.24 6.23825C9.52095 6.80612 9.52095 6.80612 9.52095 6.80612C8.70699 7.98578 7.03486 8.10975 6.28583 8.07777C6.24686 7.97782 6.02241 8.06977 6.19992 8.07777C6.46401 8.69359 6.77295 10.1772 7.05437 12.9244L7.13228 13.6882C7.15392 13.9041 7.27299 15.6292 7.30326 16.7569C8.10859 14.9454 10.2526 11.6008 14.2965 11.0729C20.2801 10.2851 23.2589 14.5599 23.2589 14.5599C23.2589 14.5599 23.3628 14.6719 23.4927 14.8758C24.4106 16.2915 24.047 18.1229 22.6918 19.2027Z" fill={color}/>
					<path d="M6.42364 7.97392C6.24142 7.96571 6.09475 7.94929 6.00586 7.93698L6.2903 7.73584C6.33919 7.79331 6.38364 7.8713 6.42364 7.97392Z" fill={color}/>
					<path d="M6.42364 7.97392C6.24142 7.96571 6.09475 7.94929 6.00586 7.93698L6.2903 7.73584C6.33919 7.79331 6.38364 7.8713 6.42364 7.97392Z" fill={color}/>
				</svg>

			</div>
		</>
	);
});