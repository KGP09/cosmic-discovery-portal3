import React, { useEffect, useRef } from 'react';

const BackgroundStars = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Clear any existing stars
    container.innerHTML = '';
    
    // Create stars
    const starCount = Math.min(Math.floor(screenWidth * screenHeight / 2000), 300); // Limit max stars
    
    console.log('Creating stars:', starCount); // Debug line
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      star.style.opacity = `${Math.random() * 0.7 + 0.3}`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      star.style.animationDuration = `${Math.random() * 3 + 2}s`;
      
      star.classList.add('animate-stars');
      
      container.appendChild(star);
    }
    
    // Handle resize
    const handleResize = () => {
      container.innerHTML = '';
      const newStarCount = Math.min(Math.floor(window.innerWidth * window.innerHeight / 2000), 300);
      
      for (let i = 0; i < newStarCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        star.style.opacity = `${Math.random() * 0.7 + 0.3}`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        
        star.classList.add('animate-stars');
        
        container.appendChild(star);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return <div ref={containerRef} className="stars-container" />;
};

export default BackgroundStars;
