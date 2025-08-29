import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';

interface ThreeBackgroundProps {
  isPremium?: boolean;
}

const ThreeBackground: React.FC<ThreeBackgroundProps> = ({ isPremium = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    const currentMount = mountRef.current; // Copy to avoid ref changes

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: false, // Disable for performance
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
    renderer.setClearColor(0x000000, 0); // Transparent background
    currentMount.appendChild(renderer.domElement);

    // Create optimized particles with reduced count
    const particleCount = 30; // Further reduced for better performance
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 300;     // x - wider spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400; // y - taller spread
      positions[i * 3 + 2] = (Math.random() - 0.5) * 150; // z
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x1a1a2e,
      size: 0.5,
      transparent: true,
      opacity: 0.1,
      sizeAttenuation: false, // Performance optimization
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    camera.position.z = 50;

    // Optimized animation with reduced frequency
    let animationId: number;
    let frameCount = 0;
    const animate = () => {
      frameCount++;
      
      // Reduce animation frequency to improve performance
      if (frameCount % 2 === 0) {
        particleSystem.rotation.y += 0.0005;
        
        const positions = particleSystem.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i += 2) { // Update every other particle
          positions[i * 3 + 1] += Math.sin(Date.now() * 0.0005 + i) * 0.005;
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
      }
      
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      
      particles.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, [isPremium]);

  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '200vh',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.1,
      }}
    />
  );
};

export default ThreeBackground;