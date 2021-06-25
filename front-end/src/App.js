import './App.css';
import { useState, useEffect } from 'react';
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

/*const App = () => {
  const [text, setText] = useState("stage 1");

  return (<>
    <p>{text}</p>
    <button onClick={() => {setText("stage 2")}}>Press</button>
  </>);
}*/

const App = (props) => {
  /*const [rooms, setRooms] = useState([]);
  const [roomData, setRoomData] = useState({});
  const [roomConnected, setRoomConnected] = useState([]);
  const [view, setView] = useState("CONNECTING");
  
  useEffect(() => {
    socket.addEventListener('message', function (event) {
      console.log('recieved data')
      const data = JSON.parse(event.data)
      switch (data.TYPE) {
        case "CONNECTED":
          setView("LOGIN")
          console.log('set to login')
          break;
        case "LOAD_ROOMS":
          if (view === "ROOM_LIST") {
            setRooms(data.DATA)
          } else {
            console.log(view)
          }
          
          break;
        case "JOINED_ROOM":
          setRoomData(data.DATA.ROOM_DATA)
          setRoomConnected(data.DATA.CONNECTED_LIST)
          setView("ROOM_VIEW")
          console.log('set to room view')
          break;
        case "ROOM_CONNECTED_UPDATE":
          setRoomConnected(data.DATA)
          break;
      }
      lastData = data
      return false;
    });
  }, [])
  

  switch (view) {
    case "CONNECTING":
      return <p>CONNECTING</p>
    case "LOGIN":
      return <LoginScreen socket={socket} setView={setView}/>
    case "ROOM_LIST":
      return (<>
        <button onClick={() => {setView("ROOM_CREATOR")}}>Create Game</button>
        <RoomList rooms={rooms} socket={socket}/>
      </>)
    case "ROOM_CREATOR":
      return <RoomCreator socket={socket}/>
    case "ROOM_VIEW":
      return <RoomView roomData={roomData} connected={roomConnected}/>
  }*/

  const [data, setData] = useState();
  const [view, setView] = useState("CONNECTING");
  const [rooms, setRooms] = useState([]);
  const [roomData, setRoomData] = useState({});
  const [roomConnected, setRoomConnected] = useState([]);

  useEffect(() => {
    socket.addEventListener('message', function (event) {
      console.log(event.data)
      const websocketData = JSON.parse(event.data)
      setData(websocketData)

      return false;
    });
  }, [])

  if (typeof data !== 'undefined' & data !== null) {
    const tempData = data
    setData(null)
    switch (data.TYPE) {
      case "CONNECTED":
        setView("LOGIN")
        break;
      case "LOAD_ROOMS":
        if (view === "ROOM_LIST" || view === "ROOM_VIEW") {
          setRooms(data.DATA)
          setView("ROOM_LIST")
        } else {
          console.log(view)
        }
        break;
      case "JOINED_ROOM":
        setRoomData(data.DATA)
        //setRoomConnected(data.DATA.CONNECTED_LIST)
        setView("ROOM_VIEW")
        break;
      case "ROOM_CONNECTED_UPDATE":
        setRoomConnected(data.DATA)
        break;
    }
  }

  switch (view) {
    case "CONNECTING":
      return <p>CONNECTING</p>
    case "LOGIN":
      return <LoginScreen socket={socket} setView={setView}/>
    case "ROOM_LIST":
      return (<>
        <button onClick={() => {setView("ROOM_CREATOR")}}>Create Game</button>
        <RoomList rooms={rooms} socket={socket}/>
      </>)
    case "ROOM_CREATOR":
      return <RoomCreator socket={socket}/>
    case "ROOM_VIEW":
      return <RoomView roomData={roomData} connected={roomConnected} socket={socket}/>
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
  }

  return (<>
    <TextInput text={roomName} onTextInput={(event) => {setRoomName(event.target.value)}}/>
    <button onClick={() => {createRoom()}}>Create Room</button>
  </>);
}

const RoomView = (props) => {
  const [ready, setReady] = useState(false);

  const leaveRoom = () => {
    const data = {"TYPE": "LEAVE_ROOM"}
    props.socket.send(JSON.stringify(data))
  }

  return (<>
    <p>{props.roomData.NAME}</p>
    {props.connected.map((client) =>
      <p>{client}</p>
    )}
    <button onClick={() => {leaveRoom()}}>Leave Room</button>
    <button onClick={() => {setReady(!ready)}}>{ready ? "Unready" : "Play"}</button>
  </>)
}

const RoomList = (props) => {
  return (
    <>
      {props.rooms.map((roomData) => 
        <RoomListItem roomName={roomData.NAME} roomHash={roomData.HASH} socket={props.socket}/>
      )}
    </>
  )
}

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

const TextInput = (props) => {
  return (
    <input value={props.text} onChange={(event) => {props.onTextInput(event)}}></input>
  )
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