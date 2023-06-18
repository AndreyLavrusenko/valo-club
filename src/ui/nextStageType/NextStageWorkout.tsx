import {CurrentStageItem} from "../CurrentStageItem";
import {StatusItem} from "../StatusItem";
import {STATUS_ITEM} from "../../helpers/const";
import {WorkoutType} from "../../types/workout";
import comment from "../../assets/images/comment.svg";
import {Dots} from "./ui/Dots";

type IProps = {
    element: WorkoutType,
    isAdmin?: boolean,
    deleteStage?: (id: number) => Promise<void>,
    minutes: string,
    condition: string,
    prev?: boolean
}

export const NextStageWorkout = ({element, isAdmin, deleteStage, minutes, condition, prev}: IProps) => {
    return (
        <>
            {/*@ts-ignore*/}
            <div className="next-stage__item next-stage__item--workout" style={prev ? {opacity: '0.5'} : null}>
                <div className="next-stage__header">
                    <div className="next-stage__header--item">
                        <CurrentStageItem current_stage={`${element.id} этап`} type={"workout"}/>
                        <p>{minutes} </p>
                    </div>
                    {isAdmin &&
                        <Dots deleteStage={deleteStage} id={element.id} />
                    }
                </div>
                <div className="next-stage__info">
                    <StatusItem type={STATUS_ITEM.pulse} data={[element.pulse_1, element.pulse_2]}/>
                    <div className="next-stage__info--divider"></div>
                    <StatusItem type={STATUS_ITEM.turns} data={[element.turns_1, element.turns_2]}/>
                    <div className="next-stage__info--divider"></div>
                    <StatusItem type={STATUS_ITEM.condition} data={condition}/>
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
    )
}