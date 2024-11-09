import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function GameScene() {
  const mountRef = useRef(null);

  // Cargar el modelo del arma (asegúrate de tener el archivo .glb en tu carpeta public/models)
  const gun = useLoader(GLTFLoader, '/models/9mm_pistol.glb'); // Cambia 'arma.glb' por el nombre de tu modelo

  useEffect(() => {
    // Configuración de la escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e1e1e);

    // Configuración de la cámara
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderizador
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Luz
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    // Función de animación
    const animate = () => {
      requestAnimationFrame(animate);

      // Actualizamos la rotación de la cámara para un efecto en primera persona
      camera.rotation.x += 0.001;
      camera.rotation.y += 0.001;

      // Añadimos el arma a la escena (ajustamos la posición para que parezca que está siendo sostenida)
      if (gun.scene) {
        gun.scene.position.set(0, -1, -2);  // Ajusta la posición del arma según lo desees
        scene.add(gun.scene);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Limpiar el renderizador al desmontar
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [gun]);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
}

export default GameScene;
