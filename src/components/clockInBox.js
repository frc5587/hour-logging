import React from 'react'
import "./../assets/scss/shared.scss"
import Button from "./button"
import {getAllMembers, clockIn} from "./gsheetsApi"

export default class ClockInBox extends React.Component {
    constructor(props) {
        super(props)

        this.state = {nameIdValue: "", autocompleteValue: "", currentMember: null, possibleMembers: [], memberData: [], showDropDown: false, error: ""}

        this.inputRef = React.createRef();
        this.handleTextChange = this.handleTextChange.bind(this)
        this.openDropDown = this.openDropDown.bind(this)
        this.closeDropDown = this.closeDropDown.bind(this)
        this.handleClockInClick = this.handleClockInClick.bind(this)
        this.handleDropDownItemClick = this.handleDropDownItemClick.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
    }

    handleTextChange(event) {
        let text = event.target.value
        this.setState({nameIdValue: text})
        this.updateDropDown(text)

        if (text === "") {  // if input is blank, clear error message (if it exists)
            this.setState({error: ""})
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

    closeDropDown() {
        // delay so that when someone clicks on the drop down menu it doesn't immediately close
        // instead, it can now process their input
        setTimeout(() => this.setState({showDropDown: false}), 500)
    }

    handleClockInClick() {
        this.closeDropDown()
        console.log(this.state)
        if (this.state.currentMember) {
            clockIn(this.state.currentMember.ID)
            this.changeInputTextTo("")
            setTimeout(this.props.updateFunc, 3000)
        } else if (this.state.nameIdValue !== "") {
            this.setState({error: "Unrecognized Member"})
        }
    }

    handleDropDownItemClick(memberData) {
        this.changeInputTextTo(this.format(memberData))
        setTimeout(this.handleClockInClick, 500)  // delay to allow state to update
    }

    handleKeyPress(event) {
        if (event.key === "Enter") {
            if (this.state.currentMember) {
                this.changeInputTextTo(this.format(this.state.currentMember))
            }
            this.handleClockInClick()
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
                    <input type="text" placeholder="Name or ID" autoFocus="autofocus" style={{zIndex: 100, width: "25vw"}} spellCheck="false" value={this.state.nameIdValue} onChange={this.handleTextChange} ref={this.inputRef} onFocus={this.openDropDown} onBlur={this.closeDropDown} onKeyPress={this.handleKeyPress} />
                    <Button onClick={this.handleClockInClick}>Clock In</Button>
                    {this.state.showDropDown ? 
                        <div className="drop-down" style={{transform: `translate(${x}px, ${y}px)`, width: `${width}px`}}>
                            <p className="autocomplete">{this.state.autocompleteValue}</p>
                            <DropDown data={this.state.possibleMembers} onItemClick={this.handleDropDownItemClick} format={this.format}/>
                        </div> :
                        ""}
                </div>
                {this.state.error ? <h3 className="error">Error: {this.state.error}</h3> : ""}
            </>
        )
    }
}

function DropDown ({data, onItemClick, format}) {
    if (data.length > 0) {
        return (
            <ul className="drop-down-box" tabIndex="0">
                {data.map(member => <li><p onClick={() => onItemClick(member)}>{format(member)}</p></li>)}
            </ul>
        )
    } else {
        return ""
    }

}