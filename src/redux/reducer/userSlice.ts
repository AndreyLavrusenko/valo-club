import {createSlice} from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: "user",
    initialState: {
        isAuth: false
    },
    reducers: {
        loginSuccess: (state) => {
            state.isAuth = true;
        },
        logoutSuccess: (state) => {
            state.isAuth = false
        }
    }
})

export const {
    loginSuccess,
    logoutSuccess
} = userSlice.actions;

export default userSlice.reducer;