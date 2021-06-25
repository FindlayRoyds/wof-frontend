import { useState } from "react";
import TextInput from "./../../MainComponents/TextInput";

const RoomCreatorView = (props) => {
    const [roomName, setRoomName] = useState("");

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