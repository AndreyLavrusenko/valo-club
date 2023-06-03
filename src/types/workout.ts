export type Workout = {
    id: number,
    is_start: number,
    workout: WorkoutType[],
    time_start: number,
    trainer_id?: number
}


export type WorkoutType = {
    id: number,
    time: number,
    pulse: number,
    turns: number,
    condition: string
}

