import axios from "axios";
import {Workout, WorkoutType} from "../types/workout";

const instance = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_BACK_URL,
})

export const authAPI = {
    trainerAuth: async (login: string) => {
        try {
            const {data} = await instance.get(`auth/trainer-login`, {headers: {login}})
            return data
        } catch (err) {
            console.log(err)
        }
    }
}


export const workoutAPI = {
    getWorkout: async (workout_id: number) => {
        try {
            const {data} = await instance.get('workout/get-workout', {headers: {workout_id}})
            return data
        } catch (err) {
            console.log(err)
        }
    },

    getWorkoutInterval: async (workout_id: number) => {
        try {
            const {data} = await instance.get('workout/get-workout-info', {headers: {workout_id}})
            return data
        } catch (err) {
            console.log(err)
        }
    },

    startWorkout: async (workout_id: number) => {
        try {
            return await instance.put('workout/start-workout', {}, {headers: {workout_id}})
        } catch (err) {
            console.log(err)
        }
    },

    resetWorkout: async (workout_id: number) =>  {
        try {
            return await instance.put('workout/reset-workout', {}, {headers: {workout_id}})
        } catch (err) {
            console.log(err)
        }
    },

    goToTheNextStage: async (workout_id: number, current_stage: number) =>  {
        try {
            return await instance.put('workout/go-next-stage', {current_stage}, {headers: {workout_id}})
        } catch (err) {
            console.log(err)
        }
    },

    getTimeStart: async (workout_id: number) => {
        try {
            const {data} = await instance.get('workout/get-start-time', {headers: {workout_id}})
            return data
        } catch (err) {
            console.log(err)
        }
    },

    updateWorkout: async (workout: WorkoutType[], workout_id: number) => {
        try {
            return await instance.put('workout/update-workout', {workout}, {headers: {workout_id}})
        } catch (err) {
            console.log(err)
        }
    }
}