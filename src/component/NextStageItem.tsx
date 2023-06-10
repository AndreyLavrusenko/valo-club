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
    deleteStage?: (id: number) => number,
    notLastChild?: boolean
}

export const NextStageItem = ({element, isAdmin, deleteStage, notLastChild}: IProps) => {

    // @ts-ignore
    const condition = CONDITION_TYPE[element.condition];

    const minutes = millisToMinutesAndSeconds(element.time);

    return (
        <>
            {element.isRecovery

                // Отдых
                ? <NextStageRecovery element={element} minutes={minutes} deleteStage={deleteStage}
                                     notLastChild={notLastChild} isAdmin={isAdmin}/>
                : null
            }

            {element.isWarmUp

                // Разминка
                ? <NextStageWarmUp element={element} minutes={minutes} deleteStage={deleteStage}
                                     notLastChild={notLastChild} isAdmin={isAdmin}/>
                : null
            }

            {!element.isWarmUp && !element.isRecovery

                // Тренировка
                ? <NextStageWorkout element={element} minutes={minutes} condition={condition} deleteStage={deleteStage}
                                    notLastChild={notLastChild} isAdmin={isAdmin}/>
                : null
            }



        </>
    );
};