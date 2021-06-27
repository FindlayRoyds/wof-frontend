/*
ROOM LIST VIEW
this page is displayed when the client is deciding on a room to join
*/

//imports the room list component from the room_list specific components
import RoomList from "./Components/RoomList"

const roomListView = (props) => {
    return (<>
        <button onClick={() => {props.setView("ROOM_CREATOR")}}>Create Game</button>
        <RoomList rooms={props.rooms} socket={props.socket}/>
      </>)
}

export default roomListView;