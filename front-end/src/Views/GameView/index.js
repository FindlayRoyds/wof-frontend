/*
GAME VIEW
displays the information for the current game
*/

import { useState } from "react";
import TextInput from "./../../MainComponents/TextInput";

const GameView = (props) => {
  const [inputText, setInputedText] = useState("");

  //runs when the player submits a guess to the server
  const submitGuess = () => {
    const data = {"TYPE": "SUBMIT_GUESS", "DATA": inputText}
    props.socket.send(JSON.stringify(data))
  }
  
  //runs when the player presses the leave game button
  const leaveGame = () => {
    const data = {"TYPE": "LEAVE_GAME"}
    props.socket.send(JSON.stringify(data))
  }

  return (<>
    <TextInput text={inputText} onTextInput={(event) => {setInputedText(event.target.value)}}/>
    <button onClick={() => {submitGuess()}}>submit guess</button>
    <button onClick={() => {leaveGame()}}>leave game</button>
  </>)
}

export default GameView;