import {useRef, useState} from 'react';
import * as THREE from 'three'
import {Canvas, useFrame, ThreeElements} from '@react-three/fiber'

import './App.css';
import {useGLTF} from '@react-three/drei';

const Box = (props: ThreeElements['mesh']) => {
    const meshRef = useRef<THREE.Mesh>(null!)
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    useFrame((_state, delta) => {
        meshRef.current.rotation.x += delta;
    })
    return (
        <mesh
            {...props}
            ref={meshRef}
            scale={active ? 1.5 : 1}
            onClick={() => setActive(!active)}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}>
            <boxGeometry args={[1, 1, 1]}/>
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'}/>
        </mesh>
    )
};

const Mur = (props: ThreeElements['mesh']) => {
    const groupRef = useRef<THREE.Group>(null);
    const { nodes } = useGLTF('Muriel.glb');

    return (
        <group ref={groupRef} {...props} dispose={null}>
            <primitive object={nodes.Scene}/>
        </group>
    )
}

export const App = () => {
    return (
        <Canvas>
            <ambientLight intensity={Math.PI / 2}/>
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI}/>
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI}/>
            <Box position={[-1.2, 0, 0]}/>
            <Box position={[1.2, 0, 0]}/>
            <Mur position={[0, 0, 0]}/>
        </Canvas>
    )
};
