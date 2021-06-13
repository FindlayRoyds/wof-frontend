import './App.css';
import { useState } from 'react';
import * as three from 'three';

let socket = new WebSocket("wss://findlay-wof-backend.herokuapp.com//0.0.0.0")

socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
});

socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});

const scene = new three.Scene();
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

const pointLight = new three.PointLight(0xffffff)
pointLight.position.set(25, 25, 25)

const ambientLight = new three.AmbientLight(0x161616);

scene.add(pointLight, ambientLight)

const App = () => {
  const buttonClicked = () => {
    scene.add(torus)
    socket.send("hello")
  }

  return (
    <Button text="spawn" clicked={() => {buttonClicked()}}/>
  );
}

const Button = (props) => {
  return <button onClick={props.clicked}>{props.text}</button>
};

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.1
  torus.rotation.y += 0.05
  torus.rotation.z += 0.1

  renderer.render(scene, camera)
}

export default App;

animate()