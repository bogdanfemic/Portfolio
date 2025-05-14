// Optimized Parallax Effect
document.addEventListener('DOMContentLoaded', () => {
  // Check if the device supports parallax (non-touch devices)
  const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0));
  };
  
  // Don't initialize parallax on touch devices
  if (isTouchDevice()) return;
  
  // Create parallax elements
  const createParallaxElements = () => {
    const homeSection = document.getElementById('home');
    if (!homeSection) {
      console.warn('Home section not found. Skipping parallax effect initialization.');
      return;
    }
    
    // Add parallax class to home section
    homeSection.classList.add('parallax');
    
    // Reduced number of layers for better performance
    const layers = [
      { class: 'parallax-layer-1', depth: 0.05, html: '<div class="parallax-shape circle"></div>' },
      { class: 'parallax-layer-2', depth: 0.1, html: '<div class="parallax-shape square"></div>' }
    ];
    
    // Add layers to home section
    const fragment = document.createDocumentFragment(); // Use document fragment for better performance
    layers.forEach(layer => {
      const layerElement = document.createElement('div');
      layerElement.className = `parallax-layer ${layer.class}`;
      layerElement.setAttribute('data-depth', layer.depth);
      layerElement.innerHTML = layer.html;
      fragment.appendChild(layerElement);
    });
    homeSection.appendChild(fragment);
    
    // Add CSS for parallax shapes
    const style = document.createElement('style');
    style.textContent = `
      .parallax {
        position: relative;
        overflow: hidden;
      }
      
      .parallax-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        will-change: transform;
        pointer-events: none;
      }
      
      .parallax-shape {
        position: absolute;
        opacity: 0.1;
        background-color: rgba(255, 255, 255, 0.5);
      }
      
      .circle {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        top: 20%;
        left: 10%;
      }
      
      .square {
        width: 100px;
        height: 100px;
        bottom: 30%;
        right: 15%;
        transform: rotate(45deg);
      }
    `;
    document.head.appendChild(style);
  };
  
  // Throttle function to limit how often a function can be called
  const throttle = (func, limit) => {
    let lastFunc;
    let lastRan;
    return function() {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function() {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  };
  
  // Handle mouse movement for parallax effect with throttling
  const handleMouseMove = throttle((e) => {
    const layers = document.querySelectorAll('.parallax-layer');
    if (!layers.length) return;
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Use requestAnimationFrame for smoother animations
    requestAnimationFrame(() => {
      layers.forEach(layer => {
        const depth = parseFloat(layer.getAttribute('data-depth'));
        const moveX = (mouseX * depth) * -1;
        const moveY = (mouseY * depth) * -1;
        
        // Use transform translate instead of translate3d for better performance
        layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });
  }, 16); // Throttle to approximately 60fps
  
  // Initialize parallax effect
  createParallaxElements();
  document.addEventListener('mousemove', handleMouseMove);
  
  // Clean up event listener when navigating away
  window.addEventListener('beforeunload', () => {
    document.removeEventListener('mousemove', handleMouseMove);
  });
});
