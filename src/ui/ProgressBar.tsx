import {memo, useEffect, useState} from "react";
import rank from '../assets/images/ranking.svg'

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
				<svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M5.55866 12.1666H3.33366C2.41699 12.1666 1.66699 12.9166 1.66699 13.8333V18C1.66699 18.4583 2.04199 18.8333 2.50033 18.8333H5.55866C6.01699 18.8333 6.39199 18.4583 6.39199 18V13C6.39199 12.5416 6.01699 12.1666 5.55866 12.1666Z" fill={color}/>
					<path d="M11.1085 8.83337H8.88346C7.9668 8.83337 7.2168 9.58337 7.2168 10.5V18C7.2168 18.4584 7.5918 18.8334 8.05013 18.8334H11.9418C12.4001 18.8334 12.7751 18.4584 12.7751 18V10.5C12.7751 9.58337 12.0335 8.83337 11.1085 8.83337Z" fill={color}/>
					<path d="M16.6667 14.6666H14.4417C13.9834 14.6666 13.6084 15.0416 13.6084 15.5V18C13.6084 18.4583 13.9834 18.8333 14.4417 18.8333H17.5001C17.9584 18.8333 18.3334 18.4583 18.3334 18V16.3333C18.3334 15.4166 17.5834 14.6666 16.6667 14.6666Z" fill={color}/>
					<path d="M12.5079 4.54161C12.7662 4.28328 12.8662 3.97494 12.7829 3.70828C12.6995 3.44161 12.4412 3.24994 12.0745 3.19161L11.2745 3.05828C11.2412 3.05828 11.1662 2.99994 11.1495 2.96661L10.7079 2.08328C10.3745 1.40828 9.61621 1.40828 9.28288 2.08328L8.84121 2.96661C8.83288 2.99994 8.75788 3.05828 8.72454 3.05828L7.92454 3.19161C7.55788 3.24994 7.30788 3.44161 7.21621 3.70828C7.13288 3.97494 7.23288 4.28328 7.49121 4.54161L8.10788 5.16661C8.14121 5.19161 8.16621 5.29161 8.15788 5.32494L7.98288 6.09161C7.84954 6.66661 8.06621 6.92494 8.20788 7.02494C8.34954 7.12494 8.65788 7.25828 9.16621 6.95828L9.91621 6.51661C9.94954 6.49161 10.0579 6.49161 10.0912 6.51661L10.8329 6.95828C11.0662 7.09994 11.2579 7.14161 11.4079 7.14161C11.5829 7.14161 11.7079 7.07494 11.7829 7.02494C11.9245 6.92494 12.1412 6.66661 12.0079 6.09161L11.8329 5.32494C11.8245 5.28328 11.8495 5.19161 11.8829 5.16661L12.5079 4.54161Z" fill={color}/>
				</svg>
				<p style={{color: color}}>{count}</p>
			</div>
		</>
	);
});