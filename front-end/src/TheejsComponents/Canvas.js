import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

const CanvasView = () => {
    console.log("got a canvas")
    return (
        <Canvas>
            <BoxH position={[0, 0, 0]} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <BoxH position={[-1.2, 0, 0]} />
            <BoxH position={[2.5, 0, 0]} />
        </Canvas>
    )
}

const BoxH = (props) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef()

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
}

export default CanvasView;