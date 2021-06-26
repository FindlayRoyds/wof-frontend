import React, { useRef } from "react";
import { useFrame } from '@react-three/fiber'

const Box = (props) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef()

  useFrame(() => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  });

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={1}
      onPointerOver={console.log("HHH")}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'hotpink'} />
    </mesh>
  )
};

export default Box;