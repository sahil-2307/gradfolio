// Particle Background System
class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.config = {
            particleCount: 80,
            maxDistance: 150,
            speed: 0.5,
            colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
            particleSize: 2
        };
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particle-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        
        const container = document.getElementById('particles-canvas');
        if (container) {
            container.appendChild(this.canvas);
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }
    
    createParticles() {
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.speed,
                vy: (Math.random() - 0.5) * this.config.speed,
                color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                size: Math.random() * this.config.particleSize + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Reduce particles on mobile for better performance
        if (window.innerWidth < 768) {
            this.config.particleCount = 40;
            this.config.maxDistance = 100;
        }
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    drawParticle(particle) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add glow effect
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = particle.color;
        this.ctx.fill();
        this.ctx.restore();
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.maxDistance) {
                    const opacity = 1 - distance / this.config.maxDistance;
                    this.ctx.save();
                    this.ctx.globalAlpha = opacity * 0.1;
                    this.ctx.strokeStyle = '#667eea';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
        }
    }
    
    drawMouseConnections() {
        for (let particle of this.particles) {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.config.maxDistance * 1.5) {
                const opacity = 1 - distance / (this.config.maxDistance * 1.5);
                this.ctx.save();
                this.ctx.globalAlpha = opacity * 0.3;
                this.ctx.strokeStyle = '#f093fb';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(this.mouse.x, this.mouse.y);
                this.ctx.lineTo(particle.x, particle.y);
                this.ctx.stroke();
                this.ctx.restore();
                
                // Attract particles slightly to mouse
                particle.x += dx * 0.001;
                particle.y += dy * 0.001;
            }
        }
    }
    
    updateParticles() {
        for (let particle of this.particles) {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off walls
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }
            
            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            // Subtle opacity animation
            particle.opacity += (Math.random() - 0.5) * 0.01;
            particle.opacity = Math.max(0.1, Math.min(0.7, particle.opacity));
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.drawConnections();
        this.drawMouseConnections();
        
        for (let particle of this.particles) {
            this.drawParticle(particle);
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Enhanced 3D Effect with Three.js (optional enhancement)
class ThreeJSBackground {
    constructor() {
        if (typeof THREE === 'undefined') {
            console.log('Three.js not loaded, falling back to canvas particles');
            return;
        }
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.geometry = null;
        this.material = null;
        this.mesh = null;
        
        this.init();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.style.position = 'fixed';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '-2';
        this.renderer.domElement.style.pointerEvents = 'none';
        
        const container = document.getElementById('particles-canvas');
        if (container) {
            container.appendChild(this.renderer.domElement);
        }
        
        this.createGeometry();
        this.addEventListeners();
        this.animate();
    }
    
    createGeometry() {
        // Create floating geometric shapes
        const shapes = [];
        
        for (let i = 0; i < 15; i++) {
            const geometries = [
                new THREE.BoxGeometry(0.2, 0.2, 0.2),
                new THREE.SphereGeometry(0.1, 16, 16),
                new THREE.OctahedronGeometry(0.15),
                new THREE.TetrahedronGeometry(0.15)
            ];
            
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(
                    Math.random() * 0.3 + 0.6,
                    0.7,
                    0.6
                ),
                transparent: true,
                opacity: 0.3,
                wireframe: Math.random() > 0.5
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            shapes.push(mesh);
            this.scene.add(mesh);
        }
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0x667eea, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        this.shapes = shapes;
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        window.addEventListener('mousemove', (event) => {
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            
            this.camera.position.x = mouseX * 0.5;
            this.camera.position.y = mouseY * 0.5;
            this.camera.lookAt(this.scene.position);
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate shapes
        this.shapes.forEach((shape, index) => {
            shape.rotation.x += 0.01 * (index % 3 + 1);
            shape.rotation.y += 0.01 * (index % 2 + 1);
            
            // Float up and down
            shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.001;
        });
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize particle system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Use 3D background if Three.js is available, otherwise fallback to 2D particles
    if (typeof THREE !== 'undefined' && !window.matchMedia('(max-width: 768px)').matches) {
        new ThreeJSBackground();
    } else {
        new ParticleSystem();
    }
});

// Export for potential external usage
window.ParticleSystem = ParticleSystem;
if (typeof THREE !== 'undefined') {
    window.ThreeJSBackground = ThreeJSBackground;
}