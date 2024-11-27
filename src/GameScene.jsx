import React, { useEffect, useRef, Suspense } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './gamescene.css'



function Popup({points, accuracy, onClose, onRestart}) {
  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>¡Juego terminado!</h2>
        <p>Puntos: {points}</p>
        <p>Exactitud: {accuracy}%</p>
        <button onClick={onClose}>Cerrar</button>
        <button onClick={onRestart}>Reiniciar</button>
      </div>
    </div>
  );
  
}

function GameScene() {
  const mountRef = useRef(null);
  const gun = useLoader(GLTFLoader, '/models/9mm_pistol.glb');
  const room = useLoader(GLTFLoader, '/models/room.glb');




  useEffect(() => {
    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e1e1e);

    //state for popup
    // const [showPopup, setShowPopup] = React.useState(false);


    //sound effects
    const shootSound = new Audio('/sounds/shoot.mp3');
    const popSound = new Audio('/sounds/pop.mp3');

    const camera = new THREE.PerspectiveCamera(
      60, // adjust the field of view
      window.innerWidth / window.innerHeight,
      0.1, // near clipping plane
      1000
    );
    camera.position.set(4.8, 1, -1); // Set the camera position




    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);




    // Add a plane to the scene
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);




    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);




    const handlePointerLockChange = () => {
      if (document.pointerLockElement === mountRef.current) {
        startTimer();
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
    let shootCounter = 0;
    let accuracy;
    const shootAccuracy = document.querySelector('.accuracy')


    const shootAnimation = () => {
      // Recoil effect
      gun.scene.rotation.x += 0.2;
      setTimeout(() => {
        gun.scene.rotation.x -= 0.2;
      }, 50);
      shootCounter += 1;
      
      shootSound.play();

      // set the direction of the ray
      raycaster.setFromCamera(mouse, camera);




      // find all intersected objects
      const intersects = raycaster.intersectObjects(scene.children, true);




      // check if the intersected object is a sphere
      for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.name === 'esfera') {
          popSound.play();
          targetCounter += 1;
          counter.textContent = `PTS ${targetCounter}`
          removeTarget(intersects[i].object);
          break;
        }
      }
      accuracy = (targetCounter/shootCounter)*100;
      // console.log(accuracy)
      shootAccuracy.textContent = `${Math.floor(accuracy)}%`
    };
   




    const handleClicked = () => {
      mountRef.current.requestPointerLock();
    };




    // Load the room and gun models
    if (room.scene) {
      room.scene.position.set(0, 0, 0); // Adjust main room position
      room.scene.scale.set(1, 1, 1); // Adjust main room scale
      scene.add(room.scene);
    }




    // Load the gun model and add it to the camera
    if (gun.scene) {
      gun.scene.position.set(0.3, -0.45, -1);
      gun.scene.rotation.set(0, (3 * Math.PI) / 2, 0);
      gun.scene.scale.set(0.4, 0.4, 0.4);
      camera.add(gun.scene);
    }
    scene.add(camera);




    const targets = []; // Array for storing the spheres




    const generateTargets = () => {
      // If there are already 3 targets, don't generate more
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
      // check if the target collides with any other target
      for (let i = 0; i < targets.length; i++) {
        if (targets[i] !== target) {
          const distance = target.position.distanceTo(targets[i].position);
          if (distance < 0.6) return true;
        }
      }




    }




    // Called when a target is hit
    const removeTarget = (target) => {
      scene.remove(target);       // Remove from the scene
      targets.splice(targets.indexOf(target), 1);  // Remove from the array
    };




    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }




    const timer = document.querySelector('.timer');
    let time = 60000; // 60 seconds
    let hasStarted = false; // Estate to check if the timer has started
    let timerInterval = null;


    const startTimer = () => {
      if (hasStarted) return; // If the timer has already started, don't start it again
      hasStarted = true; // Change the state to true
      timerInterval = setInterval(() => {
        time -= 1000;
        timer.textContent = `0:${time / 1000} `;
        if(time < 10000 && time > 0){
          timer.textContent = `0:0${time / 1000} `;
        }
        else if (time <= 0) {
          timer.textContent = `0:0${time / 1000} `;
          clearInterval(timerInterval); // Stop the timer
          // timer.textContent = '¡Juego terminado!';
          document.exitPointerLock();
        }
       
      }, 1000);
    };








    const onMouseMove = (event) => {
      const mouseX = (event.movementX / window.innerWidth) * 2;
      const mouseY = -(event.movementY / window.innerHeight) * 2;
   
      // Adjust the camera rotation based on the mouse movement
      camera.rotation.y -= mouseX * 0.3; // Sensibilidad horizontal (Y)
      camera.rotation.x += mouseY * 0.3; // Sensibilidad vertical (X)
   
      // Limits the vertical rotation of the camera
      const maxVerticalRotation = Math.PI / 2; // 90 grados hacia arriba o abajo
      camera.rotation.x = Math.max(-maxVerticalRotation, Math.min(maxVerticalRotation, camera.rotation.x));
   
      // Limits the horizontal rotation of the camera
      camera.rotation.z = 0;
    };
    // Add event listeners
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    window.addEventListener('click', handleClicked);




    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };




    animate();




    // Clear 
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [gun, room]);




  return (
    <div ref={mountRef} style={{ width: '100vw', height: '100vh', cursor: 'none' }}>
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 flex items-center">
      <div className="accuracy text-white text-lg font-semibold py-2 px-4  shadow-md">
        100%
        </div>
        <div className="timer text-white text-2xl font-semibold py-2 px-4 shadow-md">
          1:00
        </div>


        <div className="counter text-white text-lg font-semibold py-2 px-4  shadow-md">
          PTS 0
        </div>
      </div>
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


