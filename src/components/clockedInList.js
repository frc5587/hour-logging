import React from 'react'
import "./../assets/scss/shared.scss"
import Button from "./button"
import {clockOut} from "./gsheetsApi"

export default class ClockedInList extends React.Component {
    constructor(props) {
        super(props)

        this.clockOut = this.clockOut.bind(this)
    }

    clockOut(id) {
        clockOut(id).then(this.props.updateFunc)
    }

    render() {
        return (
            <ul className="series">
                <li className="bold clocked-in-list-item">
                    <h2>Date</h2>
                    <h2>Time In</h2>
                    <h2>Name</h2>
                    <h2>Clock Out</h2>
                </li>
                {
                    this.props.clockedIn.length > 0? 
                    this.props.clockedIn.map(log => <ClockedInItem data={log} onClockOutBtn={() => this.clockOut(log.ID)}/>) : 
                        <li className="flex-center"><h3>No one is clocked in</h3></li>
                }
            </ul>
        )
    }
}

const ClockedInItem = ({data, onClockOutBtn}) => (
    <li className="clocked-in-list-item">
        <p>{data.Date}</p>
        <p>{data.Time}</p>
        <p>{data.Name}</p>
        <Button smallBtn onClick={onClockOutBtn}>Clock Out</Button>
    </li>
)