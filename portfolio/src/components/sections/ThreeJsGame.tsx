import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
import { isWebGLAvailable } from '../../utils/webGLUtils';

const GameSection = styled.section`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 100px 0;
  position: relative;
`;

const GameContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  text-align: center;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 70px;
    height: 3px;
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem;
`;

const GameCanvas = styled.div`
  width: 100%;
  height: 500px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  position: relative;
`;

const GameControls = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const GameScore = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const GameButton = styled.button`
  padding: 0.8rem 2rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: all ${({ theme }) => theme.transitions.medium};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const GameInstructions = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  max-width: 600px;
`;

const InstructionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const InstructionList = styled.ul`
  list-style-type: disc;
  padding-left: 1.5rem;
`;

const InstructionItem = styled.li`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
  line-height: 1.6;
`;

const WebGLError = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  text-align: center;
  margin: 2rem 0;
`;

// Game class to handle all game logic separately from React
class Game {
  scene: THREE.Scene | null = null;
  camera: THREE.PerspectiveCamera | null = null;
  renderer: THREE.WebGLRenderer | null = null;
  player: THREE.Mesh | null = null;
  obstacles: THREE.Mesh[] = [];
  collectibles: THREE.Mesh[] = [];
  animationFrame: number | null = null;
  lastTime: number = 0;
  gameSpeed: number = 1;
  score: number = 0;
  isRunning: boolean = false;
  onScoreChange: (score: number) => void = () => {};
  
  // Player movement state
  keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
  };
  
  constructor(container: HTMLDivElement, onScoreChange: (score: number) => void) {
    this.onScoreChange = onScoreChange;
    this.init(container);
  }
  
  init(container: HTMLDivElement) {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a2e);
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.innerHTML = '';
    container.appendChild(this.renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
    
    // Create game environment
    this.createEnvironment();
    
    // Set up event listeners
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('resize', () => this.handleResize(container));
  }
  
  handleKeyDown = (e: KeyboardEvent) => {
    // Only prevent default behavior if the game is running
    if (this.isRunning) {
      if (e.code === 'ArrowUp' || e.code === 'ArrowDown' || 
          e.code === 'ArrowLeft' || e.code === 'ArrowRight' || 
          e.code === 'Space') {
        e.preventDefault();
      }
    }
    
    if (e.code === 'ArrowUp') this.keys.ArrowUp = true;
    if (e.code === 'ArrowDown') this.keys.ArrowDown = true;
    if (e.code === 'ArrowLeft') this.keys.ArrowLeft = true;
    if (e.code === 'ArrowRight') this.keys.ArrowRight = true;
    if (e.code === 'Space') this.keys.Space = true;
  };
  
  handleKeyUp = (e: KeyboardEvent) => {
    // Only prevent default behavior if the game is running
    if (this.isRunning) {
      if (e.code === 'ArrowUp' || e.code === 'ArrowDown' || 
          e.code === 'ArrowLeft' || e.code === 'ArrowRight' || 
          e.code === 'Space') {
        e.preventDefault();
      }
    }
    
    if (e.code === 'ArrowUp') this.keys.ArrowUp = false;
    if (e.code === 'ArrowDown') this.keys.ArrowDown = false;
    if (e.code === 'ArrowLeft') this.keys.ArrowLeft = false;
    if (e.code === 'ArrowRight') this.keys.ArrowRight = false;
    if (e.code === 'Space') this.keys.Space = false;
  };
  
  handleResize(container: HTMLDivElement) {
    if (!this.camera || !this.renderer) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  
  createEnvironment() {
    if (!this.scene) return;
    
    // Create player
    const playerGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const playerMaterial = new THREE.MeshPhongMaterial({ color: 0x6C63FF });
    this.player = new THREE.Mesh(playerGeometry, playerMaterial);
    this.player.position.set(0, 0, 0);
    this.scene.add(this.player);
    
    // Create game floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x0f3460,
      side: THREE.DoubleSide
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    floor.position.y = -1;
    this.scene.add(floor);
    
    // Create initial obstacles and collectibles
    this.createObstacles();
    this.createCollectibles();
  }
  
  createObstacles() {
    if (!this.scene) return;
    
    // Clear existing obstacles
    this.obstacles.forEach(obstacle => {
      if (this.scene) this.scene.remove(obstacle);
    });
    this.obstacles = [];
    
    // Create new obstacles
    for (let i = 0; i < 5; i++) {
      const obstacleGeometry = new THREE.BoxGeometry(
        Math.random() * 0.5 + 0.5,
        Math.random() * 0.5 + 0.5,
        Math.random() * 0.5 + 0.5
      );
      const obstacleMaterial = new THREE.MeshPhongMaterial({ color: 0xe94560 });
      const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
      
      // Position obstacles randomly in the scene
      obstacle.position.set(
        Math.random() * 10 - 5,
        Math.random() * 2 - 1,
        Math.random() * 10 - 15 // Start behind the camera
      );
      
      this.scene.add(obstacle);
      this.obstacles.push(obstacle);
    }
  }
  
  createCollectibles() {
    if (!this.scene) return;
    
    // Clear existing collectibles
    this.collectibles.forEach(collectible => {
      if (this.scene) this.scene.remove(collectible);
    });
    this.collectibles = [];
    
    // Create new collectibles
    for (let i = 0; i < 5; i++) {
      const collectibleGeometry = new THREE.OctahedronGeometry(0.3, 0);
      const collectibleMaterial = new THREE.MeshPhongMaterial({ color: 0xffbd69 });
      const collectible = new THREE.Mesh(collectibleGeometry, collectibleMaterial);
      
      // Position collectibles randomly in the scene
      collectible.position.set(
        Math.random() * 10 - 5,
        Math.random() * 2 - 1,
        Math.random() * 10 - 15 // Start behind the camera
      );
      
      this.scene.add(collectible);
      this.collectibles.push(collectible);
    }
  }
  
  start() {
    // Reset game state
    this.score = 0;
    this.onScoreChange(this.score);
    this.gameSpeed = 1;
    
    // Reset player position
    if (this.player) {
      this.player.position.set(0, 0, 0);
    }
    
    // Create new obstacles and collectibles
    this.createObstacles();
    this.createCollectibles();
    
    // Start game loop
    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop();
  }
  
  stop() {
    this.isRunning = false;
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
  
  gameLoop = () => {
    if (!this.isRunning) return;
    
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;
    
    // Update game state
    this.updatePlayer(deltaTime);
    this.updateObstacles(deltaTime);
    this.updateCollectibles(deltaTime);
    this.checkCollisions();
    
    // Render scene
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
    
    // Continue game loop
    this.animationFrame = requestAnimationFrame(this.gameLoop);
  };
  
  updatePlayer(deltaTime: number) {
    if (!this.player) return;
    
    const moveSpeed = 3 * deltaTime;
    
    if (this.keys.ArrowUp && this.player.position.y < 2) {
      this.player.position.y += moveSpeed;
    }
    if (this.keys.ArrowDown && this.player.position.y > -1) {
      this.player.position.y -= moveSpeed;
    }
    if (this.keys.ArrowLeft && this.player.position.x > -5) {
      this.player.position.x -= moveSpeed;
    }
    if (this.keys.ArrowRight && this.player.position.x < 5) {
      this.player.position.x += moveSpeed;
    }
    
    // Add some rotation to the player for visual effect
    this.player.rotation.x += 1 * deltaTime;
    this.player.rotation.y += 1 * deltaTime;
  }
  
  updateObstacles(deltaTime: number) {
    if (!this.scene) return;
    
    const moveSpeed = 5 * deltaTime * this.gameSpeed;
    
    this.obstacles.forEach(obstacle => {
      // Move obstacles toward the camera
      obstacle.position.z += moveSpeed;
      
      // If obstacle passes the camera, reset its position
      if (obstacle.position.z > 5) {
        obstacle.position.set(
          Math.random() * 10 - 5,
          Math.random() * 2 - 1,
          Math.random() * 10 - 15 // Reset behind the camera
        );
        
        // Increase game speed slightly
        this.gameSpeed += 0.01;
      }
    });
  }
  
  updateCollectibles(deltaTime: number) {
    if (!this.scene) return;
    
    const moveSpeed = 5 * deltaTime * this.gameSpeed;
    
    this.collectibles.forEach(collectible => {
      // Move collectibles toward the camera
      collectible.position.z += moveSpeed;
      
      // Add some rotation for visual effect
      collectible.rotation.x += 2 * deltaTime;
      collectible.rotation.y += 2 * deltaTime;
      
      // If collectible passes the camera, reset its position
      if (collectible.position.z > 5) {
        collectible.position.set(
          Math.random() * 10 - 5,
          Math.random() * 2 - 1,
          Math.random() * 10 - 15 // Reset behind the camera
        );
      }
    });
  }
  
  checkCollisions() {
    if (!this.player || !this.scene) return;
    
    const playerPosition = this.player.position.clone();
    const playerRadius = 0.3; // Sphere radius
    
    // Check collisions with obstacles
    for (let i = 0; i < this.obstacles.length; i++) {
      const obstacle = this.obstacles[i];
      const obstaclePosition = obstacle.position.clone();
      const distance = playerPosition.distanceTo(obstaclePosition);
      
      // Simple collision detection based on distance
      if (distance < playerRadius + 0.5) {
        // Game over on collision with obstacle
        this.stop();
        return;
      }
    }
    
    // Check collisions with collectibles
    for (let i = 0; i < this.collectibles.length; i++) {
      const collectible = this.collectibles[i];
      const collectiblePosition = collectible.position.clone();
      const distance = playerPosition.distanceTo(collectiblePosition);
      
      // Simple collision detection based on distance
      if (distance < playerRadius + 0.3) {
        // Collect the collectible
        if (this.scene) {
          this.scene.remove(collectible);
          
          // Create a new collectible to replace the collected one
          const collectibleGeometry = new THREE.OctahedronGeometry(0.3, 0);
          const collectibleMaterial = new THREE.MeshPhongMaterial({ color: 0xffbd69 });
          const newCollectible = new THREE.Mesh(collectibleGeometry, collectibleMaterial);
          
          newCollectible.position.set(
            Math.random() * 10 - 5,
            Math.random() * 2 - 1,
            Math.random() * 10 - 15 // Start behind the camera
          );
          
          this.scene.add(newCollectible);
          this.collectibles[i] = newCollectible;
          
          // Increase score
          this.score += 10;
          this.onScoreChange(this.score);
        }
      }
    }
  }
  
  cleanup() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.stop();
    
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

const ThreeJsGame: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const [score, setScore] = useState(0);
  
  // Check for WebGL support
  useEffect(() => {
    if (!isWebGLAvailable()) {
      setWebGLAvailable(false);
    }
  }, []);
  
  // Initialize the game
  useEffect(() => {
    if (!webGLAvailable || !canvasRef.current) return;
    
    // Create game instance
    const game = new Game(canvasRef.current, (newScore) => {
      // Use functional update to avoid dependency on previous state
      setScore(() => newScore);
    });
    gameRef.current = game;
    
    // Clean up
    return () => {
      if (gameRef.current) {
        gameRef.current.cleanup();
      }
    };
  }, [webGLAvailable]);
  
  // Start or stop the game
  const toggleGame = () => {
    if (!gameRef.current) return;
    
    if (gameStarted) {
      gameRef.current.stop();
      setGameStarted(false);
    } else {
      gameRef.current.start();
      setGameStarted(true);
    }
  };
  
  return (
    <GameSection id="threejs-game">
      <GameContainer>
        <SectionTitle>Three.js Game</SectionTitle>
        <SectionSubtitle>
          A simple 3D game built with Three.js. Collect the yellow gems while avoiding the red obstacles!
        </SectionSubtitle>
        
        {!webGLAvailable ? (
          <WebGLError>
            <h3>WebGL Not Available</h3>
            <p>Your browser or device does not support WebGL, which is required to run this game.</p>
          </WebGLError>
        ) : (
          <>
            <GameCanvas ref={canvasRef} />
            
            <GameControls>
              <GameScore>Score: {score}</GameScore>
              <GameButton onClick={toggleGame}>
                {gameStarted ? 'End Game' : 'Start Game'}
              </GameButton>
            </GameControls>
            
            <GameInstructions>
              <InstructionTitle>How to Play</InstructionTitle>
              <InstructionList>
                <InstructionItem>Use the arrow keys to move your character (the purple sphere)</InstructionItem>
                <InstructionItem>Collect the yellow gems to earn points</InstructionItem>
                <InstructionItem>Avoid the red obstacles - hitting one ends the game</InstructionItem>
                <InstructionItem>The game gets progressively faster as you play</InstructionItem>
              </InstructionList>
            </GameInstructions>
          </>
        )}
      </GameContainer>
    </GameSection>
  );
};

export default ThreeJsGame;
