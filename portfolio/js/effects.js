// Optimized Particle Animation Background
const createParticleBackground = () => {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-background';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '-1';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  // Reduced particle count for better performance
  const particleCount = 50;
  const colors = ['#6C63FF', '#43CBFF', '#FF6584'];
  
  // Use a throttled resize handler to improve performance
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  
  // Throttle function to limit how often a function can be called
  const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  window.addEventListener('resize', throttle(resizeCanvas, 100));
  resizeCanvas();

  // Optimized Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1; // Smaller particles
      this.speedX = Math.random() * 1 - 0.5; // Slower movement
      this.speedY = Math.random() * 1 - 0.5; // Slower movement
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = Math.random() * 0.3 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width || this.x < 0) {
        this.speedX = -this.speedX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.speedY = -this.speedY;
      }
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Initialize particles
  const init = () => {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  };

  // Use requestAnimationFrame with frame limiting for smoother animation
  let lastTime = 0;
  const fps = 30; // Limit to 30 frames per second
  const fpsInterval = 1000 / fps;
  
  // Optimized animation loop
  const animate = (timestamp) => {
    // Calculate elapsed time
    if (!lastTime) lastTime = timestamp;
    const elapsed = timestamp - lastTime;
    
    // Only render if enough time has passed
    if (elapsed > fpsInterval) {
      lastTime = timestamp - (elapsed % fpsInterval);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      // Draw connections between nearby particles only
      // Use spatial partitioning to reduce calculations
      const gridSize = 100;
      const grid = {};
      
      // Place particles in grid cells
      particles.forEach((particle, index) => {
        const cellX = Math.floor(particle.x / gridSize);
        const cellY = Math.floor(particle.y / gridSize);
        const cellKey = `${cellX},${cellY}`;
        
        if (!grid[cellKey]) {
          grid[cellKey] = [];
        }
        
        grid[cellKey].push(index);
      });
      
      // Check connections only within the same cell and adjacent cells
      Object.keys(grid).forEach(cellKey => {
        const [cellX, cellY] = cellKey.split(',').map(Number);
        
        // Check particles in current cell
        for (let i = 0; i < grid[cellKey].length; i++) {
          const particleIndex1 = grid[cellKey][i];
          
          // Check against other particles in same cell
          for (let j = i + 1; j < grid[cellKey].length; j++) {
            const particleIndex2 = grid[cellKey][j];
            drawConnectionIfClose(particleIndex1, particleIndex2);
          }
          
          // Check against particles in adjacent cells
          for (let nx = -1; nx <= 1; nx++) {
            for (let ny = -1; ny <= 1; ny++) {
              if (nx === 0 && ny === 0) continue; // Skip current cell
              
              const neighborKey = `${cellX + nx},${cellY + ny}`;
              if (grid[neighborKey]) {
                grid[neighborKey].forEach(particleIndex2 => {
                  drawConnectionIfClose(particleIndex1, particleIndex2);
                });
              }
            }
          }
        }
      });
    }
    
    requestAnimationFrame(animate);
  };
  
  // Helper function to draw connection between close particles
  const drawConnectionIfClose = (index1, index2) => {
    const p1 = particles[index1];
    const p2 = particles[index2];
    
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const distance = dx * dx + dy * dy; // Avoid square root for performance
    
    if (distance < 10000) { // 100 squared
      ctx.beginPath();
      ctx.strokeStyle = p1.color;
      ctx.globalAlpha = 0.1 * (1 - distance / 10000);
      ctx.lineWidth = 1;
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  };

  init();
  requestAnimationFrame(animate);
};

// Scroll-triggered animations
const initScrollAnimations = () => {
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    if (elements.length === 0) {
      return; // No elements to animate
    }
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;
      
      if (elementPosition < screenPosition) {
        element.classList.add('animate');
      }
    });
  };
  
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Run once on load
};

// Dark/Light Mode Toggle
const initDarkModeToggle = () => {
  // Create toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'dark-mode-toggle';
  toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
  toggleBtn.classList.add('theme-toggle');
  document.body.appendChild(toggleBtn);
  
  // Check for saved user preference
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    updateDarkModeElements(true);
  }
  
  // Toggle theme
  toggleBtn.addEventListener('click', () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    
    if (isDarkMode) {
      localStorage.setItem('theme', 'dark');
      toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      localStorage.setItem('theme', 'light');
      toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    updateDarkModeElements(isDarkMode);
  });
};

// Update elements for dark mode
const updateDarkModeElements = (isDarkMode) => {
  // Update profile image placeholder in dark mode
  const profileImagePlaceholder = document.querySelector('.about-image div');
  if (profileImagePlaceholder) {
    profileImagePlaceholder.style.backgroundColor = isDarkMode ? '#333333' : '#f0f0f0';
    profileImagePlaceholder.style.color = isDarkMode ? '#666666' : '#aaaaaa';
  }
  
  // Update project image placeholders in dark mode
  const projectImagePlaceholders = document.querySelectorAll('.project-image');
  projectImagePlaceholders.forEach(placeholder => {
    placeholder.style.backgroundColor = isDarkMode ? '#333333' : '#e0e0e0';
    placeholder.style.color = isDarkMode ? '#666666' : '#aaaaaa';
  });
  
  // Update particle background colors if needed
  const canvas = document.getElementById('particle-background');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
};

// Interactive typing effect
const initTypingEffect = () => {
  const element = document.querySelector('.typing-effect');
  if (!element) return;
  
  const text = element.getAttribute('data-text');
  if (!text) {
    console.warn('Typing effect element found but no data-text attribute provided.');
    return;
  }
  
  let words;
  try {
    words = JSON.parse(text);
  } catch (error) {
    console.error('Error parsing typing effect data-text attribute:', error);
    return;
  }
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  const type = () => {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      element.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      element.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 1000; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
    
    setTimeout(type, typingSpeed);
  };
  
  type();
};

// Interactive project filter
const initProjectFilter = () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project-card');
  
  if (filterButtons.length === 0 || projects.length === 0) {
    console.warn('Project filter buttons or project cards not found. Skipping project filter initialization.');
    return;
  }
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      const filter = button.getAttribute('data-filter');
      
      // Show/hide projects based on filter
      projects.forEach(project => {
        if (filter === 'all' || project.classList.contains(filter)) {
          project.style.display = 'block';
          setTimeout(() => {
            project.style.opacity = '1';
            project.style.transform = 'translateY(0)';
          }, 100);
        } else {
          project.style.opacity = '0';
          project.style.transform = 'translateY(20px)';
          setTimeout(() => {
            project.style.display = 'none';
          }, 300);
        }
      });
    });
  });
};

// 3D Tilt Effect on Project Cards
const initTiltEffect = () => {
  const cards = document.querySelectorAll('.tilt-effect');
  
  if (cards.length === 0) {
    console.warn('Tilt effect elements not found. Skipping tilt effect initialization.');
    return;
  }
  
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });
};

// Initialize all effects
document.addEventListener('DOMContentLoaded', () => {
  createParticleBackground();
  initScrollAnimations();
  initDarkModeToggle();
  initTypingEffect();
  initProjectFilter();
  initTiltEffect();
});
