import React from 'react'

const Button = ({onClick, children}) => (
    <div className="btn-container">
        <button className="btn btn-primary" onClick={onClick}>{children}</button>
    </div>
)

export default Button;