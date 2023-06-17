import axios from "axios";
import {Workout, WorkoutType} from "../types/workout";

const instance = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_BACK_URL,
})

const token = localStorage.getItem("token")

export const authAPI = {
    trainerAuth: async (login: string, password: string) => {
        try {
            const {data} = await instance.post(`auth/trainer-login`, {login, password})
            return data
        } catch (err) {
            console.log(err)
        }
    }
}


export const workoutAPI = {
    getWorkout: async (workout_id: string) => {
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

    updateWorkout: async (workout: WorkoutType[], workout_id: string) => {
        try {
            return await instance.put('workout/update-workout', {workout}, {headers: {workout_id}})
        } catch (err) {
            console.log(err)
        }
    },

    getUpdatedWorkout: async (workout_id: number) => {
        try {
            const {data} = await instance.get('workout/get-update-workout', {headers: {workout_id}})
            return data
        } catch (err) {
            console.log(err)
        }
    },

    getAllWorkouts: async () => {
        try {
             const {data} = await instance.get('workout/get-all-user-workout', {headers: {token}})
            return data
        } catch(err) {
            console.log(err)
        }
    },

    createNewWorkout: async (workout_name: string) => {
        try {
            const {data} = await instance.post('workout/create-workout', {workout_name}, {headers: {token}})
            return data
        } catch (err) {
            console.log(err)
        }
    },

    setActiveWorkout: async (workout_id: string) => {
        try {
            const {data} = await instance.post('workout/set-active-workout', {workout_id}, {headers: {token}})
            return data
        } catch (err) {
            console.log(err)
        }
    },

    getActiveWorkout: async () => {
        try {
            const {data} = await instance.get('workout/get-active-workout', {headers: {token}})
            return data
        } catch (err) {
            console.log(err)
        }
    }
}