/*
WHEEL 3D MODEL
the 3d model of the wheel in the centre of the stage
spins
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';

//gets the rotation of the spinning div
function getCurrentRotation(el) {
  var st = window.getComputedStyle(el, null);
  var tr = st.getPropertyValue("transform")

  if (tr !== "none") {
    var values = tr.split('(')[1];
    values = values.split(')')[0];
    values = values.split(',');
    var a = values[0];
    var b = values[1];

    var angle = Math.atan2(b, a);
  } else {
    var angle = 0;
  }

  return angle
}

export default function Model(props) {
  const group = useRef()
  const { nodes } = useGLTF('/wheel.glb')

  //runs every frame to rotate wheel
  useFrame(() => {
    if (props.spin) {
      group.current.rotation.y = group.current.rotation.y + 0.01
    } else {
      group.current.rotation.y = getCurrentRotation(props.spinner)
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder.geometry}
        material={nodes.Cylinder.material}
      />
    </group>
  )
}

useGLTF.preload('/wheel.glb')
