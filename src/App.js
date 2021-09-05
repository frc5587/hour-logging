import React from 'react';
import "./assets/scss/shared.scss"
import roboticsLogo from "./assets/images/robotics_logo.svg"
import RegisterBox from "./components/registerBox"
import SignInBox from "./components/signInBox"
import SignedInList from "./components/signedInList"
import {getAllSignedIn} from "./components/gsheetsApi"


export default class App extends React.Component {
    constructor() {
        super()

        this.state = {currentlySignedIn: []}

        this.updateSignedIn = this.updateSignedIn.bind(this)
    }

    componentDidMount() {
        this.updateSignedIn()
    }

    updateSignedIn() {
        console.log("UPDATE")
        getAllSignedIn().then(currentlySignedIn => this.setState({currentlySignedIn}))
    }

    render() {
        return (
            <div className="col flex-center">
                <div className="row" id="header">
                    <h1 className="title">Titan Robotics Hour Logging</h1>
                    <img id="logo" src={roboticsLogo} alt="<Robotics logo>"/>
                </div>
                <div className="separator bold">Sign In or Register</div>
                <SignInBox updateFunc={this.updateSignedIn}/>
                <h2 className="no-bold">or</h2>
                <RegisterBox/>
                <div className="separator bold">Currently Signed In</div>
                <SignedInList signedIn={this.state.currentlySignedIn} updateFunc={this.updateSignedIn} />
            </div>
        )
    }
}