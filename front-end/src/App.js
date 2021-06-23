import './App.css';
import { useState } from 'react';
import * as three from 'three';

/*socket.addEventListener('open', function (event) {
    //socket.send("hello");
});

socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});*/

const scene = new three.Scene();
const camera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new three.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.setZ(30);

/*const geometry = new three.TorusGeometry(10, 3, 16, 100)
const material = new three.MeshStandardMaterial({
  color: 0xFF6347
});
const torus = new three.Mesh(geometry, material)

const pointLight = new three.PointLight(0xffffff)
pointLight.position.set(25, 25, 25)

const ambientLight = new three.AmbientLight(0x161616);

scene.add(pointLight, ambientLight)*/
let websocketURL = "wss://findlay-wof-backend.herokuapp.com/0.0.0.0"
if (process.env.NODE_ENV === "development") {
  websocketURL = "ws://localhost:5555"
}
console.log("connecting to socket")
let socket = new WebSocket(websocketURL)

const App = () => {
  const [rooms, setRooms] = useState([]);
  const [roomData, setRoomData] = useState("didn't update");
  const [view, setView] = useState("CONNECTING");
  
  socket.addEventListener('message', function (event) {
      const data = JSON.parse(event.data)
      switch (data.TYPE) {
        case "CONNECTED":
          setView("LOGIN")
          break;
        case "LOAD_ROOMS":
          if (view === "ROOM_LIST") {
            setRooms(data.DATA)
          }
          
          break;
        case "JOINED_ROOM":
          setView("ROOM_VIEW")
          setRoomData(data.DATA)
          break;
      }
      return false;
  });

  switch (view) {
    case "CONNECTING":
      return <p>CONNECTING</p>
    case "LOGIN":
      return <LoginScreen socket={socket} setView={setView}/>
    case "ROOM_LIST":
      return (<>
        <button onClick={() => {setView("ROOM_CREATOR")}}>Create Game</button>
        <RoomList rooms={rooms}/>
      </>)
    case "ROOM_CREATOR":
      return <RoomCreator socket={socket}/>
    case "ROOM_VIEW":
      return <RoomView roomName={roomData}/>
  }
}

const LoginScreen = (props) => {
  const [inputText, setInputedText] = useState("");

  const login = () => {
    const data = {"TYPE": "LOGIN", "DATA": inputText}
    props.setView("ROOM_LIST")
    props.socket.send(JSON.stringify(data))
  }

  return (
    <>
      <TextInput text={inputText} onTextInput={(event) => {setInputedText(event.target.value)}}/>
      <button onClick={() => {login()}}>Enter Name</button>
    </>
  )
}

const RoomCreator = (props) => {
  const [roomName, setRoomName] = useState("");

  const createRoom = () => {
    const data = {"TYPE": "CREATE_ROOM", "DATA": roomName}
    props.socket.send(JSON.stringify(data))
    console.log("creating room")
  }

  return (<>
    <TextInput text={roomName} onTextInput={(event) => {setRoomName(event.target.value)}}/>
    <button onClick={() => {createRoom()}}>Create Room</button>
  </>);
}

const RoomView = (props) => {
  return (
    <p>
      {props.roomName}
    </p>
  )
}

const RoomList = (props) => {
  return (
    <>
      
      {props.rooms.map((room) => 
        <RoomListItem roomName={room}/>
      )}
    </>
  )
}

const RoomCreationButton = (props) => {
  const [inputText, setInputedText] = useState("");

  return (
    <>
      <TextInput text={inputText} onTextInput={(event) => {setInputedText(event.target.value)}}/>
      <button onClick={() => {}}>Create Room</button>
    </>
  )
}

const RoomListItem = (props) => {
  return (
    <div class="room-item">
      {props.roomName}
    </div>
  )
}

const TextInput = (props) => {
  return (
    <input value={props.text} onChange={(event) => {props.onTextInput(event)}}></input>
  )
}

const PopupBackground = (props) => {
  
}

function animate() {
  requestAnimationFrame(animate);

  /*torus.rotation.x += 0.1
  torus.rotation.y += 0.05
  torus.rotation.z += 0.1*/

  renderer.render(scene, camera)
}

export default App;

animate()