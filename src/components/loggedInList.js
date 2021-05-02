import React from 'react'
import "./../assets/scss/shared.scss"
import Button from "./button"

export default class LoggedInList extends React.Component {
    constructor() {
        super()

        this.state = {loggedIn: []}

        this.logOut = this.logOut.bind(this)
    }

    logOut(sid) {

    }

    render() {
        return (
            <ul className="series">
                <li className="bold logged-in-list-item">
                    <h2>Date</h2>
                    <h2>Time</h2>
                    <h2>Name</h2>
                    <h2>Log Out</h2>
                </li>
                {
                    this.state.loggedIn.length > 0? 
                    this.state.loggedIn.map(log => <LoggedInItem data={log} onLogOutBtn={() => this.logOut(log[3])}/>) : 
                        <li className="flex-center"><h3>No one is logged in</h3></li>
                }
            </ul>
        )
    }
}

const LoggedInItem = ({data, onLogOutBtn}) => (
    <li className="logged-in-list-item">
        <p>{data[0]}</p>
        <p>{data[1]}</p>
        <p>{data[2]}</p>
        <button className="btn btn-primary" onClick={onLogOutBtn}>Log Out</button>
    </li>
)