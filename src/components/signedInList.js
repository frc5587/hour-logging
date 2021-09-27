import React from 'react'
import "./../assets/scss/shared.scss"
import Button from "./button"
import {signOut} from "./gsheetsApi"

export default class SignedInList extends React.Component {
    constructor(props) {
        super(props)

        this.signOut = this.signOut.bind(this)
        this.state = {}
    }

    signOut(id) {
        for (let i = 0; i < this.props.signedIn.length; i++) {
            if (this.props.signedIn[i].ID === id) {
                this.props.signedIn[i]._pendingOut = true
                break
            }
        }
        this.setState({})
        console.log(id)
        signOut(id).then(this.props.updateFunc)/* .then(() => {
            setTimeout(() => {
                let pendingOut = this.state.pendingOut
                pendingOut.splice(this.state.pendingOut.indexOf(id), 1)
                this.setState({pendingOut})
            }, 10000)
        }) */
    }

    render() {
        console.log(this.props.signedIn)
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
                    this.props.signedIn.map(log => <SignedInItem data={log} onSignedOutBtn={() => this.signOut(log.ID)} key={log.Name}/>) : 
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
        {!data._pendingOut? <Button smallBtn onClick={onSignedOutBtn}>Sign Out</Button> : ""}
        {/* {console.log(data.Name, pendingOutList.includes(data.ID))} */}
    </li>
)