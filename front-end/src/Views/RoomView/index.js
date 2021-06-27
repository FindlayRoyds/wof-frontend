/*
ROOM VIEW
this page is displayed when the client is in a room lobby
*/

import { useState } from "react";

const RoomView = (props) => {
  const [ready, setReady] = useState(false);
  
  //this is fired when the client clicks the leave room button
  const leaveRoom = () => {
    const data = {"TYPE": "LEAVE_ROOM"}
    props.socket.send(JSON.stringify(data))
  }

  //this is fired when the client clicks the ready/unready button
  const changeReady = () => {
    const data = {"TYPE": "CHANGE_READY", "DATA": !ready}
    setReady(!ready)
    props.socket.send(JSON.stringify(data))
  }

  return (<>
    <button onClick={() => {leaveRoom()}}>Leave Room</button>
    <button onClick={() => {changeReady()}}>{ready ? "Unready" : "Ready Up"}</button>
  </>)
}

export default RoomView;