/*
ERROR BOX  
displays server errors to the client
*/

import { useEffect, useState } from 'react'

const ErrorBox = (props) => {
    //runs when the close button is pressed
    const closeBox = () => {
        props.setDisplayError(false)
    }
    
    return (
        <div className="error-box-container">
            <div className="error-box">
                <p className="error-text">{props.message}</p>
                <button className="error-close" onClick={() => {closeBox()}}>close</button>
            </div>
        </div>
    )
}

export default ErrorBox;