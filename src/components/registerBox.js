import React from 'react'
import "./../assets/scss/shared.scss"
import Button from "./button"
import {registerMember} from "./gsheetsApi"

export default class RegisterBox extends React.Component {
    constructor() {
        super()

        this.state = {nameValue: "", idValue: "", error: false}

        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleIdChange = this.handleIdChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    handleNameChange(event) {
        this.setState({nameValue: event.target.value})
    }
    
    handleIdChange(event) {
        this.setState({idValue: event.target.value})
    }

    handleClick() {
        if (this.state.nameValue === "" || this.state.idValue === "") {
            this.setState({error: true})
        } else {
            this.setState({error: false})
            registerMember(this.state.nameValue, this.state.idValue).then(updated => updated ? this.clearValues() : null)
        }
    }

    clearValues() {
        this.setState({nameValue: "", idValue: ""})
    }

    render() {
        return (
            <>
                <div className="row row-input">
                    <input type="text" placeholder="Name" value={this.state.nameValue} onChange={this.handleNameChange}/>
                    <input type="number" placeholder="School ID" value={this.state.idValue} onChange={this.handleIdChange}/>
                    <Button onClick={this.handleClick}>Register</Button>
                </div>
                {this.state.error ? <h3 className="error">Error: Invalid input</h3> : ""}
            </>
        )
    }
}