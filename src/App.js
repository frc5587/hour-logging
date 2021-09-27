import React from 'react';
import "./assets/scss/shared.scss"
import roboticsLogo from "./assets/images/robotics_logo.svg"
import RegisterBox from "./components/registerBox"
import SignInBox from "./components/signInBox"
import SignedInList from "./components/signedInList"
import {getAllSignedIn, getDateTime, signOut, signOutMultiple} from "./components/gsheetsApi"


export default class App extends React.Component {
    constructor() {
        super()

        this.state = {currentlySignedIn: [], pendingSignIn:[], pendingSignOut: [], isOnline: window.navigator.onLine}

        this.updateSignedIn = this.updateSignedIn.bind(this)
        this.addNewLocalSignIn = this.addNewLocalSignIn.bind(this)
        this.handleSignOut = this.handleSignOut.bind(this)
        this.handleMultiSignOut = this.handleMultiSignOut.bind(this)
    }

    componentDidMount() {
        setTimeout(this.updateSignedIn, 500);

        window.addEventListener('offline', () => this.onlineChangeHandler(false));
        window.addEventListener('online', () => this.onlineChangeHandler(true));
    }

    onlineChangeHandler(isOnline) {
        this.setState({isOnline: isOnline})
    }

    updateSignedIn() {
        getAllSignedIn().then(currentlySignedIn => {
            let pendingSignIn = []
            let signedInIDs = currentlySignedIn.map(v => v.ID)

            for (let {ID} of this.state.pendingSignIn) {
                if (!signedInIDs.includes(ID)) {
                    pendingSignIn.push(ID)
                }
            }

            let pendingSignOut = []
            for (let ID in this.state.pendingSignOut) {
                if (signedInIDs.includes(ID)) {
                    pendingSignOut.push(ID)
                    let idx = signedInIDs.indexOf(ID)
                    let member = currentlySignedIn[idx]
                    currentlySignedIn[idx] = {...member, pending: true}
                }
            }
            this.setState({currentlySignedIn, pendingSignIn, pendingSignOut})
        })
    }

    addNewLocalSignIn(Name,  ID) {
        let [Date, Time] = getDateTime()
        this.setState({pendingSignIn: this.state.pendingSignIn.concat([{Name, Time, Date, ID, pending: true}])})
    }

    handleSignOut(ID) {
        let currentlySignedIn = this.state.currentlySignedIn.map(v => {
            if (v.ID === ID) {
                return {...v, pending: true}
            } else {
                return v
            }
        })

        this.setState({currentlySignedIn, pendingSignOut: this.state.pendingSignOut.concat(ID)})
        signOut(ID).then(this.updateSignedIn)
    }

    handleMultiSignOut(IDs) {
        let currentlySignedIn = this.state.currentlySignedIn.map(v => {
            if (IDs.includes(v.ID)) {
                return {...v, pending: true}
            } else {
                return v
            }
        })

        this.setState({currentlySignedIn, pendingSignOut: this.state.pendingSignOut.concat(IDs)})
        signOutMultiple(IDs).then(this.updateSignedIn)
    }

    render() {
        if (this.state.isOnline) {
            return (
                <div className="col flex-center">
                    <div className="row" id="header">
                        <h1 className="title">Titan Robotics Hour Logging</h1>
                        <img id="logo" src={roboticsLogo} alt="<Robotics logo>"/>
                    </div>
                    <div className="separator bold">Sign In or Register</div>
                    <SignInBox localSignInFunc={this.addNewLocalSignIn} updateFunc={this.updateSignedIn} signedIn={this.state.currentlySignedIn.concat(this.state.pendingSignIn)}/>
                    <h2 className="no-bold">or</h2>
                    <RegisterBox />
                    <SignedInList multiSignOut={this.handleMultiSignOut} signOut={this.handleSignOut} signedIn={this.state.currentlySignedIn.concat(this.state.pendingSignIn)} updateFunc={this.updateSignedIn} />
                </div>
            )
        } else {
            return (
                <div className="col flex-center">
                    <h2 className="bold">Waiting for internet connection...</h2>
                    <div className="loader"></div>
                </div>
            )
        }
    }
}