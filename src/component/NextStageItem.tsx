import "../style/components/next_stage.scss";
import {CurrentStageItem} from "../ui/CurrentStageItem";
import {CONDITION_TYPE, STATUS_ITEM} from "../helpers/const";
import {StatusItem} from "../ui/StatusItem";
import {WorkoutType} from "../types/workout";
import {convertFromMsToMinutes, declOfNum, millisToMinutesAndSeconds} from "../helpers/getDate";
import {useEffect} from "react";
import {NextStageRecovery} from "../ui/nextStageType/NextStageRecovery";
import {NextStageWorkout} from "../ui/nextStageType/NextStageWorkout";
import {NextStageWarmUp} from "../ui/nextStageType/NextStageWarmUp";


type IProps = {
    element: WorkoutType,
    isAdmin?: boolean,
    deleteStage?: (id: number) => void,
    changeStage?: (id: number) => Promise<void>,
    prev?: boolean,
}

export const NextStageItem = ({element, isAdmin, deleteStage, changeStage, prev}: IProps) => {

    // @ts-ignore
    const condition = CONDITION_TYPE[element.condition];

    const minutes = millisToMinutesAndSeconds(element.time);

    return (
        <>
            {element.isRecovery

                // Отдых
                ? <NextStageRecovery element={element} changeStage={changeStage} minutes={minutes} deleteStage={deleteStage}
                                    isAdmin={isAdmin} prev={prev} />
                : null
            }

            {element.isWarmUp

                // Разминка
                ? <NextStageWarmUp element={element} changeStage={changeStage} minutes={minutes} deleteStage={deleteStage}
                                      isAdmin={isAdmin} prev={prev} />
                : null
            }

            {!element.isWarmUp && !element.isRecovery

                // Тренировка
                ? <NextStageWorkout element={element} changeStage={changeStage} minutes={minutes} condition={condition} deleteStage={deleteStage}
                                    isAdmin={isAdmin} prev={prev} />
                : null
            }



        </>
    );
};