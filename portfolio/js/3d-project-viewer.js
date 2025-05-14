// 3D Project Viewer with Three.js
// Using the global THREE object from the CDN

document.addEventListener('DOMContentLoaded', () => {
  // Check if THREE is available
  if (typeof THREE === 'undefined') {
    console.error('THREE.js library not loaded. Skipping 3D project viewer initialization.');
    return;
  }

  // Only initialize if the projects section exists
  const projectsSection = document.getElementById('projects');
  if (!projectsSection) {
    console.warn('Projects section not found. Skipping 3D project viewer initialization.');
    return;
  }
  
  // Find all project cards
  const projectCards = document.querySelectorAll('.project-card');
  
  // Add 3D view button to each project card
  projectCards.forEach((card, index) => {
    const projectContent = card.querySelector('.project-content');
    const projectLinks = card.querySelector('.project-links');
    
    // Create 3D view button
    const viewButton = document.createElement('a');
    viewButton.href = 'javascript:void(0)';
    viewButton.className = 'project-link view-3d-btn';
    viewButton.innerHTML = '<i class="fas fa-cube"></i> View in 3D';
    viewButton.dataset.project = index;
    
    // Add button to project links
    if (projectLinks) {
      projectLinks.appendChild(viewButton);
    }
    
    // Add click event to button
    viewButton.addEventListener('click', (e) => {
      e.preventDefault();
      openProjectViewer(card, index);
    });
  });
  
  // Create modal container for 3D viewer
  const viewerModal = document.createElement('div');
  viewerModal.className = 'project-viewer-modal';
  viewerModal.style.display = 'none';
  viewerModal.style.position = 'fixed';
  viewerModal.style.top = '0';
  viewerModal.style.left = '0';
  viewerModal.style.width = '100%';
  viewerModal.style.height = '100%';
  viewerModal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
  viewerModal.style.zIndex = '1000';
  viewerModal.style.overflow = 'hidden';
  
  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'viewer-close-btn';
  closeButton.innerHTML = '<i class="fas fa-times"></i>';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '20px';
  closeButton.style.right = '20px';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.color = 'white';
  closeButton.style.fontSize = '24px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.zIndex = '1001';
  
  // Create container for the 3D viewer
  const viewerContainer = document.createElement('div');
  viewerContainer.className = 'viewer-container';
  viewerContainer.style.width = '100%';
  viewerContainer.style.height = '100%';
  
  // Create info panel
  const infoPanel = document.createElement('div');
  infoPanel.className = 'viewer-info-panel';
  infoPanel.style.position = 'absolute';
  infoPanel.style.bottom = '0';
  infoPanel.style.left = '0';
  infoPanel.style.width = '100%';
  infoPanel.style.padding = '20px';
  infoPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  infoPanel.style.color = 'white';
  infoPanel.style.zIndex = '1001';
  
  // Add elements to modal
  viewerModal.appendChild(closeButton);
  viewerModal.appendChild(viewerContainer);
  viewerModal.appendChild(infoPanel);
  
  // Add modal to body
  document.body.appendChild(viewerModal);
  
  // Close button event
  closeButton.addEventListener('click', () => {
    viewerModal.style.display = 'none';
    // Clean up Three.js resources
    if (currentRenderer) {
      currentRenderer.dispose();
      currentRenderer = null;
    }
  });
  
  // Variables to store current viewer state
  let currentRenderer = null;
  let currentScene = null;
  let currentCamera = null;
  let currentModel = null;
  let isMouseDown = false;
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let previousMouseX = 0;
  let previousMouseY = 0;
  
  // Function to open project viewer
  function openProjectViewer(projectCard, projectIndex) {
    // Show modal
    viewerModal.style.display = 'block';
    
    // Get project info
    let projectTitle = "Project";
    let projectDescription = "A 3D visualization of the project.";
    
    const titleElement = projectCard.querySelector('.project-title');
    const descriptionElement = projectCard.querySelector('.project-description');
    
    if (titleElement) {
      projectTitle = titleElement.textContent;
    }
    
    if (descriptionElement) {
      projectDescription = descriptionElement.textContent;
    }
    
    // Update info panel
    infoPanel.innerHTML = `
      <h3 style="margin-bottom: 10px; font-size: 1.5rem;">${projectTitle}</h3>
      <p>${projectDescription}</p>
      <p style="margin-top: 10px; font-size: 0.9rem;">Click and drag to rotate the model</p>
    `;
    
    // Initialize Three.js scene
    initViewer(projectIndex);
  }
  
  // Function to initialize Three.js viewer
  function initViewer(projectIndex) {
    // Clear previous renderer if exists
    if (currentRenderer) {
      currentRenderer.dispose();
    }
    
    // Get container dimensions
    const container = viewerContainer;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);
    currentScene = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    currentCamera = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    currentRenderer = renderer;
    
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
    
    // Handle mouse events
    function onMouseDown(event) {
      isMouseDown = true;
      previousMouseX = event.clientX;
      previousMouseY = event.clientY;
    }
    
    function onMouseMove(event) {
      if (isMouseDown) {
        mouseX = event.clientX - previousMouseX;
        mouseY = event.clientY - previousMouseY;
        
        targetRotationY += mouseX * 0.01;
        targetRotationX += mouseY * 0.01;
        
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
      }
    }
    
    function onMouseUp() {
      isMouseDown = false;
    }
    
    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      
      // Apply rotation to model
      if (currentModel) {
        currentModel.rotation.y += (targetRotationY - currentModel.rotation.y) * 0.1;
        currentModel.rotation.x += (targetRotationX - currentModel.rotation.x) * 0.1;
        
        // Add automatic rotation when not interacting
        if (!isMouseDown) {
          currentModel.rotation.y += 0.005;
        }
      }
      
      // Render scene
      renderer.render(scene, camera);
    }
    
    // Handle window resize
    function handleResize() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate();
  }
  
  // Function to create project model
  function createProjectModel(projectIndex, scene) {
    // Clear previous model if exists
    if (currentModel) {
      scene.remove(currentModel);
    }
    
    // Create different models based on project index
    let model;
    
    switch (projectIndex) {
      case 0: // E-commerce Website
        // Create a store/shopping bag model
        model = new THREE.Group();
        
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
        model = new THREE.Group();
        
        // Create board
        const boardGeometry = new THREE.BoxGeometry(3, 2, 0.1);
        const boardMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const board = new THREE.Mesh(boardGeometry, boardMaterial);
        
        // Create task cards
        const createTaskCard = (x, y, color) => {
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
        model = new THREE.Group();
        
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
        const createCloud = (x, y, z, scale) => {
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
        model = new THREE.Mesh(geometry, material);
    }
    
    // Add model to scene
    scene.add(model);
    currentModel = model;
    
    // Position camera to view model properly
    currentCamera.position.z = 5;
  }
});
