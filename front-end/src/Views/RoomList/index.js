import { useState } from "react";
import RoomList from "./Components/RoomList"

const roomListView = (props) => {
    return (<>
        <button onClick={() => {props.setView("ROOM_CREATOR")}}>Create Game</button>
        <RoomList rooms={props.rooms} socket={props.socket}/>
      </>)
}

export default roomListView;