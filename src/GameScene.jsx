import React, { useEffect, useRef, Suspense } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './gamescene.css'


function GameScene() {
  const mountRef = useRef(null);
  const gun = useLoader(GLTFLoader, '/models/9mm_pistol.glb');
  const room = useLoader(GLTFLoader, '/models/room.glb');


  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e1e1e);


    const camera = new THREE.PerspectiveCamera(
      60, // Ajusta aquí el FOV
      window.innerWidth / window.innerHeight,
      0.1, // Plano cercano para evitar recortes en modelos cercanos
      1000
    );
    camera.position.set(4.8, 1, -1); // Posicionar la cámara dentro del room


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
        document.addEventListener('click', shootAnimation);
        setInterval(generateTargets, 300);
      } else {
        document.removeEventListener('mousemove', onMouseMove);
      }
    };


    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let targetCounter = 0;
    const counter = document.querySelector('.counter')


    const shootAnimation = () => {
      // Animación del retroceso del arma
      gun.scene.rotation.x += 0.2;
      setTimeout(() => {
        gun.scene.rotation.x -= 0.2;
      }, 50);


      // Disparar un rayo desde la cámara
      raycaster.setFromCamera(mouse, camera);


      // Intersectar el rayo con los objetivos
      const intersects = raycaster.intersectObjects(scene.children, true);


      // Si hay intersecciones, eliminar el primer objetivo
      for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.name === 'esfera') {
          targetCounter += 1;
          counter.textContent = `Targets Eliminados: ${targetCounter}`
          removeTarget(intersects[i].object);
          break;
        }
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
      gun.scene.position.set(0.3, -0.45, -1);
      gun.scene.rotation.set(0, (3 * Math.PI) / 2, 0);
      gun.scene.scale.set(0.4, 0.4, 0.4);
      camera.add(gun.scene);
    }
    scene.add(camera);


    const targets = []; // Array para almacenar los objetivos


    const generateTargets = () => {
      // Si ya hay 3 o más esferas, no agregar más
      if (targets.length >= 3) return;


      let positionX = getRandomArbitrary(2, 8.2);
      let positionY = getRandomArbitrary(0.5, 2.5);
      // console.log("Position x: " + positionX);
      // console.log("Position y: " + positionY);


      const geometry = new THREE.SphereGeometry(0.3, 54, 54);
      const material = new THREE.MeshStandardMaterial({ color: 0x14A7FC });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(positionX, positionY, -10);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      sphere.name = 'esfera';
      if (!targetCollides(sphere)) {
        targets.push(sphere);
        scene.add(sphere);
      }


    };


    const targetCollides = (target) => {
      // comprueba si la esfera colisiona con otra esfera
      for (let i = 0; i < targets.length; i++) {
        if (targets[i] !== target) {
          const distance = target.position.distanceTo(targets[i].position);
          if (distance < 0.6) return true;
        }
      }


    }


    // Llama a esta función después de eliminar un objetivo
    const removeTarget = (target) => {
      scene.remove(target);       // Remueve la esfera de la escena
      targets.splice(targets.indexOf(target), 1);  // Remueve del array
    };


    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }


    const timer = document.querySelector('.timer');
    let time = 60000; // 60 segundos
      setInterval(() => {
        time -= 1000;
        timer.textContent = `Tiempo: ${time / 1000} segundos`;
        if (time <= 0) {
          timer.textContent = '¡Juego terminado!';
          document.exitPointerLock();
        }
      }, 1000);




    const onMouseMove = (event) => {
      const mouseX = (event.movementX / window.innerWidth) * 2;
      const mouseY = -(event.movementY / window.innerHeight) * 2;
   
      // Ajustar la rotación en los ejes X e Y sin afectar el eje Z
      camera.rotation.y -= mouseX * 0.3; // Sensibilidad horizontal (Y)
      camera.rotation.x += mouseY * 0.3; // Sensibilidad vertical (X)
   
      // Limitar el ángulo vertical de la cámara
      const maxVerticalRotation = Math.PI / 2; // 90 grados hacia arriba o abajo
      camera.rotation.x = Math.max(-maxVerticalRotation, Math.min(maxVerticalRotation, camera.rotation.x));
   
      // Asegurarse de que la rotación en Z siempre sea 0 para evitar inclinación
      camera.rotation.z = 0;
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
      <div className='timer' style={{ position: 'absolute', top: '10px', left: '50%', color: 'white' }}></div>
      <div className='counter'style={{ position: 'absolute', top: '10px', left: '30%', color: 'white' }}></div>
      <div className='crosshair' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '5px', height: '5px', backgroundColor: 'red' }}></div>
    </div>


  );
}


export default function App() {
  return (
    <Suspense fallback={<div class="loader">
      <div class="inner">
      </div>
    </div>}>
      <GameScene />
    </Suspense>
  );
}
