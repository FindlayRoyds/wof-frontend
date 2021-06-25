import { useState } from "react";

const RoomView = (props) => {
    const [ready, setReady] = useState(false);
  
    const leaveRoom = () => {
      const data = {"TYPE": "LEAVE_ROOM"}
      props.socket.send(JSON.stringify(data))
    }

    const changeReady = () => {
      setReady(!ready)
      const data = {"TYPE": "CHANGE_READY", "DATA": ready}
      props.socket.send(JSON.stringify(data))
    }
  
    return (<>
      <p>{props.roomData.NAME}</p>
      {props.connected.map((client) =>
        <p>{client}</p>
      )}
      <button onClick={() => {leaveRoom()}}>Leave Room</button>
      <button onClick={() => {changeReady()}}>{ready ? "Unready" : "Ready Up"}</button>
    </>)
  }

export default RoomView;