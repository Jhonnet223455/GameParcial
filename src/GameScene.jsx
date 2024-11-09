import React, { useEffect, useRef, Suspense } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function GameScene() {
  const mountRef = useRef(null);
  const gun = useLoader(GLTFLoader, '/models/9mm_pistol.glb');

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e1e1e);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    if (gun.scene) {
      // Posicionar, escalar y rotar el arma para que el cañón apunte hacia el frente
      gun.scene.position.set(0.3, -0.5, -1); // Ajuste de posición
      gun.scene.rotation.set(0, 3*(Math.PI) / 2, 0); // Rotación para que apunte hacia el frente
      gun.scene.scale.set(0.5, 0.5, 0.5); // Escala para reducir el tamaño
      
      camera.add(gun.scene); // Añadir el arma como hijo de la cámara
    }
    scene.add(camera);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [gun]);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
}

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameScene />
    </Suspense>
  );
}
