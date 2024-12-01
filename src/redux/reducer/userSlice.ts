import {createSlice} from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: "user",
    initialState: {
        isAuth: false,
        token: "",
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.isAuth = true;
            state.token = action.payload
        },
        logoutSuccess: (state) => {
            state.isAuth = false
            state.token = ""
        }
    }
})

export const {
    loginSuccess,
    logoutSuccess
} = userSlice.actions;

export default userSlice.reducer;