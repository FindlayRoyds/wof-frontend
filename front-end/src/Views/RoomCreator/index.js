/*
ROOM CREATOR
this page is displayed when the client is creating a room
*/

import { useState } from "react";
//inports the text input
import TextInput from "./../../MainComponents/TextInput";

const RoomCreatorView = (props) => {
    const [roomName, setRoomName] = useState("");

    //runs when the client presses the 'create room' button
    const createRoom = () => {
        const data = {"TYPE": "CREATE_ROOM", "DATA": roomName}
        props.socket.send(JSON.stringify(data))
    }

    return (<>
        <TextInput text={roomName} onTextInput={(event) => {setRoomName(event.target.value)}}/>
        <button onClick={() => {createRoom()}}>Create Room</button>
    </>);
}

export default RoomCreatorView;