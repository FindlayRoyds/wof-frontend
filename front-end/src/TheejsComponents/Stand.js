/*
STAND 3D MODEL
displays the player's name + relevant information on front surface
*/

import React, { useRef } from 'react'
import { useGLTF, Html } from '@react-three/drei'

//returns the name span
const name = (props) => {
  return (
    <span className="stand-name">
      {props.name}
    </span>
  )
}

//returns html for displaying ready status
const infoDisplay = (props) => {
  if (props.displayType === "READY") {
    return (<>
      <p
        className="stand-ready-status"
        style={props.ready? {color: "limegreen"} : {color: "red"}}
      >
        {props.ready? "READY" : "UNREADY"}
      </p>
    </>)
  } else {
    return (<>
      <p className="stand-score">
        {"$" + props.score}
      </p>
    </>)
  }
}

export default function Model(props) {
  const group = useRef()
  const { nodes } = useGLTF('/stand.glb')
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane.geometry}
        material={nodes.Plane.material}
      >
        <Html
          distanceFactor={1.5}
          position={[0, 1.7, 1]}
          transform>
            {name(props)}
            {infoDisplay(props)}
        </Html>
      </mesh>
    </group>
  )
}

useGLTF.preload('/stand.glb')