/*
LOGIN VIEW
this page is displayed when the client is logging in
*/

import { useState } from "react"

//gets the text input component
import TextInput from "./../../MainComponents/TextInput";

const LoginView = (props) => {
  const [inputText, setInputedText] = useState("");

  //runs when the player submits a username
  const login = () => {
    const data = {"TYPE": "LOGIN", "DATA": inputText}
    //props.setView("ROOM_LIST")
    props.socket.send(JSON.stringify(data))
  }

  return (
    <>
      <TextInput text={inputText} onTextInput={(event) => {setInputedText(event.target.value)}}/>
      <button onClick={() => {login()}}>Enter Name</button>
    </>
  )
}

export default LoginView;