import './App.css';
import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import * as THREE from "three";

import ErrorBox from './MainComponents/ErrorBox';

import ConnectingView from "./Views/Connecting"
import DisconnectedView from "./Views/Disconnected"
import LoginView from "./Views/Login"
import RoomList from "./Views/RoomList"
import RoomCreator from "./Views/RoomCreator"
import RoomView from "./Views/RoomView"
import GameView from "./Views/GameView"

import Box from "./TheejsComponents/Box"
import Wheel from "./TheejsComponents/Wheel"


let websocketURL = "wss://findlay-wof-backend.herokuapp.com/0.0.0.0"
if (process.env.NODE_ENV === "development") {
  websocketURL = "ws://localhost:5555"
}
console.log("connecting to socket")
let socket = new WebSocket(websocketURL)

const App = (props) => {
  const [websocketData, setWebsocketData] = useState();
  const [view, setView] = useState("CONNECTING");
  const [displayError, setDisplayError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("No Error");

  const [rooms, setRooms] = useState([]);
  const [roomData, setRoomData] = useState({});
  const [roomConnected, setRoomConnected] = useState([]);

  const [players, setPlayers] = useState([]);
  const [isTurn, setIsTurn] = useState(false);
  const [guessedLetters, setGuessedLetters] = useState([",", "-", "'", '"', ]);

  const [cameraPos, setCameraPos] = useState(new THREE.Vector3(0, 0, -20));

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
      case "ERROR":
        setErrorMessage(websocketData.DATA)
        setDisplayError(true)
        break;
      case "LOAD_ROOMS":
        if (view === "ROOM_LIST" || view === "ROOM_VIEW" || view === "GAME_VIEW") {
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
      case "JOINED_GAME":
        setView("GAME_VIEW")
        break;
    }
  }

  const renderSwitch = (param) => {
    switch (param) {
      case "CONNECTING":
        return <ConnectingView/>
      case "DISCONNECTED":
        return <DisconnectedView/>
      case "LOGIN":
        return (<>
          <LoginView socket={socket} setView={setView}/>
        </>);
      case "ROOM_LIST":
        return <RoomList setView={setView} socket={socket} rooms={rooms}/>
      case "ROOM_CREATOR":
        return <RoomCreator socket={socket}/>
      case "ROOM_VIEW":
        return <RoomView roomData={roomData} connected={roomConnected} socket={socket}/>
      case "GAME_VIEW":
        return <GameView socket={socket}/>
    }
  }

  const threeSwitch = (param) => {
    switch (param) {
      case "CONNECTING":
        return <Box position={[0, 0, 0]} />
      case "LOGIN":
        return <Box position={[0, 10, 0]}/>
      case "ROOM_LIST":
        return <Box position={[-2.6, 0, 0]} />
      case "ROOM_VIEW":
        const totalClients = roomConnected.length
        return (<>
          {roomConnected.map((client, index) => {
            const angleAmount = ((totalClients - 1) / 2) - index
            const vector = new THREE.Vector3(0, 0, -3).applyAxisAngle(
              new THREE.Vector3(0, 1, 0),
              angleAmount
              )
            console.log(vector)
            return <Box position={vector} rotation={[0, angleAmount, 0]}/>
          })}
        </>)
    }
  }

  const ref = useRef()
  return (<>
    {renderSwitch(view)}
    {displayError ? <ErrorBox setDisplayError={setDisplayError} message={errorMessage}/> : null}
    <div className="background-canvas">
      <Canvas
        camera={
          { fov: 71, position: [0, 3, 10.16], rotation: [Math.PI/6, 0, 0] }
        }>
        <ambientLight intensity={1} />
        <pointLight position={[0, 1000, 0]} intensity={1}/>
        <pointLight position={[0, -1000, 0]} intensity={0.1}/>
        <pointLight position={[1000, 0, 0]} intensity={0.5}/>
        <pointLight position={[-1000, 0, 0]} intensity={0.5}/>
        <pointLight position={[0, 0, 1000]} intensity={0.5}/>
        <pointLight position={[0, 0, -1000]} intensity={0.5}/>

        {threeSwitch(view)}
        <Wheel />
      </Canvas>
    </div>
  </>)
  /*<Suspense fallback={null}>
  <Stage preset="rembrandt" intensity={1}  environment="city" adjustCamera={false}>
    {threeSwitch(view)}
    <Wheel />
  </Stage>
</Suspense>*/
//<spotLight position={[0, 50, 0]} angle={0.15} penumbra={1} />
}

export default App;