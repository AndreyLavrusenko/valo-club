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
    comment?: string,
    isRecovery: boolean,
    isWarmUp: boolean,
    minutes?: string,
    seconds?: string
}


export type WorkoutCatalogs = {
    id: string,
    is_start: number,
    active_stage: number,
    workout_name: string,
}


export type Club = {
    "id": string,
    "name": string,
    "owner": string,
    "privacy": string,
    "members": string,
    "request": string
}


export type User = {
    name: string,
    clubs: ClubInfo[]
}


export type ClubInfo = {
    id: string,
    name: string
}