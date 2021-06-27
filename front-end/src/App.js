import './App.css';
import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, ContactShadows, Html } from '@react-three/drei'
import * as THREE from "three";

import ErrorBox from './MainComponents/ErrorBox';
import GameMessage from './MainComponents/GameMessage';

import ConnectingView from "./Views/Connecting"
import DisconnectedView from "./Views/Disconnected"
import LoginView from "./Views/Login"
import RoomList from "./Views/RoomList"
import RoomCreator from "./Views/RoomCreator"
import RoomView from "./Views/RoomView"
import GameView from "./Views/GameView"

import Box from "./TheejsComponents/Box"
import Wheel from "./TheejsComponents/Wheel"
import Lighting from "./TheejsComponents/Lighting"
import Stand from "./TheejsComponents/Stand"
import Room from "./TheejsComponents/Stage"

let websocketURL = "wss://findlay-wof-backend.herokuapp.com/0.0.0.0"
if (process.env.NODE_ENV === "development") {
  websocketURL = "ws://localhost:5555"
}
console.log("connecting to socket")
const socket = new WebSocket(websocketURL)

const spinner = document.getElementById("spinner")
let currentRotation = 0
let spinConstant = true

function getSpinAmount() {
  return Math.floor(Math.random() * 20) + 15;
}

function spinWheel() {
  const spinAmount = getSpinAmount()
  spinner.style.transform = "rotate(" + currentRotation + spinAmount + "deg)"
  currentRotation += spinAmount
}

Object.size = function(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

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
  const [gameMessage, setGameMessage] = useState("Game started!")
  const [showGameMessage, setShowGameMessage] = useState(false);

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
        setErrorMessage(tempData.DATA)
        setDisplayError(true)
        break;
      case "LOAD_ROOMS":
        if (
          view === "ROOM_LIST"
          || view === "ROOM_VIEW"
          || view === "GAME_VIEW"
          || view === "LOGIN"
          ) {
          setRooms(tempData.DATA)
          setView("ROOM_LIST")
        }
        break;
      case "JOINED_ROOM":
        setRoomData(tempData.DATA)
        setView("ROOM_VIEW")
        break;
      case "ROOM_CONNECTED_UPDATE":
        setRoomConnected(tempData.DATA)
        break;
      case "JOINED_GAME":
        setView("GAME_VIEW")
        break;
      case "SET_PRIZE":
        spinWheel()
        setTimeout(
          () => {
            setGameMessage("The prize is " + tempData.DATA + " dollars!")
            setShowGameMessage(true)
          }, 
          3250
        );
        
        break;
      case "GAME_MESSAGE":
        setGameMessage(tempData.DATA)
        setShowGameMessage(true)
      case "GAME_CONNECTED_UPDATE":
        setPlayers(tempData.DATA)
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
        spinConstant = true
        return <RoomList setView={setView} socket={socket} rooms={rooms}/>
      case "ROOM_CREATOR":
        return <RoomCreator socket={socket}/>
      case "ROOM_VIEW":
        return <RoomView roomData={roomData} connected={roomConnected} socket={socket}/>
      case "GAME_VIEW":
        spinConstant = false
        //spinWheel()
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
        const totalClients = Object.size(roomConnected)
        return (<>
          {Object.keys(roomConnected).map((key, index) => {
            const angleAmount = ((totalClients - 1) / 2) - index
            const vector = new THREE.Vector3(0, -1.4, -5.8).applyAxisAngle(
              new THREE.Vector3(0, 1, 0),
              angleAmount * 0.6
              )
            console.log(roomConnected[key].READY)
            return (<Stand
              position={vector}
              rotation={[0, angleAmount * 0.6, 0]}
              scale={[0.8, 0.8, 0.8]}
              displayType="READY"
              ready={roomConnected[key].READY}
              name = {roomConnected[key].YOU ? "You" : roomConnected[key].NAME}
              />)
          })}
        </>)
    }
  }

  const ref = useRef()
  return (<>
    {renderSwitch(view)}
    {displayError ? <ErrorBox setDisplayError={setDisplayError} message={errorMessage}/> : null}
    {showGameMessage ? <GameMessage message={gameMessage}/> : null}
    <div className="background-canvas">
      <Canvas
        camera={
          { fov: 71, position: [0, 2.5, 8], rotation: [1, 1, 1] }
        }>
        <OrbitControls/>
        <Lighting/>
        {threeSwitch(view)}
        <Wheel spinner={spinner} spin={spinConstant} position={[0, -2, 0]}/>
        <Room scale={[10, 10, 10]} position={[0, -2.35, 0]}/>
      </Canvas>
    </div>
  </>)
}

//<ContactShadows position={[0, 0, 0]} width={10} height={10} far={20} rotation={[Math.PI / 2, 0, 0]} />

export default App;