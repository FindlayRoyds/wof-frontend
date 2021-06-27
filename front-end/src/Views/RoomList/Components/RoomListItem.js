/*
ROOM LIST ITEM
this is an induvidual item in the room list
*/

const RoomListItem = (props) => {
  //this is fired when the client clicks the join room button
  const joinRoom = () => {
    const data = {"TYPE": "JOIN_ROOM", "DATA": props.roomHash}
    props.socket.send(JSON.stringify(data))
  }

  return (
    <div className="room-item">
      {props.roomName}
      <button onClick={() => {joinRoom()}}>Join Room</button>
    </div>
  )
}

export default RoomListItem;