import React from 'react'
import "./../assets/scss/shared.scss"
import Button from "./button"
import {formatRow} from "./gsheetsApi"

export default class SignedInList extends React.Component {
    constructor(props) {
        super(props)

        this.lastMouseDown = null
        this.state = {}

        this.handleMultiSignOutClick = this.handleMultiSignOutClick.bind(this)
        this.setLastMouseDown = this.setLastMouseDown.bind(this)
    }

    handleMultiSignOutClick(e) {
        if (e.timeStamp - this.lastMouseDown > 500) {
            if (this.props.signedIn.filter(v => !v.pending).length > 0) {
                this.props.multiSignOut(this.props.signedIn.filter(v => !v.pending).map(v => v.ID))
            } else {
                console.log("no one is logged in")
            }
        } else {
            console.log("NO")
        }
    }

    setLastMouseDown(e) {
        this.lastMouseDown = e.timeStamp
    }

    render() {
        return (
            <>
                <div className="separator bold">{this.props.signedIn.length} Currently Signed In</div>
                <ul className="series">
                    <li className="bold signed-in-list-item">
                        <h2>Date</h2>
                        <h2>Time In</h2>
                        <h2>Name</h2>
                        <Button smallBtn onMouseUp={this.handleMultiSignOutClick} onMouseDown={this.setLastMouseDown}>
                            Sign Out All
                        </Button>
                    </li>
                    {this.props.signedIn.length > 0 ? (
                        this.props.signedIn.map((log) => {
                            let info = formatRow(log);
                            return <SignedInItem data={info} onSignedOutBtn={() => this.props.signOut(info.ID)} key={info.ID} />;
                        })
                    ) : (
                        <li className="flex-center">
                            <h3>No one is signed in</h3>
                        </li>
                    )}
                </ul>
            </>
        );
    }
}

const SignedInItem = ({data, onSignedOutBtn}) => (
    <li className="signed-in-list-item">
        <p>{data.Date}</p>
        <p>{data.Time}</p>
        <p>{data.Name}</p>
        {!data.pending? <Button smallBtn onClick={onSignedOutBtn}>Sign Out</Button> : <div className="small-loader" />}
    </li>
)