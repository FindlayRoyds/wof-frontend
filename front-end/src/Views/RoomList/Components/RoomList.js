/*
ROOM LIST COMPONENT
loaded by the room list view
*/

//imports the room list item from the room_list specific components
import RoomListItem from "./RoomListItem";

const RoomList = (props) => {
    return (
        <>
        {props.rooms.map((roomData) => 
            <RoomListItem roomName={roomData.NAME} roomHash={roomData.HASH} socket={props.socket}/>
        )}
        </>
    )
}

export default RoomList;