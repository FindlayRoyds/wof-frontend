/*
LIGHTING COMPONENT
generates the bright/cartoonish lighting style for 3d components
*/

import { Canvas } from '@react-three/fiber'
import * as THREE from "three";

const Lighting = () => {
    return (<>
        <pointLight position={[0, 1000, 0]} intensity={1}/>
        <pointLight position={[0, -1000, 0]} intensity={0.1}/>
        <pointLight position={[1000, 0, 0]} intensity={0.3}/>
        <pointLight position={[-1000, 0, 0]} intensity={0.3}/>
        <pointLight position={[0, 0, 1000]} intensity={0.3}/>
        <pointLight position={[0, 0, -1000]} intensity={0.3}/>
    </>)
}

export default Lighting