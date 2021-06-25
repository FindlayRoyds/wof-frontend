const RoomListItem = (props) => {
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