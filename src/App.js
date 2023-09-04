import React from 'react';
import "./assets/scss/shared.scss"
import roboticsLogo from "./assets/images/robotics_logo.svg"
import RegisterBox from "./components/registerBox"
import SignInBox from "./components/signInBox"
import SignedInList from "./components/signedInList"
import {getAllSignedIn, getDateTime, signOut, signOutMultiple, getTodaysDate, formatRow} from "./components/gsheetsApi"


export default class App extends React.Component {
    constructor() {
        super()

        this.state = {currentlySignedIn: [], pendingSignIn:[], pendingSignOut: [], isOnline: window.navigator.onLine}

        this.updateSignedIn = this.updateSignedIn.bind(this)
        this.addNewLocalSignIn = this.addNewLocalSignIn.bind(this)
        this.handleSignOut = this.handleSignOut.bind(this)
        this.handleMultiSignOut = this.handleMultiSignOut.bind(this)
        this.checkIfSignedInTooLong = this.checkIfSignedInTooLong.bind(this)
    }

    async checkIfSignedInTooLong() {
        const peopleToSignOut = []
        
        for (let row of this.state.currentlySignedIn) {
            if (new Date(row["Date"]) < getTodaysDate()) {
                peopleToSignOut.push(row["ID"])
            }
        }
        
        if (peopleToSignOut.length > 0) {
            await signOutMultiple(peopleToSignOut, peopleToSignOut.map(() => "18:00"))
        
            let currentlySignedIn = this.state.currentlySignedIn.map(v => {
                if (peopleToSignOut.includes(v.ID)) {
                    return {...v, pending: true}
                } else {
                    return v
                }
            })
        
            let pendingSignOut = this.state.pendingSignOut.concat(peopleToSignOut)
    
            this.setState({pendingSignOut, currentlySignedIn})
            setTimeout(this.updateSignedIn, 3000)
        }
        
        console.log("Check logged in", getDateTime(), peopleToSignOut, this.state.currentlySignedIn)
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
            let signedInIDs = currentlySignedIn.map((v) => {
                let person = formatRow(v);
                return person.ID;
            });
            
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
            
            this.setState({currentlySignedIn, pendingSignIn, pendingSignOut}, () => {
                if (!this.notFirstRefresh) {
                    this.checkIfSignedInTooLong()
                    setInterval(this.checkIfSignedInTooLong, 3600000) // repeats every hour
                }
            })

            this.notFirstRefresh = true
        })
    }

    addNewLocalSignIn(Name,  ID) {
        let [Date, Time] = getDateTime()
        this.setState({pendingSignIn: this.state.pendingSignIn.concat([{Name, Time, Date, ID, pending: true}])})
    }

    handleSignOut(ID) {
        let currentlySignedIn = this.state.currentlySignedIn.map(v => {
            let row = formatRow(v);
            if (row.ID === ID) {
                return {...row, pending: true}
            } else {
                return row
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