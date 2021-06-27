import { useState } from "react"

import TextInput from "./../../MainComponents/TextInput";
import Box from "./../../TheejsComponents/Box"

const LoginView = (props) => {
  const [inputText, setInputedText] = useState("");

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