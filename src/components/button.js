import React from 'react'

const Button = ({onClick, children, smallBtn, onMouseUp, onMouseDown}) => (
    <div className="btn-container">
        <button className={smallBtn? "small-btn-primary" : "btn btn-primary"} onClick={onClick} onMouseUp={onMouseUp} onMouseDown={onMouseDown}>{children}</button>
    </div>
)

export default Button;