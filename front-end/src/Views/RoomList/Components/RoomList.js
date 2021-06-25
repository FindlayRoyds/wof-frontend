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