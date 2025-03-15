import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const SolarSystem = () => {
  const mountRef = useRef(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [showOrbits, setShowOrbits] = useState(true);
  const [realisticScale, setRealisticScale] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 30, 80);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);
    
    const sunLight = new THREE.PointLight(0xffffff, 2, 300, 1);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 500;

    // Textures
    const textureLoader = new THREE.TextureLoader();
    
    // Sun with realistic texture and color
    const sunSize = realisticScale ? 109 : 5;
    const sunGeometry = new THREE.SphereGeometry(sunSize, 64, 64);
    
    // Create sun material with gradient and details
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffdd00,
      emissive: 0xff8800,
      emissiveIntensity: 0.5,
    });
    
    // Add noise to the sun surface to make it more detailed
    const sunCanvas = document.createElement('canvas');
    sunCanvas.width = 1024;
    sunCanvas.height = 1024;
    const sunCtx = sunCanvas.getContext('2d');
    
    // Create gradient background
    const sunGradient = sunCtx.createRadialGradient(
      512, 512, 0,
      512, 512, 512
    );
    sunGradient.addColorStop(0, '#ffff00');
    sunGradient.addColorStop(0.5, '#ffaa00');
    sunGradient.addColorStop(1, '#ff5500');
    
    sunCtx.fillStyle = sunGradient;
    sunCtx.fillRect(0, 0, 1024, 1024);
    
    // Add noise/details to make the sun's surface more dynamic
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = Math.random() * 10 + 5;
      const opacity = Math.random() * 0.2 + 0.1;
      
      sunCtx.beginPath();
      sunCtx.arc(x, y, radius, 0, Math.PI * 2);
      sunCtx.fillStyle = `rgba(255, 200, 0, ${opacity})`;
      sunCtx.fill();
    }
    
    const sunTexture = new THREE.CanvasTexture(sunCanvas);
    sunMaterial.map = sunTexture;
    
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Create a glow effect for sun
    const sunGlowGeometry = new THREE.SphereGeometry(sunSize * 1.2, 32, 32);
    const sunGlowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        c: { type: "f", value: 0.1 },
        p: { type: "f", value: 2.0 },
        glowColor: { type: "c", value: new THREE.Color(0xffaa00) },
        viewVector: { type: "v3", value: camera.position }
      },
      vertexShader: `
        uniform vec3 viewVector;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normal);
          vec3 vNormel = normalize(viewVector);
          intensity = pow(0.6 - dot(vNormal, vNormel), 2.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4(glow, 1.0);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    
    const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
    scene.add(sunGlow);

    // Enhanced planet data with realistic colors and features
    const planetData = [
      { 
        name: 'Mercury', 
        radius: realisticScale ? 0.383 : 0.5, 
        distance: realisticScale ? 57.9 : 10, 
        rotationPeriod: 58.6, 
        orbitPeriod: 0.24, 
        obliquity: 0.034,
        color: 0x8a8a8a,
        surfaceColor: '#aa9988',
        details: [
          { color: '#887766', size: 0.01, count: 800 },
          { color: '#776655', size: 0.02, count: 400 }
        ]
      },
      { 
        name: 'Venus', 
        radius: realisticScale ? 0.949 : 0.9, 
        distance: realisticScale ? 108.2 : 15, 
        rotationPeriod: -243, 
        orbitPeriod: 0.62,
        obliquity: 177.4,
        color: 0xe39e1c,
        surfaceColor: '#d4b36a',
        details: [
          { color: '#c4a360', size: 0.02, count: 600 },
          { color: '#b49350', size: 0.04, count: 300 }
        ],
        hasAtmosphere: true,
        atmosphereColor: '#ecc085'
      },
      { 
        name: 'Earth', 
        radius: realisticScale ? 1 : 1, 
        distance: realisticScale ? 149.6 : 20, 
        rotationPeriod: 1, 
        orbitPeriod: 1,
        obliquity: 23.4,
        color: 0x3498db,
        surfaceColor: '#3366aa',
        details: [
          { color: '#117733', size: 0.03, count: 600 }, // continents
          { color: '#996633', size: 0.02, count: 400 }  // land features
        ],
        hasAtmosphere: true,
        atmosphereColor: '#aaddff',
        hasMoon: true,
        moonRadius: realisticScale ? 0.273 : 0.3,
        moonDistance: realisticScale ? 0.384 : 2,
        moonOrbitPeriod: 27.3,
        moonColor: '#aaaaaa',
        moonDetails: [
          { color: '#888888', size: 0.01, count: 800 },
          { color: '#666666', size: 0.02, count: 300 }
        ]
      },
      { 
        name: 'Mars', 
        radius: realisticScale ? 0.532 : 0.6, 
        distance: realisticScale ? 227.9 : 25, 
        rotationPeriod: 1.03, 
        orbitPeriod: 1.88,
        obliquity: 25.2,
        color: 0xc0392b,
        surfaceColor: '#bb5533',
        details: [
          { color: '#aa4422', size: 0.02, count: 700 },
          { color: '#993311', size: 0.03, count: 300 }
        ],
        hasAtmosphere: true,
        atmosphereColor: '#ffccbb'
      },
      { 
        name: 'Jupiter', 
        radius: realisticScale ? 11.21 : 2.5, 
        distance: realisticScale ? 778.5 : 32, 
        rotationPeriod: 0.41, 
        orbitPeriod: 11.86,
        obliquity: 3.1,
        color: 0xe67e22,
        hasDetailedTexture: true,
        surfaceColor: '#ddaa66',
        details: [
          { color: '#bb8844', size: 0.2, count: 20, type: 'bands' },
          { color: '#dd9955', size: 0.15, count: 20, type: 'bands' },
          { color: '#cc7733', size: 0.1, count: 1, type: 'spot' }
        ]
      },
      { 
        name: 'Saturn', 
        radius: realisticScale ? 9.45 : 2.2, 
        distance: realisticScale ? 1434.0 : 40, 
        rotationPeriod: 0.44, 
        orbitPeriod: 29.46,
        obliquity: 26.7,
        color: 0xf1c40f,
        surfaceColor: '#ddcc88',
        details: [
          { color: '#ccbb77', size: 0.18, count: 20, type: 'bands' },
          { color: '#bbaa66', size: 0.15, count: 20, type: 'bands' }
        ],
        hasRings: true,
        ringsInner: realisticScale ? 1.2 : 1.2,
        ringsOuter: realisticScale ? 2.3 : 2.3,
        ringsColor: '#ddbb77'
      },
      { 
        name: 'Uranus', 
        radius: realisticScale ? 4.01 : 1.8, 
        distance: realisticScale ? 2871.0 : 47, 
        rotationPeriod: -0.72, 
        orbitPeriod: 84.01,
        obliquity: 97.8,
        color: 0x1abc9c,
        surfaceColor: '#99dddd',
        hasAtmosphere: true,
        atmosphereColor: '#aaffff',
        details: [
          { color: '#88cccc', size: 0.1, count: 10, type: 'bands' }
        ]
      },
      { 
        name: 'Neptune', 
        radius: realisticScale ? 3.88 : 1.7, 
        distance: realisticScale ? 4495.0 : 55, 
        rotationPeriod: 0.67, 
        orbitPeriod: 164.8,
        obliquity: 28.3,
        color: 0x3498db,
        surfaceColor: '#3377aa',
        hasAtmosphere: true,
        atmosphereColor: '#44aaff',
        details: [
          { color: '#2266aa', size: 0.1, count: 5, type: 'bands' },
          { color: '#3388cc', size: 0.08, count: 2, type: 'spot' }
        ]
      }
    ];

    // Scale factor to make distances manageable
    const distanceScale = realisticScale ? 0.4 : 1;
    
    // Function to create procedural planet texture
    const createPlanetTexture = (planet) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      // Base color
      ctx.fillStyle = planet.surfaceColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add details based on planet type
      if (planet.details) {
        for (const detail of planet.details) {
          if (detail.type === 'bands') {
            // Create bands (like on gas giants)
            const bandHeight = canvas.height / detail.count;
            for (let i = 0; i < detail.count; i++) {
              if (i % 2 === 0) {
                ctx.fillStyle = detail.color;
                ctx.fillRect(0, i * bandHeight, canvas.width, bandHeight);
              }
            }
          } else if (detail.type === 'spot') {
            // Create spots (like Great Red Spot on Jupiter)
            for (let i = 0; i < detail.count; i++) {
              const x = canvas.width * 0.5;
              const y = canvas.height * (0.3 + Math.random() * 0.4);
              const radiusX = canvas.width * detail.size;
              const radiusY = canvas.height * detail.size * 0.5;
              
              ctx.beginPath();
              ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
              ctx.fillStyle = detail.color;
              ctx.fill();
            }
          } else {
            // Create random details (craters, terrain features)
            for (let i = 0; i < detail.count; i++) {
              const x = Math.random() * canvas.width;
              const y = Math.random() * canvas.height;
              const radius = canvas.width * detail.size * (0.5 + Math.random() * 0.5);
              
              ctx.beginPath();
              ctx.arc(x, y, radius, 0, Math.PI * 2);
              ctx.fillStyle = detail.color;
              ctx.fill();
            }
          }
        }
      }
      
      // Add clouds for planets with atmospheres
      if (planet.hasAtmosphere) {
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < 300; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const radius = canvas.width * 0.01 * (1 + Math.random());
          
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = planet.atmosphereColor;
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;
      }
      
      return new THREE.CanvasTexture(canvas);
    };
    
    // Create moon texture
    const createMoonTexture = (moon) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      // Base color
      ctx.fillStyle = moon.moonColor || '#aaaaaa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add craters
      if (moon.moonDetails) {
        for (const detail of moon.moonDetails) {
          for (let i = 0; i < detail.count; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = canvas.width * detail.size * (0.5 + Math.random() * 0.5);
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = detail.color;
            ctx.fill();
          }
        }
      }
      
      return new THREE.CanvasTexture(canvas);
    };
    
    // Create rings texture (for Saturn)
    const createRingsTexture = (planet) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      
      // Base transparent
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create ring bands with varying opacity
      const ringColor = planet.ringsColor || '#ddbb77';
      const bandCount = 12;
      const bandWidth = canvas.width / bandCount;
      
      for (let i = 0; i < bandCount; i++) {
        // Alternate opacity for Cassini division effect
        let opacity = 0.7 + Math.random() * 0.3;
        if (i === Math.floor(bandCount * 0.7)) opacity = 0.2; // Cassini division
        
        ctx.fillStyle = `${ringColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fillRect(i * bandWidth, 0, bandWidth, canvas.height);
        
        // Add some grain to the rings
        ctx.globalAlpha = 0.3;
        for (let j = 0; j < 50; j++) {
          const x = i * bandWidth + Math.random() * bandWidth;
          const y = Math.random() * canvas.height;
          const size = 1 + Math.random() * 2;
          
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;
      }
      
      return new THREE.CanvasTexture(canvas);
    };
    
    // Create planets with procedural textures
    const planetMeshes = planetData.map(planet => {
      // Create planet
      const planetGeometry = new THREE.SphereGeometry(planet.radius, 32, 32);
      const planetTexture = createPlanetTexture(planet);
      
      const planetMaterial = new THREE.MeshStandardMaterial({ 
        map: planetTexture,
        roughness: 0.7,
        metalness: 0.3
      });
      
      const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
      planetMesh.castShadow = true;
      planetMesh.receiveShadow = true;
      
      // Add atmosphere for planets that have one
      let atmosphere;
      if (planet.hasAtmosphere) {
        const atmosphereGeometry = new THREE.SphereGeometry(planet.radius * 1.03, 32, 32);
        const atmosphereColor = new THREE.Color(planet.atmosphereColor || '#aaddff');
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
          color: atmosphereColor,
          transparent: true,
          opacity: 0.15,
          side: THREE.BackSide
        });
        atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        planetMesh.add(atmosphere);
      }
      
      // Set initial tilt (obliquity)
      planetMesh.rotation.x = THREE.MathUtils.degToRad(planet.obliquity);
      
      // Create orbit
      const scaledDistance = planet.distance * distanceScale;
      const orbitGeometry = new THREE.RingGeometry(scaledDistance, scaledDistance + 0.05, 128);
      const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        opacity: 0.2, 
        transparent: true,
        side: THREE.DoubleSide,
        visible: showOrbits
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);
      
      // Create planet container for proper orbital mechanics
      const planetContainer = new THREE.Object3D();
      planetContainer.add(planetMesh);
      scene.add(planetContainer);
      
      // For Earth, add a moon
      let moon, moonContainer;
      if (planet.hasMoon) {
        moonContainer = new THREE.Object3D();
        const moonGeometry = new THREE.SphereGeometry(planet.moonRadius, 32, 32);
        const moonTexture = createMoonTexture(planet);
        const moonMaterial = new THREE.MeshStandardMaterial({
          map: moonTexture,
          roughness: 0.8,
          metalness: 0.1
        });
        moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.castShadow = true;
        moon.receiveShadow = true;
        moonContainer.add(moon);
        planetContainer.add(moonContainer);
        
        // Create moon orbit line
        const moonOrbitGeometry = new THREE.RingGeometry(planet.moonDistance, planet.moonDistance + 0.02, 64);
        const moonOrbitMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          opacity: 0.2,
          transparent: true,
          side: THREE.DoubleSide,
          visible: showOrbits
        });
        const moonOrbit = new THREE.Mesh(moonOrbitGeometry, moonOrbitMaterial);
        moonOrbit.rotation.x = Math.PI / 2;
        planetContainer.add(moonOrbit);
      }
      
      // For Saturn, add rings
      let rings;
      if (planet.hasRings) {
        const ringGeometry = new THREE.RingGeometry(
          planet.radius * planet.ringsInner, 
          planet.radius * planet.ringsOuter, 
          64
        );
        const ringTexture = createRingsTexture(planet);
        const ringMaterial = new THREE.MeshStandardMaterial({
          map: ringTexture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8
        });
        rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2;
        planetMesh.add(rings);
      }
      
      // Add name label
      const planetLabel = document.createElement('div');
      planetLabel.className = 'absolute px-2 py-1 bg-black bg-opacity-70 text-white text-sm rounded hidden';
      planetLabel.textContent = planet.name;
      mountRef.current.appendChild(planetLabel);
      
      // Set initial position
      planetMesh.position.x = planet.radius + 2;
      
      return { 
        mesh: planetMesh, 
        container: planetContainer,
        moon,
        moonContainer,
        rings,
        atmosphere,
        rotationPeriod: planet.rotationPeriod,
        orbitPeriod: planet.orbitPeriod,
        moonOrbitPeriod: planet.moonOrbitPeriod,
        distance: scaledDistance,
        radius: planet.radius,
        name: planet.name,
        label: planetLabel
      };
    });

    // Add animated stars with twinkling effect
    const createAnimatedStars = () => {
      // Create two star systems - one static, one animated
      // Static stars in background
      const starsGeometry1 = new THREE.BufferGeometry();
      const starsMaterial1 = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.15,
        transparent: true
      });

      const starsVertices1 = [];
      for (let i = 0; i < 8000; i++) {
        // Distribute stars in a sphere around the scene
        const phi = Math.acos(-1 + (2 * Math.random()));
        const theta = 2 * Math.PI * Math.random();
        const distance = Math.random() * 3000 + 1000;
        
        const x = distance * Math.sin(phi) * Math.cos(theta);
        const y = distance * Math.sin(phi) * Math.sin(theta);
        const z = distance * Math.cos(phi);
        
        starsVertices1.push(x, y, z);
      }

      starsGeometry1.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(starsVertices1, 3)
      );
      const stars1 = new THREE.Points(starsGeometry1, starsMaterial1);
      scene.add(stars1);
      
      // Animated twinkling stars
      const starsGeometry2 = new THREE.BufferGeometry();
      const starsCount = 2000;
      
      // Create positions and store original opacity values for animation
      const positions = new Float32Array(starsCount * 3);
      const opacities = new Float32Array(starsCount);
      const sizes = new Float32Array(starsCount);
      const twinkleSpeed = new Float32Array(starsCount);
      
      for (let i = 0; i < starsCount; i++) {
        const i3 = i * 3;
        
        // Distribute stars in a sphere
        const phi = Math.acos(-1 + (2 * Math.random()));
        const theta = 2 * Math.PI * Math.random();
        const distance = Math.random() * 2000 + 800;
        
        positions[i3] = distance * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = distance * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = distance * Math.cos(phi);
        
        // Random initial opacity and twinkle speed
        opacities[i] = 0.2 + Math.random() * 0.8;
        sizes[i] = 0.1 + Math.random() * 0.2;
        twinkleSpeed[i] = 0.3 + Math.random() * 1.5;
      }
      
      starsGeometry2.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      starsGeometry2.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
      starsGeometry2.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      starsGeometry2.setAttribute('twinkleSpeed', new THREE.BufferAttribute(twinkleSpeed, 1));
      
      // Shader material for twinkling effect
      const starsMaterial2 = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          pixelRatio: { value: window.devicePixelRatio }
        },
        vertexShader: `
          attribute float opacity;
          attribute float size;
          attribute float twinkleSpeed;
          
          uniform float time;
          uniform float pixelRatio;
          
          varying float vOpacity;
          
          void main() {
            vOpacity = opacity * (0.6 + 0.4 * sin(time * twinkleSpeed));
            
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying float vOpacity;
          
          void main() {
            // Create circular points
            float distanceToCenter = length(gl_PointCoord - vec2(0.5));
            float strength = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
            
            vec3 color = vec3(1.0);
            // Slight blue tint for some stars
            if (vOpacity > 0.8) {
              color = vec3(0.9, 0.95, 1.0);
            }
            // Slight red tint for others
            else if (vOpacity < 0.3) {
              color = vec3(1.0, 0.9, 0.9);
            }
            
            gl_FragColor = vec4(color, vOpacity * strength);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      
      const stars2 = new THREE.Points(starsGeometry2, starsMaterial2);
      scene.add(stars2);
      
      return {
        staticStars: stars1,
        twinklingStars: stars2,
        updateTwinkle: (time) => {
          starsMaterial2.uniforms.time.value = time;
        }
      };
    };
    
    const stars = createAnimatedStars();

    // Raycaster for planet selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const onMouseMove = (event) => {
      // Update mouse position for raycaster
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Check if mouse is over a planet
      raycaster.setFromCamera(mouse, camera);
      const planetObjects = planetMeshes.map(p => p.mesh);
      const intersects = raycaster.intersectObjects(planetObjects);
      
      if (intersects.length > 0) {
        const selected = planetMeshes.find(p => p.mesh === intersects[0].object);
        if (selected) {
          document.body.style.cursor = 'pointer';
          
          // Show label
          const vector = new THREE.Vector3();
          vector.setFromMatrixPosition(selected.mesh.matrixWorld);
          vector.project(camera);
          
          const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
          const y = (-(vector.y) * 0.5 + 0.5) * window.innerHeight;
          
          selected.label.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
          selected.label.classList.remove('hidden');
        }
      } else {
        document.body.style.cursor = 'auto';
        // Hide all labels
        planetMeshes.forEach(p => p.label.classList.add('hidden'));
      }
    };
    
    // Create a lookup for planet details
    // Create a lookup for planet details
  const planetInfo = {};
  planetData.forEach((planet, index) => {
    planetInfo[planet.name] = {
      ...planet,
      mesh: planetMeshes[index]
    };
  });

  // Handle planet click
  const onMouseClick = (event) => {
    raycaster.setFromCamera(mouse, camera);
    const planetObjects = planetMeshes.map(p => p.mesh);
    const intersects = raycaster.intersectObjects(planetObjects);
    
    if (intersects.length > 0) {
      const selected = planetMeshes.find(p => p.mesh === intersects[0].object);
      if (selected) {
        setSelectedPlanet(selected.name);
        
        // Focus camera on the selected planet
        const planetWorldPos = new THREE.Vector3();
        selected.mesh.getWorldPosition(planetWorldPos);
        const distance = selected.radius * 5 + 5;
        
        // Animate camera movement to the selected planet
        const startPos = camera.position.clone();
        const endPos = new THREE.Vector3(
          planetWorldPos.x + distance,
          planetWorldPos.y + distance * 0.5,
          planetWorldPos.z + distance
        );
        
        let startTime = 0;
        const animationDuration = 2; // seconds
        
        const animateCamera = (time) => {
          if (startTime === 0) startTime = time;
          const elapsed = (time - startTime) / 1000;
          
          if (elapsed < animationDuration) {
            const t = elapsed / animationDuration;
            const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // Ease in-out quad
            
            camera.position.lerpVectors(startPos, endPos, eased);
            controls.target.lerp(planetWorldPos, eased);
            controls.update();
            
            requestAnimationFrame(animateCamera);
          } else {
            camera.position.copy(endPos);
            controls.target.copy(planetWorldPos);
            controls.update();
          }
        };
        
        requestAnimationFrame(animateCamera);
      }
    }
  };
  
  // Handle window resize
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  
  // Add event listeners
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('click', onMouseClick);
  window.addEventListener('resize', handleResize);
  
  // Function to create enhanced background effects
  const createBackground = () => {
    // Add galaxies/nebulae as subtle background elements
    const galaxyTextures = [
      {
        color: new THREE.Color('#112244'),
        position: new THREE.Vector3(2000, 500, -3000),
        size: 1800,
        rotation: 0.2
      },
      {
        color: new THREE.Color('#331122'),
        position: new THREE.Vector3(-3000, -500, -2000),
        size: 2200,
        rotation: 1.1
      },
      {
        color: new THREE.Color('#223322'),
        position: new THREE.Vector3(-1500, 2000, -2500),
        size: 1600,
        rotation: 0.7
      }
    ];
    
    const galaxies = galaxyTextures.map(galaxy => {
      const galaxyGeometry = new THREE.PlaneGeometry(galaxy.size, galaxy.size);
      
      // Create procedural galaxy texture
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      // Create radial gradient
      const gradient = ctx.createRadialGradient(
        256, 256, 0,
        256, 256, 256
      );
      
      gradient.addColorStop(0, `rgba(${galaxy.color.r * 255}, ${galaxy.color.g * 255}, ${galaxy.color.b * 255}, 0.7)`);
      gradient.addColorStop(0.5, `rgba(${galaxy.color.r * 255}, ${galaxy.color.g * 255}, ${galaxy.color.b * 255}, 0.3)`);
      gradient.addColorStop(1, `rgba(${galaxy.color.r * 255}, ${galaxy.color.g * 255}, ${galaxy.color.b * 255}, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
      
      // Add some noise
      ctx.globalCompositeOperation = 'lighten';
      for (let i = 0; i < 1000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = Math.random() * 2 + 0.5;
        const opacity = Math.random() * 0.15;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      const galaxyMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      
      const galaxyMesh = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
      galaxyMesh.position.copy(galaxy.position);
      galaxyMesh.rotation.x = Math.PI / 2;
      galaxyMesh.rotation.z = galaxy.rotation;
      scene.add(galaxyMesh);
      
      return galaxyMesh;
    });
    
    return galaxies;
  };
  
  const galaxies = createBackground();

  // Animation Loop
  let lastTime = 0;
  const animate = (time) => {
    const delta = (time - lastTime) / 1000; // Time in seconds
    lastTime = time;
    
    // Update planet rotations and orbits based on simulation speed
    const timeScale = delta * simulationSpeed;
    
    // Rotate sun
    sun.rotation.y += timeScale * 0.05;
    
    // Update sun shader for glow effect
    sunGlowMaterial.uniforms.viewVector.value = new THREE.Vector3().subVectors(
      camera.position, sun.position
    );
    
    // Update planets
    planetMeshes.forEach(planet => {
      // Self rotation
      const rotationSpeed = (2 * Math.PI) / (Math.abs(planet.rotationPeriod) * 24); // Convert days to timesteps
      planet.mesh.rotation.y += rotationSpeed * timeScale * (planet.rotationPeriod > 0 ? 1 : -1);
      
      // Orbital movement
      const orbitSpeed = (2 * Math.PI) / (planet.orbitPeriod * 365); // Convert years to timesteps
      planet.container.rotation.y += orbitSpeed * timeScale;
      
      // Update planet position
      planet.mesh.position.x = planet.distance;
      
      // Update moon position if present
      if (planet.moonContainer) {
        const moonOrbitSpeed = (2 * Math.PI) / (planet.moonOrbitPeriod); // Moon period is already in days
        planet.moonContainer.rotation.y += moonOrbitSpeed * timeScale;
        planet.moon.position.x = planet.moonOrbitPeriod;
      }
    });
    
    // Update star twinkling animation
    stars.updateTwinkle(time * 0.001);
    
    // Slowly rotate galaxies
    galaxies.forEach(galaxy => {
      galaxy.rotation.z += timeScale * 0.01;
    });
    
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  
  // Start animation loop
  animate(0);
  
  // Cleanup function
  return () => {
    // Remove event listeners
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('click', onMouseClick);
    window.removeEventListener('resize', handleResize);
    
    // Remove render target
    if (mountRef.current) {
      mountRef.current.removeChild(renderer.domElement);
    }
    
    // Dispose of geometries and materials
    scene.traverse(object => {
      if (object.geometry) object.geometry.dispose();
      
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    
    // Remove planet labels
    planetMeshes.forEach(planet => {
      if (planet.label && planet.label.parentNode) {
        planet.label.parentNode.removeChild(planet.label);
      }
    });
    
    // Dispose of renderer
    renderer.dispose();
  };
}, [realisticScale, showOrbits, simulationSpeed, selectedPlanet]);

// Control panel UI
return (
  <div className="relative w-full h-screen bg-black overflow-hidden" ref={mountRef}>
<div className="absolute bottom-4 left-4 p-4 bg-black bg-opacity-60 text-white rounded shadow-lg max-w-xs">
<h2 className="text-xl font-bold mb-3">Solar System Controls</h2>
      
      <div className="mb-3">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="mr-2"
            checked={showOrbits}
            onChange={() => setShowOrbits(!showOrbits)}
          />
          Show Orbits
        </label>
      </div>
      
      <div className="mb-3">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="mr-2"
            checked={realisticScale}
            onChange={() => setRealisticScale(!realisticScale)}
          />
          Realistic Scale
        </label>
      </div>
      
      <div className="mb-3">
        <label className="block mb-1">Simulation Speed</label>
        <input
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={simulationSpeed}
          onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="text-sm">{simulationSpeed.toFixed(1)}x</div>
      </div>
      
      {selectedPlanet && (
        <div className="mt-4 pt-4 border-t border-gray-600">
          <h3 className="text-lg font-bold">{selectedPlanet}</h3>
          <button
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
            onClick={() => setSelectedPlanet(null)}
          >
            Return to Overview
          </button>
        </div>
      )}
    </div>
    
    {/* Instructions overlay */}
    <div className="absolute bottom-4 right-4 p-3 bg-black bg-opacity-60 text-white rounded shadow-lg max-w-xs text-sm">
      <p>Click on planets to focus. Drag to rotate. Scroll to zoom.</p>
    </div>
  </div>
);
};

export default SolarSystem;