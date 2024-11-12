import React, { useEffect, useRef, Suspense } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function GameScene() {
  const mountRef = useRef(null);
  const gun = useLoader(GLTFLoader, '/models/9mm_pistol.glb');
  const room = useLoader(GLTFLoader, '/models/room.glb'); 

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e1e1e);

    const camera = new THREE.PerspectiveCamera(
      70, // Ajusta aquí el FOV
      window.innerWidth / window.innerHeight,
      0.1, // Plano cercano para evitar recortes en modelos cercanos
      1000
    );
    camera.position.set(4.5, 1, -2); // Posicionar la cámara dentro del room

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Configurar luz direccional simulando el sol
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const handlePointerLockChange = () => {
      if (document.pointerLockElement === mountRef.current) {
        document.addEventListener('mousemove', onMouseMove);
      } else {
        document.removeEventListener('mousemove', onMouseMove);
      }
    };

    const handleClicked = () => {
      mountRef.current.requestPointerLock();
    };

    // Cargar y agregar el room a la escena
    if (room.scene) {
      room.scene.position.set(0, 0, 0); // Centrar el room en la escena
      room.scene.scale.set(1, 1, 1); // Ajusta la escala según el tamaño del room
      scene.add(room.scene);
    }

    // Añadir el arma como hijo de la cámara
    if (gun.scene) {
      gun.scene.position.set(0.3, -0.5, -1);
      gun.scene.rotation.set(0, (3 * Math.PI) / 2, 0);
      gun.scene.scale.set(0.5, 0.5, 0.5);
      camera.add(gun.scene);
    }
    scene.add(camera);

    // Crear un objeto circular y agregarlo a la escena
    const circleGeometry = new THREE.CircleGeometry(1, 32);
    const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.position.set(6, 1, -2);
    // scene.add(circle);

    // Función para mover la cámara con el mouse
    const onMouseMove = (event) => {
      const mouseX = (event.movementX / window.innerWidth) * 2;
      const mouseY = -(event.movementY / window.innerHeight) * 2;
      
      camera.rotation.y -= mouseX * 0.1; // Sensibilidad horizontal
      camera.rotation.x += mouseY * 0.1; // Sensibilidad vertical
    
      // Limitar el ángulo vertical de la cámara
      const maxVerticalRotation = Math.PI / 2; // 90 grados hacia arriba o abajo
      camera.rotation.x = Math.max(-maxVerticalRotation, Math.min(maxVerticalRotation, camera.rotation.x));
    };
    // Escuchar el evento de cambio de bloqueo de puntero
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    window.addEventListener('click', handleClicked);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Limpiar el renderizador y remover eventos al desmontar
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [gun, room]);

  return (
    <div ref={mountRef} style={{ width: '100vw', height: '100vh', cursor: 'none' }}>
      <div className='crosshair' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '5px', height: '5px', backgroundColor: 'red' }}></div>
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
