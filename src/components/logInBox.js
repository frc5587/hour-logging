import React from 'react'
import "./../assets/scss/shared.scss"
import Button from "./button"

export default class LoginBox extends React.Component {
    constructor() {
        super()

        this.state = {nameIdValue: ""}

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        this.setState({nameIdValue: event.target.value})
    }

    render() {
        return (
            <div className="row row-input">
                <input type="text" placeholder="Name or ID" autoFocus="autofocus" value={this.state.nameIdValue} onChange={this.handleChange}/>
                <Button>Sign In</Button>
            </div>
        )
    }
}