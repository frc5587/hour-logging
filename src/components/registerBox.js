import React from 'react'
import "./../assets/scss/shared.scss"
import Button from "./button"
import {registerMember} from "./gsheetsApi"

export default class RegisterBox extends React.Component {
    constructor() {
        super()

        this.state = {nameValue: "", idValue: "", error: ""}

        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleIdChange = this.handleIdChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
    }

    handleNameChange(event) {
        this.setState({nameValue: event.target.value})
    }
    
    handleIdChange(event) {
        this.setState({idValue: event.target.value})
    }

    handleKeyPress(event) {
        if (event.key === "Enter") {
            this.handleClick()
            event.target.blur()
        }
    }

    handleClick() {
        if (this.state.nameValue === "" || this.state.idValue === "") {
            this.setState({error: "Invalid input"})
        } else {
            this.setState({error: ""})
            this.clearValues()
            registerMember(this.state.nameValue, this.state.idValue).then(updated => updated ? null : this.setState({error: "Duplicate Member Entry"}))
        }
    }

    clearValues() {
        this.setState({nameValue: "", idValue: ""})
    }

    render() {
        return (
            <>
                <div className="row row-input">
                    <input type="text" placeholder="Name" value={this.state.nameValue} onChange={this.handleNameChange} onKeyPress={this.handleKeyPress}/>
                    <input type="number" placeholder="School ID" value={this.state.idValue} onChange={this.handleIdChange} onKeyPress={this.handleKeyPress}/>
                    <Button onClick={this.handleClick}>Register</Button>
                </div>
                {this.state.error ? <h3 className="error">Error: {this.state.error}</h3> : ""}
            </>
        )
    }
}