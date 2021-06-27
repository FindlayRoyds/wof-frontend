import { useEffect, useState } from 'react'

const GameMessage = (props) => {
    return (
        <div className="game-message-container">
            <p className="game-message-text">{props.message}</p>
        </div>
    )
}

export default GameMessage;