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
  const [view, setView] = useState("CONNECTING");
  
  socket.addEventListener('message', function (event) {
      const data = JSON.parse(event.data)
      switch (data.TYPE) {
        case "CONNECTED":
          setView("LOGIN")
          break;
        case "LOAD_ROOMS":
          setRooms(data.DATA)
          break;
      }
      return false;
  });

  switch (view) {
    case "CONNECTING":
      return <p>"CONNECTING"</p>
    case "LOGIN":
      return <LoginScreen socket={socket}/>
    case "iNMiefe":
      return <RoomList rooms={rooms}/>
  }
}

const LoginScreen = (props) => {
  const [inputText, setInputedText] = useState("");

  const login = () => {
    const data = {"TYPE": "LOGIN", "DATA": inputText}
    props.socket.send(JSON.stringify(data))
  }

  return (
    <div>
      <TextInput text={inputText} onTextInput={(event) => {setInputedText(event.target.value)}}/>
      <Button text="Enter Name" clicked={() => {login()}}/>
    </div>
  )
}

const RoomList = (props) => {
  console.log(props.rooms)

  return (
    <div>
      {props.rooms.map((room) => 
        <p>
          {room}
        </p>
      )}
    </div>
  )
}

const TextInput = (props) => {
  return (
    <input value={props.text} onChange={(event) => {props.onTextInput(event)}}></input>
  )
}

const Button = (props) => {
  return <button onClick={props.clicked}>{props.text}</button>
};

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