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
      80,
      window.innerWidth / window.innerHeight,
      0.5,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

     // Usar luz direccional (simulando el sol)
     const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Color blanco, intensidad 1
     directionalLight.position.set(10, 10, 10); // Posicionar la luz en una dirección
     directionalLight.castShadow = true; // Activar sombras
     scene.add(directionalLight);
 
     // Para mejorar las sombras, también puedes configurar la luz direccional
     directionalLight.shadow.mapSize.width = 512;  // Resolución de la sombra
     directionalLight.shadow.mapSize.height = 512;
     directionalLight.shadow.camera.near = 0.5;    // Distancia mínima para las sombras
     directionalLight.shadow.camera.far = 50;      // Distancia máxima para las sombras
 
     // Configurar el entorno y la luz ambiental para dar un toque más realista
     const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Luz ambiental suave
     scene.add(ambientLight);

    const handlePointerLockChange = () => {
      if (document.pointerLockElement === mountRef.current) {
        document.addEventListener('mousemove', onMouseMove, false);
      } else {
        document.removeEventListener('mousemove', onMouseMove, false);
      }
    };

    const handleClicked = () => {
      mountRef.current.requestPointerLock();
    };

    // Añadir el arma como hijo de la cámara
    if (gun.scene) {
      gun.scene.position.set(0.3, -0.5, -1);
      gun.scene.rotation.set(0, (3 * Math.PI) / 2, 0);
      gun.scene.scale.set(0.5, 0.5, 0.5);
      camera.add(gun.scene);
    }
    scene.add(camera);

    // Crear un objeto circular y agregarlo a la escena
    const circleGeometry = new THREE.CircleGeometry(1, 32); // Radio 1, con 32 segmentos
    const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.position.set(0, 1, -2); // Posición del círculo en la escena
    scene.add(circle);

    // Variables para controlar la rotación de la cámara
    let rotationX = 0;
    let rotationY = 0;

    // Función para mover la cámara con el mouse usando el movimiento real
    const onMouseMove = (event) => {
      rotationY -= event.movementX * 0.002; // Movimiento horizontal
      rotationX -= event.movementY * 0.002; // Movimiento vertical

      // Limitar la rotación vertical para evitar que la cámara se dé vuelta
      rotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationX));

      camera.rotation.set(rotationX, rotationY, 0);
    };

    // Escuchar los cambios en el pointer lock
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    // Escuchar el evento de clic para solicitar el pointer lock
    window.addEventListener('click', handleClicked);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Limpiar el renderizador y remover el evento al desmontar
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener('click', handleClicked);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('mousemove', onMouseMove); // Asegúrate de limpiar el evento
    };
  }, [gun]);

  return (
    <div ref={mountRef} style={{ width: '100vw', height: '100vh', cursor: 'none' }} >
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '5px', height: '5px', backgroundColor: 'green' }}/>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameScene />
    </Suspense>
  );
}
