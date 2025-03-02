// 3D Animation using Three.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a page with the animation container
    const container = document.getElementById('animation-container');
    if (!container) return;

    // Create a scene
    const scene = new THREE.Scene();
    
    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Create a group for our objects
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);
    
    // Create particles
    const particleCount = 200;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        // Create geometry for the particle
        const geometry = new THREE.SphereGeometry(0.05, 12, 12);
        
        // Create a material with a random color from our brand palette
        const colors = [0x3498db, 0x2ecc71, 0xe74c3c];
        const material = new THREE.MeshBasicMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            transparent: true,
            opacity: Math.random() * 0.5 + 0.25
        });
        
        // Create the mesh
        const particle = new THREE.Mesh(geometry, material);
        
        // Set random position
        particle.position.x = (Math.random() - 0.5) * 10;
        particle.position.y = (Math.random() - 0.5) * 10;
        particle.position.z = (Math.random() - 0.5) * 10;
        
        // Add to group
        particleGroup.add(particle);
        
        // Store velocity and the particle
        particles.push({
            mesh: particle,
            velocity: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            }
        });
    }
    
    // Create connecting lines based on distance
    function createConnections() {
        // Remove old lines
        particleGroup.children.forEach(child => {
            if (child.isLine) {
                particleGroup.remove(child);
            }
        });
        
        // Find connections
        for (let i = 0; i < particles.length; i++) {
            const particle1 = particles[i].mesh;
            
            for (let j = i + 1; j < particles.length; j++) {
                const particle2 = particles[j].mesh;
                
                // Calculate distance
                const distance = particle1.position.distanceTo(particle2.position);
                
                // If particles are close enough, draw a line
                if (distance < 1.5) {
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                        particle1.position,
                        particle2.position
                    ]);
                    
                    const lineMaterial = new THREE.LineBasicMaterial({
                        color: 0x3498db,
                        transparent: true,
                        opacity: (1.5 - distance) / 3 // Fade based on distance
                    });
                    
                    const line = new THREE.Line(lineGeometry, lineMaterial);
                    line.isLine = true;
                    particleGroup.add(line);
                }
            }
        }
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Add mouse interaction
    const mousePosition = new THREE.Vector2();
    
    window.addEventListener('mousemove', function(event) {
        // Calculate normalized mouse position
        mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
        mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate the particle group slightly for ambient motion
        particleGroup.rotation.x += 0.001;
        particleGroup.rotation.y += 0.001;
        
        // Update particle positions based on velocities and mouse influence
        particles.forEach(particle => {
            // Normal movement
            particle.mesh.position.x += particle.velocity.x;
            particle.mesh.position.y += particle.velocity.y;
            particle.mesh.position.z += particle.velocity.z;
            
            // Boundary checking - if particles go too far, bring them back
            if (Math.abs(particle.mesh.position.x) > 5) {
                particle.velocity.x *= -1;
            }
            if (Math.abs(particle.mesh.position.y) > 5) {
                particle.velocity.y *= -1;
            }
            if (Math.abs(particle.mesh.position.z) > 5) {
                particle.velocity.z *= -1;
            }
            
            // Mouse influence - particles should be attracted to mouse position
            const mouseInfluence = 0.0005;
            particle.velocity.x += mousePosition.x * mouseInfluence;
            particle.velocity.y += mousePosition.y * mouseInfluence;
            
            // Add a small random movement for more natural motion
            particle.velocity.x += (Math.random() - 0.5) * 0.001;
            particle.velocity.y += (Math.random() - 0.5) * 0.001;
            particle.velocity.z += (Math.random() - 0.5) * 0.001;
            
            // Dampen velocity to prevent particles from moving too fast
            particle.velocity.x *= 0.99;
            particle.velocity.y *= 0.99;
            particle.velocity.z *= 0.99;
        });
        
        // Update connections
        createConnections();
        
        // Render the scene
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
});