export type Workout = {
    id: number,
    is_start: number,
    workout: WorkoutType[],
    time_start: number,
    time_current: number,
    active_stage: number,
    trainer_id?: number
}


export type WorkoutType = {
    id: number,
    time: number,
    pulse_1?: string,
    pulse_2?: number,
    turns_1?: number,
    turns_2?: number,
    condition?: string,
    isRecovery: boolean,
}