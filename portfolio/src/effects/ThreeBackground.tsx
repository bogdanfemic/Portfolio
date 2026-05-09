import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
import { isWebGLAvailable } from '../utils/webGLUtils';

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
`;

interface ThreeBackgroundProps {
  sectionId: string;
}

const ThreeBackground: React.FC<ThreeBackgroundProps> = ({ sectionId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Only initialize if the section exists
    const section = document.getElementById(sectionId);
    if (!section || !containerRef.current) {
      console.warn(`Section with ID "${sectionId}" not found. Skipping 3D background initialization.`);
      return;
    }
    
    // Check WebGL availability only once
    const webGLAvailable = isWebGLAvailable();
    if (!webGLAvailable) {
      console.warn('WebGL is not available in your browser. Skipping 3D background initialization.');
      return;
    }
    
    try {
      let rafId: number | null = null;
      let isDisposed = false;

      const isDarkMode = () => document.documentElement.dataset.theme === 'dark';

      // Create scene, camera, and renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      
      // Create renderer with transparent background
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
      
      // Set renderer size and append to container
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      // Store a reference to the container for cleanup
      const container = containerRef.current;
      container.appendChild(renderer.domElement);
      
      // Set camera position
      camera.position.z = 30;
      
      // Create particles
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 1500;
      
      // Create positions array (3 values per vertex)
      const positions = new Float32Array(particlesCount * 3);
      const colors = new Float32Array(particlesCount * 3);
      
      const paintParticleColors = (darkMode: boolean) => {
        for (let i = 0; i < particlesCount * 3; i += 3) {
          const colorChoice = Math.random();
          if (darkMode) {
            if (colorChoice < 0.6) {
              colors[i] = 0.37;
              colors[i + 1] = 0.49;
              colors[i + 2] = 1.0;
            } else if (colorChoice < 0.85) {
              colors[i] = 0.21;
              colors[i + 1] = 0.84;
              colors[i + 2] = 1.0;
            } else {
              colors[i] = 0.9;
              colors[i + 1] = 0.92;
              colors[i + 2] = 1.0;
            }
          } else {
            // Darker tones keep contrast against bright hero backgrounds.
            if (colorChoice < 0.55) {
              colors[i] = 0.2;
              colors[i + 1] = 0.29;
              colors[i + 2] = 0.8;
            } else if (colorChoice < 0.85) {
              colors[i] = 0.02;
              colors[i + 1] = 0.54;
              colors[i + 2] = 0.78;
            } else {
              colors[i] = 0.5;
              colors[i + 1] = 0.38;
              colors[i + 2] = 0.78;
            }
          }
        }
      };

      // Set random positions and colors for particles
      for (let i = 0; i < particlesCount * 3; i += 3) {
        // Positions - spread particles in a sphere
        positions[i] = (Math.random() - 0.5) * 50;     // x
        positions[i + 1] = (Math.random() - 0.5) * 50; // y
        positions[i + 2] = (Math.random() - 0.5) * 50; // z
      }
      paintParticleColors(isDarkMode());
      
      // Set attributes
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      // Create material
      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.82,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
      });
      
      // Create points
      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);
      
      // Mouse movement effect
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;
      
      // Track mouse position
      const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      
      // Handle window resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      
      window.addEventListener('resize', handleResize);
      
      // Create connections between nearby particles
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x8c83ff,
        transparent: true,
        opacity: 0.2
      });
      
      const connections = new THREE.Group();
      scene.add(connections);
      
      // Function to update connections
      const updateConnections = () => {
        // Remove old connections
        while (connections.children.length > 0) {
          const child = connections.children[0] as THREE.Line;
          connections.remove(child);
          if (child.geometry) child.geometry.dispose();
        }
        
        // Get particle positions
        const positions = particlesGeometry.attributes.position.array;
        
        // Check distances between particles and create lines for close ones
        const connectionDistance = 5;
        const maxConnections = 300; // Limit for performance
        let connectionCount = 0;
        
        for (let i = 0; i < positions.length; i += 3) {
          if (connectionCount >= maxConnections) break;
          
          const x1 = positions[i];
          const y1 = positions[i + 1];
          const z1 = positions[i + 2];
          
          for (let j = i + 3; j < positions.length; j += 3) {
            if (connectionCount >= maxConnections) break;
            
            const x2 = positions[j];
            const y2 = positions[j + 1];
            const z2 = positions[j + 2];
            
            const distance = Math.sqrt(
              Math.pow(x2 - x1, 2) +
              Math.pow(y2 - y1, 2) +
              Math.pow(z2 - z1, 2)
            );
            
            if (distance < connectionDistance) {
              const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(x1, y1, z1),
                new THREE.Vector3(x2, y2, z2)
              ]);
              
              const line = new THREE.Line(lineGeometry, lineMaterial);
              connections.add(line);
              connectionCount++;
            }
          }
        }
      };
      
      // Initial connection setup
      updateConnections();

      const applyTheme = (darkMode: boolean) => {
        paintParticleColors(darkMode);
        const colorAttr = particlesGeometry.getAttribute('color') as THREE.BufferAttribute;
        colorAttr.needsUpdate = true;
        particlesMaterial.opacity = darkMode ? 0.82 : 0.94;
        particlesMaterial.size = darkMode ? 0.15 : 0.18;
        particlesMaterial.blending = darkMode ? THREE.AdditiveBlending : THREE.NormalBlending;
        lineMaterial.color.set(darkMode ? 0x8c83ff : 0x3654c8);
        lineMaterial.opacity = darkMode ? 0.2 : 0.32;
      };

      applyTheme(isDarkMode());

      const themeObserver = new MutationObserver(() => {
        applyTheme(isDarkMode());
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
      
      // Animation loop
      const animate = () => {
        if (isDisposed) return;
        rafId = requestAnimationFrame(animate);
        
        // Smooth mouse tracking
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;
        
        // Rotate particles based on mouse position
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.002;
        
        // Add mouse influence
        particles.rotation.x += targetY * 0.001;
        particles.rotation.y += targetX * 0.001;
        
        // Update connections occasionally for performance
        if (Math.random() < 0.01) {
          updateConnections();
        }
        
        // Render scene
        renderer.render(scene, camera);
      };
      
      // Start animation
      animate();
      
      // Clean up on component unmount
      return () => {
        isDisposed = true;
        if (rafId !== null) cancelAnimationFrame(rafId);
        themeObserver.disconnect();

        window.removeEventListener('resize', handleResize);
        document.removeEventListener('mousemove', handleMouseMove);
        
        // Dispose of connection geometries
        connections.traverse((obj) => {
          const line = obj as THREE.Line;
          if (line.geometry) line.geometry.dispose();
        });

        // Dispose of resources
        particlesGeometry.dispose();
        particlesMaterial.dispose();
        renderer.dispose();
        
        // Remove canvas from DOM
        if (container && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    } catch (error) {
      console.error('Error initializing 3D background:', error);
    }
  }, [sectionId]);
  
  return <BackgroundContainer ref={containerRef} />;
};

export default ThreeBackground;
