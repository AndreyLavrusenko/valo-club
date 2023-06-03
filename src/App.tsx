import React, {useEffect, useState} from "react";

import "./style/layout/main.scss";

import {TrainingUser} from "./page/TrainingUser";
import {Header} from "./component/Header";
import {NavBar} from "./component/NavBar";
import {Route, Routes} from "react-router-dom";
import {LoginTrainer} from "./page/LoginTrainer";
import {TrainerAdmin} from "./page/TrainerAdmin";

function App() {
    const [isTrainer, setIsTrainer] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setIsTrainer(true)
        }
    }, []);


    return (
        <div>
            <Header isTrainer={isTrainer} setIsTrainer={setIsTrainer}/>
            <Routes>
                <Route path="/" element={<TrainingUser />} />
                <Route path="/trainer" element={<TrainerAdmin />} />
                <Route path="/login" element={<LoginTrainer setIsTrainer={setIsTrainer} />} />
            </Routes>

            {/*<NavBar />*/}
        </div>
    );
}

export default App;
