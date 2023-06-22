import React, {useEffect, useState} from "react";

import "./style/layout/main.scss";

import {TrainingUser} from "./page/TrainingUser";
import {Header} from "./component/Header";
import {NavBar} from "./component/NavBar";
import {Route, Routes, useNavigate} from "react-router-dom";
import {LoginTrainer} from "./page/LoginTrainer";
import {CreateWorkout} from "./page/CreateWorkout";
import {RegistrationTrainer} from "./page/RegistrationTrainer";
import {Profile} from "./page/Profile";
import {useAppDispatch, useAppSelector} from "./hook/redux";
import {loginSuccess} from "./redux/reducer/userSlice";
import {WorkoutCatalog} from "./page/WorkoutCatalog";

function App() {
    const dispatch = useAppDispatch()
    const {isAuth} = useAppSelector(store => store.user)

    const navigation = useNavigate()

    console.log(isAuth)

    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(loginSuccess())
            window.location.reload()
        } else {
            navigation('/login')
        }
    }, [isAuth]);


    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<TrainingUser />} />
                <Route path="/create-workout/:id" element={<CreateWorkout />} />
                <Route path="/login" element={<LoginTrainer />} />
                <Route path="/registration" element={<RegistrationTrainer />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/catalog" element={<WorkoutCatalog />} />
            </Routes>

            <NavBar />
        </div>
    );
}

export default App;
