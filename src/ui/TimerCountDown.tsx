import '../style/components/ui-element.scss'
import {formatTime} from "../helpers/getDate";

type IProps = {
    timer: number,
}

export const TimerCountDown = ({timer}: IProps) => {


    return (
        <>
            <div className="base-timer">
                <svg className="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <g className="base-timer__circle">
                        <circle className="base-timer__path-elapsed" cx="50" cy="50" r="45"/>
                        <path
                            id="base-timer-path-remaining"
                            style={{strokeDasharray: 283 + ' ' + 283}}
                            className="base-timer__path-remaining green"
                            d="
                              M 50, 50
                              m -45, 0
                              a 45,45 0 1,0 90,0
                              a 45,45 0 1,0 -90,0
                            "
                        ></path>
                    </g>
                </svg>
                <span id="base-timer-label" className="base-timer__label">{formatTime(timer)}</span>
                <span className="base-timer__label-subtitle">Время этапа</span>
            </div>
        </>
    )
}