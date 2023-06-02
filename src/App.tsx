import React from 'react';

import './style/components/main.scss'

import {TrainingUser} from "./page/TrainingUser";
import {Header} from "./component/Header";
import {NavBar} from "./component/NavBar";

function App() {
    return (
        <div>
            <Header />
            <TrainingUser />

            {/*<NavBar />*/}
        </div>
    );
}

export default App;
