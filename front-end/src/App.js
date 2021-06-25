import './App.css';
import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'

import ConnectingView from "./Views/Connecting"
import DisconnectedView from "./Views/Disconnected"
import LoginView from "./Views/Login"
import RoomList from "./Views/RoomList"
import RoomCreator from "./Views/RoomCreator"
import RoomView from "./Views/RoomView"

import BackgroundCanvas from "./TheejsComponents/Canvas"

/*const scene = new three.Scene();
const camera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new three.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.setZ(30);

const geometry = new three.TorusGeometry(10, 3, 16, 100)
const material = new three.MeshStandardMaterial({
  color: 0xFF6347
});
const torus = new three.Mesh(geometry, material)
scene.add(torus)

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

const App = (props) => {
  const [websocketData, setWebsocketData] = useState();
  const [view, setView] = useState("CONNECTING");
  const [rooms, setRooms] = useState([]);
  const [roomData, setRoomData] = useState({});
  const [roomConnected, setRoomConnected] = useState([]);

  useEffect(() => {
    socket.addEventListener('message', function (event) {
      console.log(event.data)
      const data = JSON.parse(event.data)
      setWebsocketData(data)

      return false;
    });
    
    socket.addEventListener('onclose', function (event) {
      console.log("websocket closed")
      setView("DISCONNECTED")
    });

    socket.addEventListener('onerror', function (event) {
      console.log("websocket error")
      setView("DISCONNECTED")
    });
  }, [])

  if (typeof websocketData !== 'undefined' & websocketData !== null) {
    const tempData = websocketData
    setWebsocketData(null)
    switch (tempData.TYPE) {
      case "CONNECTED":
        setView("LOGIN")
        break;
      case "LOAD_ROOMS":
        if (view === "ROOM_LIST" || view === "ROOM_VIEW") {
          setRooms(websocketData.DATA)
          setView("ROOM_LIST")
        }
        break;
      case "JOINED_ROOM":
        setRoomData(websocketData.DATA)
        setView("ROOM_VIEW")
        break;
      case "ROOM_CONNECTED_UPDATE":
        setRoomConnected(websocketData.DATA)
        break;
    }
  }

  switch (view) {
    case "CONNECTING":
      return <ConnectingView/>
    case "DISCONNECTED":
      return <DisconnectedView/>
    case "LOGIN":
      return (<>
        <LoginView socket={socket} setView={setView}/>
        <div className="help">
          <BackgroundCanvas/>
        </div>
      </>);
    case "ROOM_LIST":
      return <RoomList setView={setView} socket={socket} rooms={rooms}/>
      console.log("list")
    case "ROOM_CREATOR":
      console.log('creator')
      return <RoomCreator socket={socket}/>
    case "ROOM_VIEW":
      return <RoomView roomData={roomData} connected={roomConnected} socket={socket}/>
  }
}

/*function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.1
  torus.rotation.y += 0.05
  torus.rotation.z += 0.1

  renderer.render(scene, camera)
}*/

export default App;

//animate()