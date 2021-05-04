import React from 'react'

const Button = ({onClick, children, smallBtn}) => (
    <div className="btn-container">
        <button className={smallBtn? "small-btn-primary" : "btn btn-primary"} onClick={onClick}>{children}</button>
    </div>
)

export default Button;