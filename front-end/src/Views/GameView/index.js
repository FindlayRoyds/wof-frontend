import { useState } from "react";
import TextInput from "./../../MainComponents/TextInput";

const GameView = (props) => {
  const [inputText, setInputedText] = useState("");

  const submitGuess = () => {
    const data = {"TYPE": "SUBMIT_GUESS", "DATA": inputText}
    props.socket.send(JSON.stringify(data))
  }

  const leaveGame = () => {
    const data = {"TYPE": "LEAVE_GAME"}
    props.socket.send(JSON.stringify(data))
  }

  return (<>
    <p>game view</p>
    <TextInput text={inputText} onTextInput={(event) => {setInputedText(event.target.value)}}/>
    <button onClick={() => {submitGuess()}}>submit guess</button>
    <button onClick={() => {leaveGame()}}>leave game</button>
  </>)
}

export default GameView;