// Optimized Custom Cursor Effect
document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.querySelector('.custom-cursor');
  
  if (!cursor) {
    console.warn('Custom cursor element not found. Skipping cursor initialization.');
    return;
  }
  
  // Detect mobile/touch devices and disable custom cursor
  const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0));
  };
  
  if (isTouchDevice()) {
    cursor.style.display = 'none';
    return; // Exit early on touch devices
  }
  
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
  
  // Use requestAnimationFrame for smoother cursor movement
  let cursorX = 0;
  let cursorY = 0;
  let currentX = 0;
  let currentY = 0;
  
  // Update cursor position with faster animation
  const render = () => {
    // Faster interpolation for cursor movement (increased from 0.1 to 0.5)
    currentX += (cursorX - currentX) * 0.5;
    currentY += (cursorY - currentY) * 0.5;
    
    cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(render);
  };
  
  // Start animation loop
  requestAnimationFrame(render);
  
  // Update cursor target position
  const updateCursorPosition = throttle((e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  }, 5); // Throttle to reduce event handling
  
  // Use event delegation for hover effects
  document.body.addEventListener('mouseover', (e) => {
    const target = e.target;
    if (
      target.tagName === 'A' || 
      target.tagName === 'BUTTON' || 
      target.classList.contains('tilt-effect') ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.closest('.project-card') ||
      target.closest('.skill-card') ||
      target.closest('.service-card')
    ) {
      cursor.classList.add('hover');
    }
  });
  
  document.body.addEventListener('mouseout', (e) => {
    const target = e.target;
    if (
      target.tagName === 'A' || 
      target.tagName === 'BUTTON' || 
      target.classList.contains('tilt-effect') ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.closest('.project-card') ||
      target.closest('.skill-card') ||
      target.closest('.service-card')
    ) {
      cursor.classList.remove('hover');
    }
  });
  
  // Hide default cursor
  document.body.style.cursor = 'none';
  
  // Hide custom cursor when leaving window
  document.addEventListener('mouseout', (e) => {
    if (e.relatedTarget === null) {
      cursor.style.opacity = '0';
    }
  });
  
  // Show custom cursor when entering window
  document.addEventListener('mouseover', (e) => {
    if (document.body.contains(e.target)) {
      cursor.style.opacity = '1';
    }
  });
  
  // Update cursor position on mouse move
  document.addEventListener('mousemove', updateCursorPosition);
  
  // Clean up event listeners when navigating away
  window.addEventListener('beforeunload', () => {
    document.removeEventListener('mousemove', updateCursorPosition);
  });
});
