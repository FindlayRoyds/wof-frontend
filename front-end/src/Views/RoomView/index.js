import { useState } from "react";

const RoomView = (props) => {
    const [ready, setReady] = useState(false);
  
    const leaveRoom = () => {
      const data = {"TYPE": "LEAVE_ROOM"}
      props.socket.send(JSON.stringify(data))
    }

    const changeReady = () => {
      const data = {"TYPE": "CHANGE_READY", "DATA": !ready}
      setReady(!ready)
      props.socket.send(JSON.stringify(data))
    }
  
    return (<>
      <p>{props.roomData.NAME}</p>
      {Object.keys(props.connected).map((key) =>
        <p>{props.connected[key].NAME}</p>
      )}
      <button onClick={() => {leaveRoom()}}>Leave Room</button>
      <button onClick={() => {changeReady()}}>{ready ? "Unready" : "Ready Up"}</button>
    </>)
  }

export default RoomView;