import React from 'react';
import "./assets/scss/shared.scss"
import roboticsLogo from "./assets/images/robotics_logo.svg"
import RegisterBox from "./components/registerBox"
import ClockInBox from "./components/clockInBox"
import ClockedInList from "./components/clockedInList"
import {getAllClockedIn} from "./components/gsheetsApi"


export default class App extends React.Component {
    constructor() {
        super()

        this.state = {currentlyClockedIn: []}

        this.updateClockedIn = this.updateClockedIn.bind(this)
    }

    componentDidMount() {
        this.updateClockedIn()
    }

    updateClockedIn() {
        console.log("UPDATE")
        getAllClockedIn().then(currentlyClockedIn => this.setState({currentlyClockedIn}))
    }

    render() {
        return (
            <div className="col flex-center">
                <div className="row" id="header">
                    <h1 className="title">Titan Robotics Hour Logging</h1>
                    <img id="logo" src={roboticsLogo} alt="<Robotics logo>"/>
                </div>
                <div className="separator bold">Clock In or Register</div>
                <ClockInBox updateFunc={this.updateClockedIn}/>
                <h2 className="no-bold">or</h2>
                <RegisterBox/>
                <div className="separator bold">Currently Clocked In</div>
                <ClockedInList clockedIn={this.state.currentlyClockedIn} updateFunc={this.updateClockedIn} />
            </div>
        )
    }
}