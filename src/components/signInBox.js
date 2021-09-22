import React from 'react'
import "./../assets/scss/shared.scss"
import Button from "./button"
import {getAllMembers, signIn} from "./gsheetsApi"

export default class SignInBox extends React.Component {
    constructor(props) {
        super(props)

        this.state = {nameIdValue: "", autocompleteValue: "", currentMember: null, possibleMembers: [], memberData: [], showDropDown: false, error: "", success_txt: ""}

        this.inputRef = React.createRef();
        this.handleTextChange = this.handleTextChange.bind(this)
        this.openDropDown = this.openDropDown.bind(this)
        this.closeDropDown = this.closeDropDown.bind(this)
        this.handleSignInClick = this.handleSignInClick.bind(this)
        this.handleDropDownItemClick = this.handleDropDownItemClick.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)

        getAllMembers().then(memberData => {this.setState({memberData});this.updateDropDown(this.state.nameIdValue)})
    }

    handleTextChange(event) {
        let text = event.target.value
        this.setState({nameIdValue: text})
        this.updateDropDown(text)

        if (text === "") {  // if input is blank, clear error message (if it exists)
            this.setState({error: ""})
            this.closeDropDown(true)
        } else {
            this.openDropDown()
        }

        if (this.state.success_txt) {
            this.setState({success_txt: ""})
        }
    }

    format(member, reverse=false) {
        if (!reverse) {
            return `${member.Name} | ${member.ID}`
        } else {
            return `${member.ID} | ${member.Name}`
        }
    }

    updateDropDown(text) {
        if (text === "") {
            this.setState({possibleMembers: this.state.memberData, currentMember: null, autocompleteValue: ""})
        } else {
            let lowerText = text.toLowerCase()
            let possibleMembers = []
            let autocompleteValue =  ""
            let currentMember = null

            for (let member of this.state.memberData) {
                let [fwd, rvs] = [this.format(member), this.format(member, true)]
                let cor = ""

                if (lowerText.length <= fwd.length) {
                    if (lowerText === fwd.slice(0, lowerText.length).toLowerCase()) {
                        possibleMembers.push(member)
                        cor = fwd
                        
                    } else if (lowerText === rvs.slice(0, lowerText.length).toLowerCase()) {
                        possibleMembers.push(member)
                        cor = rvs
                    }

                    if (possibleMembers.length === 1 && cor) {
                        autocompleteValue = text + cor.slice(text.length)
                        currentMember = member
                    }
                } 
            }

            this.setState({possibleMembers, currentMember, autocompleteValue})
        }
    }

    openDropDown() {
        this.setState({showDropDown: true})
        getAllMembers().then(memberData => {this.setState({memberData});this.updateDropDown(this.state.nameIdValue)})
    }

    closeDropDown(noDelay=false) {
        if (noDelay) {
            this.setState({showDropDown: false})
        } else {
            // delay so that when someone clicks on the drop down menu it doesn't immediately close
            // instead, it can now process their input
            setTimeout(() => this.setState({showDropDown: false}), 400)
        }
    }

    handleSignInClick() {
        this.closeDropDown()
        if (this.state.currentMember) {
            let member = this.state.currentMember

            signIn(member.ID)
            this.changeInputTextTo("")
            this.setState({success_txt: `Log in Successful: ${member.Name}`})
            setTimeout(this.props.updateFunc, 3000)
        } else if (this.state.nameIdValue !== "") {
            this.setState({error: "Unknown Member"})
        }
    }

    handleDropDownItemClick(memberData) {
        this.changeInputTextTo(this.format(memberData))
        setTimeout(this.handleSignInClick, 500)  // delay to allow state to update
    }

    handleKeyPress(event) {
        if (event.key === "Enter") {
            if (this.state.currentMember) {
                this.changeInputTextTo(this.format(this.state.currentMember))
            }
            this.handleSignInClick()
        }
    }

    changeInputTextTo(newText) {
        this.handleTextChange({target: {value: newText}})
    }

    render() {
        var [x, y, width] = [-10000, -10000, 0]
        if (this.inputRef.current !== null) {
            x = this.inputRef.current.offsetLeft
            y = this.inputRef.current.offsetTop
            width = this.inputRef.current.scrollWidth
        }

        return (
            <>
                <div className="row row-input pos-relative">
                    <input type="text" placeholder="Name or ID" autoFocus="autofocus" style={{zIndex: 100, width: "40vw"}} spellCheck="false" value={this.state.nameIdValue} onChange={this.handleTextChange} ref={this.inputRef} onBlur={() => {this.closeDropDown()}} onKeyPress={this.handleKeyPress} />
                    <Button onClick={this.handleSignInClick}>Sign In</Button>
                    {this.state.showDropDown ? 
                        <div className="drop-down" style={{transform: `translate(${x}px, ${y}px)`, width: `${width}px`}}>
                            <p className="autocomplete">{this.state.autocompleteValue}</p>
                            <DropDown data={this.state.possibleMembers} onItemClick={this.handleDropDownItemClick} format={this.format}/>
                        </div> :
                        ""}
                </div>
                {this.state.error ? <h3 className="error">Error: {this.state.error}</h3> : ""}
                {this.state.success_txt ? <h3 className="success">{this.state.success_txt}</h3> : ""}
            </>
        )
    }
}

function DropDown ({data, onItemClick, format}) {
    if (data.length > 0) {
        return (
            <ul className="drop-down-box" tabIndex="0">
                {data.map((member, i) => <li key={i}><p onClick={() => onItemClick(member)}>{format(member)}</p></li>)}
            </ul>
        )
    } else {
        return ""
    }

}