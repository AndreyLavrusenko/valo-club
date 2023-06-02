import React from 'react';
import {TrainingUser} from "./page/TrainingUser";
import './style/components/main.scss'
import {CurrentStage} from "./component/CurrentStage";

function App() {
    return (
        <div>
            <TrainingUser />
            <main>
                <CurrentStage />
            </main>
        </div>
    );
}

export default App;
