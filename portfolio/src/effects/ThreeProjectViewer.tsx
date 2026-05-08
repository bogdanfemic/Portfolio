import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
import { isWebGLAvailable } from '../utils/webGLUtils';

const ViewerModal = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  overflow: hidden;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  z-index: 1001;
`;

const ViewerContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const InfoPanel = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  z-index: 1001;
`;

const ProjectTitle = styled.h3`
  margin-bottom: 10px;
  font-size: 1.5rem;
`;

const ProjectDescription = styled.p`
  margin-bottom: 0;
`;

const InstructionText = styled.p`
  margin-top: 10px;
  font-size: 0.9rem;
`;

interface ProjectData {
  id: number;
  title: string;
  description: string;
}

interface ThreeProjectViewerProps {
  projects: ProjectData[];
}

const ThreeProjectViewer: React.FC<ThreeProjectViewerProps> = ({ projects }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupViewerRef = useRef<null | (() => void)>(null);
  const rafIdRef = useRef<number | null>(null);
  
  // Variables to store current viewer state
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  
  // Mouse interaction state
  const mouseState = useRef({
    isMouseDown: false,
    mouseX: 0,
    mouseY: 0,
    targetRotationX: 0,
    targetRotationY: 0,
    previousMouseX: 0,
    previousMouseY: 0
  });
  
  // Mouse event handlers
  const onMouseDown = useCallback((event: MouseEvent) => {
    mouseState.current.isMouseDown = true;
    mouseState.current.previousMouseX = event.clientX;
    mouseState.current.previousMouseY = event.clientY;
  }, []);
  
  const onMouseMove = useCallback((event: MouseEvent) => {
    if (mouseState.current.isMouseDown) {
      mouseState.current.mouseX = event.clientX - mouseState.current.previousMouseX;
      mouseState.current.mouseY = event.clientY - mouseState.current.previousMouseY;
      
      mouseState.current.targetRotationY += mouseState.current.mouseX * 0.01;
      mouseState.current.targetRotationX += mouseState.current.mouseY * 0.01;
      
      mouseState.current.previousMouseX = event.clientX;
      mouseState.current.previousMouseY = event.clientY;
    }
  }, []);
  
  const onMouseUp = useCallback(() => {
    mouseState.current.isMouseDown = false;
  }, []);
  
  // Function to create project model
  const createProjectModel = useCallback((projectIndex: number, scene: THREE.Scene) => {
    // Clear previous model if exists
    if (modelRef.current) {
      scene.remove(modelRef.current);
    }
    
    // Create different models based on project index
    let model = new THREE.Group();
    
    switch (projectIndex) {
      case 0: // E-commerce Website
        // Create a store/shopping bag model
        
        // Create shopping bag
        const bagGeometry = new THREE.BoxGeometry(2, 2, 0.5);
        const bagMaterial = new THREE.MeshPhongMaterial({ color: 0x6C63FF });
        const bag = new THREE.Mesh(bagGeometry, bagMaterial);
        
        // Create bag handle
        const handleGeometry = new THREE.TorusGeometry(0.5, 0.1, 16, 32, Math.PI);
        const handleMaterial = new THREE.MeshPhongMaterial({ color: 0x6C63FF });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.y = 1.25;
        handle.rotation.x = Math.PI / 2;
        
        // Create shopping items
        const item1Geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const item1Material = new THREE.MeshPhongMaterial({ color: 0xFF6584 });
        const item1 = new THREE.Mesh(item1Geometry, item1Material);
        item1.position.set(0.5, 0.5, 0.3);
        
        const item2Geometry = new THREE.SphereGeometry(0.3, 32, 32);
        const item2Material = new THREE.MeshPhongMaterial({ color: 0x43CBFF });
        const item2 = new THREE.Mesh(item2Geometry, item2Material);
        item2.position.set(-0.5, 0.5, 0.3);
        
        // Add all parts to the model group
        model.add(bag);
        model.add(handle);
        model.add(item1);
        model.add(item2);
        break;
        
      case 1: // Task Management App
        // Create a task board model
        
        // Create board
        const boardGeometry = new THREE.BoxGeometry(3, 2, 0.1);
        const boardMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const board = new THREE.Mesh(boardGeometry, boardMaterial);
        
        // Create task cards
        const createTaskCard = (x: number, y: number, color: number) => {
          const cardGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.05);
          const cardMaterial = new THREE.MeshPhongMaterial({ color });
          const card = new THREE.Mesh(cardGeometry, cardMaterial);
          card.position.set(x, y, 0.1);
          return card;
        };
        
        // Add task cards in different columns
        model.add(createTaskCard(-0.9, 0.6, 0xFF6584)); // To Do
        model.add(createTaskCard(-0.9, 0.1, 0xFF6584));
        model.add(createTaskCard(-0.9, -0.4, 0xFF6584));
        
        model.add(createTaskCard(0, 0.6, 0xFFD166)); // In Progress
        model.add(createTaskCard(0, 0.1, 0xFFD166));
        
        model.add(createTaskCard(0.9, 0.6, 0x06D6A0)); // Done
        model.add(createTaskCard(0.9, 0.1, 0x06D6A0));
        model.add(createTaskCard(0.9, -0.4, 0x06D6A0));
        model.add(createTaskCard(0.9, -0.9, 0x06D6A0));
        
        // Add board to model
        model.add(board);
        break;
        
      case 2: // Weather Dashboard
        // Create a weather scene model
        
        // Create ground
        const groundGeometry = new THREE.BoxGeometry(4, 0.2, 2);
        const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x4CAF50 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.position.y = -1;
        
        // Create sun
        const sunGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD166 });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.position.set(-1.5, 1, -1);
        
        // Create clouds
        const createCloud = (x: number, y: number, z: number, scale: number) => {
          const cloudGroup = new THREE.Group();
          
          const cloudMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
          
          const cloud1 = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 16, 16),
            cloudMaterial
          );
          
          const cloud2 = new THREE.Mesh(
            new THREE.SphereGeometry(0.4, 16, 16),
            cloudMaterial
          );
          cloud2.position.x = 0.3;
          cloud2.position.y = 0.1;
          
          const cloud3 = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 16, 16),
            cloudMaterial
          );
          cloud3.position.x = 0.6;
          cloud3.position.y = -0.1;
          
          cloudGroup.add(cloud1);
          cloudGroup.add(cloud2);
          cloudGroup.add(cloud3);
          
          cloudGroup.position.set(x, y, z);
          cloudGroup.scale.set(scale, scale, scale);
          
          return cloudGroup;
        };
        
        const cloud1 = createCloud(0.5, 1, 0, 0.6);
        const cloud2 = createCloud(-0.5, 0.8, 0.5, 0.4);
        
        // Create rain drops
        const rainGroup = new THREE.Group();
        const rainMaterial = new THREE.MeshPhongMaterial({ color: 0x43CBFF });
        
        for (let i = 0; i < 20; i++) {
          const rainDrop = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8),
            rainMaterial
          );
          
          // Random position under the clouds
          rainDrop.position.x = (Math.random() - 0.5) * 2;
          rainDrop.position.y = (Math.random() - 0.5) * 2;
          rainDrop.position.z = (Math.random() - 0.5);
          
          // Rotate to point downward
          rainDrop.rotation.x = Math.PI / 2;
          
          rainGroup.add(rainDrop);
        }
        
        // Add all elements to the model
        model.add(ground);
        model.add(sun);
        model.add(cloud1);
        model.add(cloud2);
        model.add(rainGroup);
        break;
        
      default:
        // Create a default cube model
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshPhongMaterial({ color: 0x6C63FF });
        const cube = new THREE.Mesh(geometry, material);
        model.add(cube);
    }
    
    // Add model to scene
    scene.add(model);
    modelRef.current = model;
    
    // Position camera to view model properly
    if (cameraRef.current) {
      cameraRef.current.position.z = 5;
    }
  }, []);
  
  // Function to initialize Three.js viewer
  const initViewer = useCallback((projectIndex: number) => {
    // Check for WebGL support
    if (!isWebGLAvailable()) {
      console.warn('WebGL is not available in your browser. Skipping 3D project viewer initialization.');
      if (modalRef.current) {
        modalRef.current.style.display = 'none';
      }
      return;
    }
    
    try {
      // Clean up any prior viewer instance
      cleanupViewerRef.current?.();
      cleanupViewerRef.current = null;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      // Clear previous renderer if exists
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      // Get container dimensions
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      // Create scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x121212);
      sceneRef.current = scene;
      
      // Create camera
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 5;
      cameraRef.current = camera;
      
      // Create renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
      
      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
      
      // Create 3D model based on project index
      createProjectModel(projectIndex, scene);
      
      // Add mouse controls for rotation
      container.addEventListener('mousedown', onMouseDown);
      container.addEventListener('mousemove', onMouseMove);
      container.addEventListener('mouseup', onMouseUp);
      container.addEventListener('mouseleave', onMouseUp);
      
      // Handle window resize
      const handleResize = () => {
        if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
        
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      };
      
      window.addEventListener('resize', handleResize);
      
      // Animation loop
      const animate = () => {
        if (!isOpen) return;
        
        rafIdRef.current = requestAnimationFrame(animate);
        
        // Apply rotation to model
        if (modelRef.current) {
          modelRef.current.rotation.y += (mouseState.current.targetRotationY - modelRef.current.rotation.y) * 0.1;
          modelRef.current.rotation.x += (mouseState.current.targetRotationX - modelRef.current.rotation.x) * 0.1;
          
          // Add automatic rotation when not interacting
          if (!mouseState.current.isMouseDown) {
            modelRef.current.rotation.y += 0.005;
          }
        }
        
        // Render scene
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };
      
      // Start animation
      animate();
      
      // Clean up function
      const cleanup = () => {
        window.removeEventListener('resize', handleResize);
        container.removeEventListener('mousedown', onMouseDown);
        container.removeEventListener('mousemove', onMouseMove);
        container.removeEventListener('mouseup', onMouseUp);
        container.removeEventListener('mouseleave', onMouseUp);

        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }

        if (rendererRef.current) {
          rendererRef.current.dispose();
          rendererRef.current = null;
        }

        // Remove canvas from DOM
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      };

      cleanupViewerRef.current = cleanup;
    } catch (error) {
      console.error('Error initializing 3D project viewer:', error);
    }
  }, [isOpen, createProjectModel, onMouseDown, onMouseMove, onMouseUp]);
  
  // Function to open project viewer
  const openProjectViewer = useCallback((project: ProjectData) => {
    // Use functional updates to avoid dependency on previous state
    setCurrentProject(() => project);
    setIsOpen(() => true);
    
    if (modalRef.current) {
      modalRef.current.style.display = 'block';
    }
    
    // Initialize Three.js scene
    initViewer(project.id);
  }, [initViewer]);
  
  // Function to close project viewer
  const closeProjectViewer = useCallback(() => {
    // Use functional updates to avoid dependency on previous state
    setIsOpen(() => false);
    setCurrentProject(() => null);
    
    if (modalRef.current) {
      modalRef.current.style.display = 'none';
    }
    
    // Clean up Three.js resources
    cleanupViewerRef.current?.();
    cleanupViewerRef.current = null;
  }, []);
  
  // Add 3D view buttons to project cards
  useEffect(() => {
    // Find all project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    // Add 3D view button to each project card
    projectCards.forEach((card, index) => {
      // Check if the button already exists
      const existingButton = card.querySelector('.view-3d-btn');
      if (existingButton) return;
      
      const projectLinks = card.querySelector('.project-links');
      if (!projectLinks) return;
      
      // Create 3D view button
      const viewButton = document.createElement('a');
      viewButton.href = '#';
      viewButton.className = 'project-link view-3d-btn';
      viewButton.innerHTML = '<i class="fas fa-cube"></i> View in 3D';
      viewButton.dataset.project = index.toString();
      
      // Add button to project links
      projectLinks.appendChild(viewButton);
      
      // Add click event to button
      viewButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (index < projects.length) {
          openProjectViewer(projects[index]);
        }
      });
    });
    
    // Clean up event listeners on unmount
    return () => {
      projectCards.forEach(card => {
        const viewButton = card.querySelector('.view-3d-btn');
        if (viewButton) {
          viewButton.removeEventListener('click', () => {});
        }
      });
    };
  }, [projects, openProjectViewer]);
  
  return (
    <ViewerModal ref={modalRef}>
      <CloseButton onClick={closeProjectViewer}>
        <i className="fas fa-times"></i>
      </CloseButton>
      <ViewerContainer ref={containerRef} />
      <InfoPanel>
        {currentProject && (
          <>
            <ProjectTitle>{currentProject.title}</ProjectTitle>
            <ProjectDescription>{currentProject.description}</ProjectDescription>
            <InstructionText>Click and drag to rotate the model</InstructionText>
          </>
        )}
      </InfoPanel>
    </ViewerModal>
  );
};

export default ThreeProjectViewer;
