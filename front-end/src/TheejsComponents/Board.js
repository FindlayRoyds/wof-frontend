/*
BOARD DISPLAY
shows the known letters and guessed letters
*/

import React, { useRef } from 'react'
import { Html } from '@react-three/drei'

const Board = (props) => {
  const mesh = useRef()

  return (
    <mesh
        {...props}
        ref={mesh}
        scale={1}>
        <boxGeometry args={[8, 4, 0.5]} />
        <meshStandardMaterial color={'white'} />
      <Html
        distanceFactor={1.5}
        position={[0, 0, 0.25]}
        transform>
        <span className="phrase-display">
          {props.phrase}
        </span>
      </Html>
    </mesh>
  )
}

export default Board