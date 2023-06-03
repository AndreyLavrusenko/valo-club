import axios from "axios";

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
    }
}