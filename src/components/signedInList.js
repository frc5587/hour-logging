import React from 'react'
import "./../assets/scss/shared.scss"
import Button from "./button"
import {signOut} from "./gsheetsApi"

export default class SignedInList extends React.Component {
    constructor(props) {
        super(props)

        this.signOut = this.signOut.bind(this)
    }

    signOut(id) {
        signOut(id).then(this.props.updateFunc)
    }

    render() {
        return (
            <ul className="series">
                <li className="bold signed-in-list-item">
                    <h2>Date</h2>
                    <h2>Time In</h2>
                    <h2>Name</h2>
                    <h2>Sign Out</h2>
                </li>
                {
                    this.props.signedIn.length > 0? 
                    this.props.signedIn.map((log, i) => <SignedInItem data={log} onSignedOutBtn={() => this.signOut(log.ID)} key={i}/>) : 
                        <li className="flex-center"><h3>No one is signed in</h3></li>
                }
            </ul>
        )
    }
}

const SignedInItem = ({data, onSignedOutBtn}) => (
    <li className="signed-in-list-item">
        <p>{data.Date}</p>
        <p>{data.Time}</p>
        <p>{data.Name}</p>
        <Button smallBtn onClick={onSignedOutBtn}>Sign Out</Button>
    </li>
)