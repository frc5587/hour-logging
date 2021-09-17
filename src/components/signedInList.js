import React from 'react'
import "./../assets/scss/shared.scss"
import Button from "./button"
import {signOut} from "./gsheetsApi"

export default class SignedInList extends React.Component {
    constructor(props) {
        super(props)

        this.signOut = this.signOut.bind(this)
        this.state = {pendingOut: []}
    }

    signOut(id) {

        this.setState({pendingOut: [...this.state.pendingOut, id]})
        signOut(id).then(this.props.updateFunc).then(() => {this.setState({pendingOut: this.state.pendingOut.splice(this.state.pendingOut.indexOf(id), 1)})})
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
                    this.props.signedIn.map(log => <SignedInItem data={log} onSignedOutBtn={() => this.signOut(log.ID)} pendingOutList={this.state.pendingOut} key={log.Name}/>) : 
                        <li className="flex-center"><h3>No one is signed in</h3></li>
                }
            </ul>
        )
    }
}

const SignedInItem = ({data, onSignedOutBtn, pendingOutList}) => (
    <li className="signed-in-list-item">
        <p>{data.Date}</p>
        <p>{data.Time}</p>
        <p>{data.Name}</p>
        {!pendingOutList.includes(data.ID)? <Button smallBtn onClick={onSignedOutBtn}>Sign Out</Button> : ""}
    </li>
)