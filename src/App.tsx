import {useRef, PropsWithChildren, useEffect} from 'react';
import * as THREE from 'three'
import {Canvas, useFrame, ThreeElements} from '@react-three/fiber';
import {OrbitControls, PerspectiveCamera} from '@react-three/drei';

import './App.css';
import {useGLTF} from '@react-three/drei';

const Rotator = (props: ThreeElements['mesh'] & PropsWithChildren) => {
    const {children, ...rest} = props;

    const groupRef = useRef<THREE.Group>(null!);

    useFrame(({clock}) => {
        groupRef.current.rotation.y = Math.PI / 2 * clock.getElapsedTime();
    });

    return (
        <group ref={groupRef} {...rest}>
            {children}
        </group>
    )
};

const rotateCoords = (coords: number[], angle: number) => {
    const [x, y, z] = coords;
    return new THREE.Vector3(
        x * Math.cos(angle) - z * Math.sin(angle),
        y,
        x * Math.sin(angle) + z * Math.cos(angle)
    );
};

const Lights = (props: ThreeElements['mesh'] & { count: number }) => {
    const {count, ...rest} = props;

    return (
        <Rotator {...rest}>
            {Array(count).fill(0).map((_, index) => (
                <pointLight
                    key={index}
                    position={rotateCoords([6, 5, 0], index * 2 * Math.PI / count)}
                    intensity={10}
                    distance={100}
                    color={0xffffff}
                />
            ))}
        </Rotator>
    )
};

const Muriel = (props: ThreeElements['mesh']) => {
    const {nodes} = useGLTF('Muriel.glb');

    return (
        <primitive {...props} object={nodes.Scene}/>
    );
};

const Plane = () => {
    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow={true}
        >
            <planeGeometry
                args={[20, 20, 4]}
            />
            <meshPhongMaterial
                side={THREE.DoubleSide}
                color={0xffffff}
            />
        </mesh>
    )
};

const Camera = (props: ThreeElements['perspectiveCamera']) => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
    useEffect(() => {
        cameraRef?.current?.lookAt(0, 0, 0);
    }, []);

    return (
        <PerspectiveCamera
            makeDefault
            ref={cameraRef}
            fov={75}
            near={0.1}
            far={1000}
            {...props}
        />
    );
};

const MURIEL_SCALE = 4;

export const App = () => (
    <Canvas>
        <Camera
            position={[10, 10, 10]}
        />
        <Lights
            count={3}
        />
        <Plane/>
        <Muriel
            position={[0, 0, 0]}
            scale={[MURIEL_SCALE, MURIEL_SCALE, MURIEL_SCALE]}
            castShadow={true}
        />
        <OrbitControls/>
    </Canvas>
);
