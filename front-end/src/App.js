/*
MAIN APP FILE
responsible for bring together all of the content in the front-end
*/

import './App.css';
import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber'
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
import Board from "./TheejsComponents/Board"

//creates websocket based on whether the app is deployed or not
let websocketURL = "wss://findlay-wof-backend.herokuapp.com/0.0.0.0"
if (process.env.NODE_ENV === "development") {
  websocketURL = "ws://localhost:5555"
}
console.log("connecting to socket")
const socket = new WebSocket(websocketURL)

//data for the wheel
const spinner = document.getElementById("spinner")
let currentRotation = 0
let spinConstantly = true

//generates a random amount to spin the wheel
function getSpinAmount() {
  return Math.floor(Math.random() * 20) + 15;
}

//spins the wheel with easing
function spinWheel() {
  const spinAmount = getSpinAmount()
  spinner.style.transform = "rotate(" + currentRotation + spinAmount + "deg)"
  currentRotation += spinAmount
}

//returns the size of object/dictionary
Object.size = function (obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

//the main react component of the app
const App = (props) => {
  const [websocketData, setWebsocketData] = useState();
  const [view, setView] = useState("CONNECTING");
  const [displayError, setDisplayError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("No Error");

  const [rooms, setRooms] = useState([]);
  const [roomData, setRoomData] = useState({});
  const [roomConnected, setRoomConnected] = useState({});

  const [players, setPlayers] = useState({});
  const [phrase, setPhrase] = useState("");
  const [gameMessage, setGameMessage] = useState("Game started!")
  const [showGameMessage, setShowGameMessage] = useState(false);

  const [cameraPos, setCameraPos] = useState(new THREE.Vector3(0, 0, -20));

  //runs once at start to connect to the websocket
  useEffect(() => {
    //recieves message from the websocket
    socket.addEventListener('message', function (event) {
      console.log(event.data)
      const data = JSON.parse(event.data)
      setWebsocketData(data)

      return false;
    });
    
    //detects when the websocket is closed
    socket.addEventListener('onclose', function (event) {
      console.log("websocket closed")
      setView("DISCONNECTED")
    });
    
    //detects when the websocket has an error
    socket.addEventListener('onerror', function (event) {
      console.log("websocket error")
      setView("DISCONNECTED")
    });
  }, [])

  //changes data depending on what was recieved from the websocket
  if (typeof websocketData !== 'undefined' & websocketData !== null) {
    const tempData = websocketData
    setWebsocketData(null)
    switch (tempData.TYPE) {
      case "CONNECTED":
        //login page
        setView("LOGIN")
        break;
      case "ERROR":
        //error box
        setErrorMessage(tempData.DATA)
        setDisplayError(true)
        break;
      case "LOAD_ROOMS":
        //loads room list
        setShowGameMessage(false)
        if (
          view === "LOGIN"
          || view === "ROOM_LIST"
          || view === "ROOM_VIEW"
          || view === "GAME_VIEW"
        ) {
          setRooms(tempData.DATA)
          setView("ROOM_LIST")
        }
        break;
      case "JOINED_ROOM":
        //client joined a room
        setRoomData(tempData.DATA)
        setView("ROOM_VIEW")
        break;
      case "ROOM_CONNECTED_UPDATE":
        //connected clients changed
        setRoomConnected(tempData.DATA)
        break;
      case "JOINED_GAME":
        //client joined a game
        setView("GAME_VIEW")
        break;
      case "SET_PRIZE":
        //the wheel has been spun
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
        //a message has been sent to all players in the game
        setGameMessage(tempData.DATA)
        setShowGameMessage(true)
        break;
      case "GAME_CONNECTED_UPDATE":
        //the people connected to the game
        setPlayers(tempData.DATA)
        break;
      case "UPDATE_PHRASE":
        //the letters found in the phrase changed
        setPhrase(tempData.DATA)
        break;
    }
  }

  const renderSwitch = (param) => {
    switch (param) {
      case "CONNECTING":
        //connecting page
        return <ConnectingView />
      case "DISCONNECTED":
        //disconnected page
        return <DisconnectedView />
      case "LOGIN":
        //login page
        return (<>
          <LoginView socket={socket} setView={setView} />
        </>);
      case "ROOM_LIST":
        //room list page
        spinConstantly = true
        return <RoomList setView={setView} socket={socket} rooms={rooms} />
      case "ROOM_CREATOR":
        //room creator page
        return <RoomCreator socket={socket} />
      case "ROOM_VIEW":
        //room view / lobby page
        return <RoomView roomData={roomData} connected={roomConnected} socket={socket} />
      case "GAME_VIEW":
        //in game
        spinConstantly = false
        return <GameView socket={socket} />
    }
  }

  //turns on and off 3d content
  const threeSwitch = (param) => {
    switch (param) {
      case "CONNECTING":
        //connecting page
        return (<>
          <Box position={[0, 0, 0]} />
          <Box position={[-2, 0, 0]} />
          <Box position={[2, 0, 0]} />
        </>)
      case "ROOM_VIEW":
        //in a lobby / room view
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
              name={roomConnected[key].YOU ? "You" : roomConnected[key].NAME}
            />)
          })}
        </>)
      case "GAME_VIEW":
        //in game
        console.log(players)
        const totalPlayers = Object.size(players)
        console.log()
        return (<>
          {Object.keys(players).map((key, index) => {
            const angleAmount = ((totalPlayers - 1) / 2) - index
            const vector = new THREE.Vector3(0, -1.4, -5.8).applyAxisAngle(
              new THREE.Vector3(0, 1, 0),
              angleAmount * 0.6
            )
            return (<Stand
              position={vector}
              rotation={[0, angleAmount * 0.6, 0]}
              scale={[0.8, 0.8, 0.8]}
              displayType="GAME"
              score={players[key].SCORE}
              name={players[key].YOU ? "You" : players[key].NAME}
            />)
          })}
          <Board position={[0, 3, -8]} phrase={phrase} />
        </>)
    }
  }

  //returns the components to display
  const ref = useRef()
  return (<>
    {renderSwitch(view)}
    {displayError ? <ErrorBox setDisplayError={setDisplayError} message={errorMessage} /> : null}
    {showGameMessage ? <GameMessage message={gameMessage} /> : null}
    <div className="background-canvas">
      <Canvas
        camera={
          { fov: 71, position: [0, 2.5, 8], rotation: [1, 1, 1] }
        }>
        <Lighting />
        {threeSwitch(view)}
        <Wheel spinner={spinner} spin={spinConstantly} position={[0, -2, 0]} />
        <Room scale={[10, 10, 10]} position={[0, -2.35, 0]} />
      </Canvas>
    </div>
  </>)
}

//exports the ui to the index.html
export default App;