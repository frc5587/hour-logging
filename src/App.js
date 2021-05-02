import React from 'react';
import "./assets/scss/shared.scss"
import roboticsLogo from "./assets/images/robotics_logo.svg"
import RegisterBox from "./components/registerBox"
import LogInBox from "./components/logInBox"
import LoggedInList from "./components/loggedInList"


const App = () => (
    <div className="col flex-center">
        <div className="row" id="header">
            <h1 className="title">Titan Robotics Hour Logging</h1>
            <img id="logo" src={roboticsLogo} alt="<Robotics logo>"/>
        </div>
        <div className="separator bold">Sign In or Register</div>
        <LogInBox />
        <h2 className="no-bold">or</h2>
        <RegisterBox/>
        <div className="separator bold">Currently Logged In</div>
        <LoggedInList />
    </div>
)

export default App