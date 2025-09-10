// Modern Professional Portfolio - Premium Edition JavaScript
class ModernProfessionalPortfolio {
    constructor() {
        this.isEditing = false;
        this.currentData = null;
        this.threeJsScene = null;
        this.particles = null;
        this.isDarkMode = false;
        this.scrollProgress = 0;
        this.isLoaded = false;
        
        this.init();
    }

    async init() {
        // Show loading screen
        this.showLoadingScreen();
        
        // Initialize core features
        await this.initializeThreeJS();
        this.setupThemeSystem();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupMicroInteractions();
        this.setupParallaxScrolling();
        this.setupAccessibility();
        this.loadPortfolioData();
        
        // Initialize AOS animations
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100
            });
        }
        
        // Check if we're in preview/edit mode
        const urlParams = new URLSearchParams(window.location.search);
        const isPreview = urlParams.get('preview') === 'true';
        const editMode = urlParams.get('edit') === 'true';
        
        if (isPreview || editMode) {
            this.showControls();
        }
        
        // Hide loading screen
        this.hideLoadingScreen();
        this.isLoaded = true;
    }

    showLoadingScreen() {
        const loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <p>Loading Portfolio...</p>
            </div>
        `;
        document.body.appendChild(loader);
        
        // Add loader styles
        const loaderStyles = `
            #page-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--color-background);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                transition: opacity 0.5s ease;
            }
            
            .loader-content {
                text-align: center;
            }
            
            .loader-spinner {
                width: 50px;
                height: 50px;
                border: 3px solid var(--color-border);
                border-top: 3px solid var(--color-primary);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = loaderStyles;
        document.head.appendChild(style);
    }

    hideLoadingScreen() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }
    }

    async initializeThreeJS() {
        try {
            // Check if Three.js is available
            if (typeof THREE === 'undefined') {
                console.warn('Three.js not available, skipping 3D effects');
                return;
            }

            const heroBackground = document.querySelector('.hero-background');
            if (!heroBackground) return;

            // Scene setup
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor(0x000000, 0);
            heroBackground.appendChild(this.renderer.domElement);

            // Create particle system
            await this.createParticleSystem();
            
            // Create floating geometric shapes
            this.createFloatingShapes();
            
            // Setup camera position
            this.camera.position.z = 5;
            
            // Start animation loop
            this.animateThreeJS();
            
            // Handle window resize
            window.addEventListener('resize', () => this.onWindowResize());
            
        } catch (error) {
            console.warn('Three.js initialization failed:', error);
        }
    }

    async createParticleSystem() {
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        // Create random particles
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

            // Color based on theme
            const color = new THREE.Color();
            color.setHSL(0.6 + Math.random() * 0.2, 0.7, 0.5 + Math.random() * 0.3);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random() * 3 + 1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Particle material
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: window.devicePixelRatio }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                uniform float pixelRatio;
                
                void main() {
                    vColor = color;
                    vec3 pos = position;
                    pos.y += sin(time + position.x * 0.1) * 0.5;
                    pos.x += cos(time + position.y * 0.1) * 0.3;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float distance = length(gl_PointCoord - 0.5);
                    if (distance > 0.5) discard;
                    
                    float alpha = 1.0 - (distance * 2.0);
                    gl_FragColor = vec4(vColor, alpha * 0.8);
                }
            `,
            transparent: true,
            vertexColors: true
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createFloatingShapes() {
        // Create floating geometric shapes
        const shapes = [];
        const shapeTypes = ['box', 'sphere', 'octahedron'];
        
        for (let i = 0; i < 8; i++) {
            const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
            let geometry;
            
            switch (shapeType) {
                case 'box':
                    geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
                    break;
                case 'sphere':
                    geometry = new THREE.SphereGeometry(0.3, 16, 16);
                    break;
                case 'octahedron':
                    geometry = new THREE.OctahedronGeometry(0.4);
                    break;
            }
            
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
                transparent: true,
                opacity: 0.3,
                wireframe: Math.random() > 0.5
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 15,
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
        
        this.floatingShapes = shapes;
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }

    animateThreeJS() {
        if (!this.renderer || !this.scene || !this.camera) return;
        
        requestAnimationFrame(() => this.animateThreeJS());
        
        const time = Date.now() * 0.001;
        
        // Update particle system
        if (this.particles && this.particles.material.uniforms) {
            this.particles.material.uniforms.time.value = time;
            this.particles.rotation.y = time * 0.1;
        }
        
        // Animate floating shapes
        if (this.floatingShapes) {
            this.floatingShapes.forEach((shape, index) => {
                shape.rotation.x += 0.005 + index * 0.001;
                shape.rotation.y += 0.007 + index * 0.001;
                shape.position.y += Math.sin(time + index) * 0.002;
            });
        }
        
        // Camera movement based on scroll
        if (this.camera) {
            this.camera.position.y = this.scrollProgress * -2;
            this.camera.rotation.x = this.scrollProgress * 0.1;
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setupThemeSystem() {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.isDarkMode = savedTheme === 'dark';
        this.applyTheme(this.isDarkMode);

        // Theme toggle button
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
            this.updateThemeToggleIcon();
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.isDarkMode = e.matches;
                    this.applyTheme(this.isDarkMode);
                    this.updateThemeToggleIcon();
                }
            });
        }
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme(this.isDarkMode);
        this.updateThemeToggleIcon();
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
        
        // Add smooth theme transition
        document.documentElement.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 300);
    }

    applyTheme(isDark) {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        
        // Update Three.js scene colors if available
        if (this.particles && this.particles.material.uniforms) {
            const colors = this.particles.geometry.attributes.color.array;
            for (let i = 0; i < colors.length; i += 3) {
                const color = new THREE.Color();
                if (isDark) {
                    color.setHSL(0.6 + Math.random() * 0.2, 0.7, 0.7 + Math.random() * 0.3);
                } else {
                    color.setHSL(0.6 + Math.random() * 0.2, 0.7, 0.4 + Math.random() * 0.3);
                }
                colors[i] = color.r;
                colors[i + 1] = color.g;
                colors[i + 2] = color.b;
            }
            this.particles.geometry.attributes.color.needsUpdate = true;
        }
    }

    updateThemeToggleIcon() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = this.isDarkMode ? 
                '<i class="fas fa-sun"></i>' : 
                '<i class="fas fa-moon"></i>';
        }
    }

    setupNavigation() {
        const hamburger = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const navbar = document.querySelector('.navbar');

        // Mobile hamburger menu
        hamburger?.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        // Smooth scrolling for nav links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Calculate offset for fixed navbar
                    const navbarHeight = navbar?.offsetHeight || 80;
                    const targetPosition = targetSection.offsetTop - navbarHeight;
                    
                    // Smooth scroll with custom easing
                    this.smoothScrollTo(targetPosition, 800);
                    
                    // Close mobile menu
                    hamburger?.classList.remove('active');
                    navMenu?.classList.remove('active');
                    document.body.classList.remove('nav-open');
                    
                    // Update active nav link
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });

        // Update active nav link on scroll
        window.addEventListener('scroll', this.throttle(() => {
            this.updateActiveNavLink();
            this.updateScrollProgress();
        }, 16));

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar') && navMenu?.classList.contains('active')) {
                hamburger?.classList.remove('active');
                navMenu?.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
    }

    smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.easeInOutCubic(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
    }

    easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                correspondingLink?.classList.add('active');
            }
        });
    }

    updateScrollProgress() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        this.scrollProgress = Math.min(window.scrollY / scrollHeight, 1);
        
        // Update navbar appearance
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    setupScrollEffects() {
        // Parallax elements
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
        
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Add staggered animation for children
                    const children = entry.target.querySelectorAll('[data-stagger]');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // Observe all sections and animated elements
        document.querySelectorAll('section, [data-animate]').forEach(element => {
            this.intersectionObserver.observe(element);
        });

        // Scroll-based animations
        window.addEventListener('scroll', this.throttle(() => {
            this.handleParallaxScroll();
            this.updateScrollIndicators();
        }, 16));
    }

    setupMicroInteractions() {
        // Button hover effects
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e.target, e);
            });
        });

        // Card hover effects
        document.querySelectorAll('.project-card, .service-card, .skill-item').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });

        // Form input animations
        document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });

        // Magnetic cursor effect for interactive elements
        this.setupMagneticCursor();
    }

    createRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    setupMagneticCursor() {
        const magneticElements = document.querySelectorAll('.btn, .nav-link, .social-link');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
            });
        });
    }

    setupParallaxScrolling() {
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', this.throttle(() => {
            this.handleParallaxScroll();
        }, 16));
    }

    handleParallaxScroll() {
        const scrollTop = window.pageYOffset;
        
        this.parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }

    updateScrollIndicators() {
        // Update any scroll progress indicators
        const scrollIndicators = document.querySelectorAll('.scroll-indicator');
        scrollIndicators.forEach(indicator => {
            const progress = this.scrollProgress * 100;
            indicator.style.width = `${progress}%`;
        });
    }

    setupAccessibility() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
            
            if (e.key === 'Escape') {
                // Close any open modals or menus
                const navMenu = document.querySelector('.nav-menu');
                const hamburger = document.querySelector('.nav-toggle');
                
                if (navMenu?.classList.contains('active')) {
                    hamburger?.classList.remove('active');
                    navMenu?.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = skipLink.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.focus();
                    targetElement.scrollIntoView();
                }
            });
        }

        // Reduced motion support
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-fast', 'none');
            document.documentElement.style.setProperty('--transition-normal', 'none');
            document.documentElement.style.setProperty('--transition-slow', 'none');
        }

        // Add ARIA labels and roles where needed
        this.enhanceAccessibility();
    }

    enhanceAccessibility() {
        // Add ARIA labels to interactive elements without text
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle && !themeToggle.getAttribute('aria-label')) {
            themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        }

        const hamburger = document.querySelector('.nav-toggle');
        if (hamburger && !hamburger.getAttribute('aria-label')) {
            hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        }

        // Add role and state to navigation menu
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.setAttribute('role', 'navigation');
            navMenu.setAttribute('aria-label', 'Main navigation');
        }

        // Enhance form accessibility
        document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
            const label = input.parentElement.querySelector('.form-label');
            if (label && !input.getAttribute('aria-labelledby')) {
                const labelId = `label-${Math.random().toString(36).substr(2, 9)}`;
                label.id = labelId;
                input.setAttribute('aria-labelledby', labelId);
            }
        });
    }

    loadPortfolioData() {
        // Try to load data from window.PortfolioData if available
        if (window.PortfolioData) {
            window.PortfolioData.loadData().then(data => {
                if (data) {
                    this.currentData = data;
                    this.populatePortfolio(data);
                } else {
                    this.loadSampleData();
                }
            }).catch(error => {
                console.error('Error loading portfolio data:', error);
                this.loadSampleData();
            });
        } else {
            this.loadSampleData();
        }
    }

    populatePortfolio(data) {
        console.log('Populating portfolio with data:', data);

        // Update document title and meta tags
        document.title = `${data.name || 'Portfolio'} - ${data.title || 'Professional'}`;
        this.updateMetaTags(data);

        // Basic information
        this.updateField('name', data.name);
        this.updateField('title', data.title);
        this.updateField('shortBio', data.shortBio);
        this.updateField('email', data.email);
        this.updateField('phone', data.phone);
        this.updateField('location', data.location);

        // About section
        this.updateField('aboutParagraph1', data.aboutParagraph1);
        this.updateField('aboutParagraph2', data.aboutParagraph2);

        // Social links
        this.updateSocialLinks(data);

        // Skills
        this.populateSkills(data.skills || {});

        // Experience
        this.populateExperience(data.experience || []);

        // Projects
        this.populateProjects(data.projects || []);

        // Update stats
        this.updateStats(data);
    }

    updateMetaTags(data) {
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && data.shortBio) {
            metaDescription.setAttribute('content', `${data.name} - ${data.shortBio}`);
        }

        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && data.name) {
            ogTitle.setAttribute('content', `${data.name} - ${data.title || 'Professional'}`);
        }

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription && data.shortBio) {
            ogDescription.setAttribute('content', data.shortBio);
        }
    }

    updateField(fieldName, value) {
        if (!value) return;
        
        const elements = document.querySelectorAll(`[data-field="${fieldName}"]`);
        elements.forEach(element => {
            element.textContent = value;
        });

        // Also update placeholder replacements in template
        this.replacePlaceholders(fieldName, value);
    }

    replacePlaceholders(fieldName, value) {
        const placeholder = `{{${fieldName.toUpperCase()}}}`;
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.includes(placeholder)) {
                textNodes.push(node);
            }
        }

        textNodes.forEach(textNode => {
            textNode.textContent = textNode.textContent.replace(
                new RegExp(placeholder, 'g'),
                value
            );
        });
    }

    updateSocialLinks(data) {
        const socialMapping = {
            linkedin: data.linkedin,
            github: data.github,
            website: data.website,
            twitter: data.twitter,
            instagram: data.instagram
        };

        Object.entries(socialMapping).forEach(([platform, url]) => {
            const link = document.querySelector(`.social-link[href*="${platform}"], .social-link.${platform}`);
            if (link && url) {
                link.href = url;
                link.style.display = 'flex';
                link.setAttribute('aria-label', `Visit ${platform} profile`);
            } else if (link) {
                link.style.display = 'none';
            }
        });
    }

    populateSkills(skills) {
        const technicalSkills = skills.technical || [];
        const softSkills = skills.soft || [];

        this.renderSkills('technical-skills', technicalSkills);
        this.renderSkills('soft-skills', softSkills);
    }

    renderSkills(containerId, skillsList) {
        const container = document.getElementById(containerId);
        if (!container || !Array.isArray(skillsList)) return;

        container.innerHTML = '';
        
        skillsList.forEach((skill, index) => {
            const skillElement = document.createElement('div');
            skillElement.className = 'skill-item';
            skillElement.setAttribute('data-stagger', '');
            skillElement.innerHTML = `
                <div class="skill-name">${skill}</div>
            `;
            container.appendChild(skillElement);
        });
    }

    populateExperience(experience) {
        const container = document.getElementById('experience-timeline');
        if (!container || !Array.isArray(experience)) return;

        container.innerHTML = '';

        experience.forEach((exp, index) => {
            const expElement = document.createElement('div');
            expElement.className = 'experience-item';
            expElement.setAttribute('data-stagger', '');
            expElement.innerHTML = `
                <div class="experience-content">
                    <h3 class="experience-title">${exp.position || exp.title}</h3>
                    <div class="experience-company">${exp.company}</div>
                    <p class="experience-description">${exp.description}</p>
                </div>
                <div class="experience-date">${exp.duration || exp.year}</div>
            `;
            container.appendChild(expElement);
        });
    }

    populateProjects(projects) {
        const container = document.getElementById('projects-grid') || document.querySelector('.work-grid');
        if (!container || !Array.isArray(projects)) return;

        container.innerHTML = '';

        projects.slice(0, 6).forEach((project, index) => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project-card';
            projectElement.setAttribute('data-stagger', '');
            
            const techTags = (project.technologies || []).map(tech => 
                `<span class="tech-tag">${tech}</span>`
            ).join('');
            
            const links = [];
            if (project.link) {
                links.push(`<a href="${project.link}" class="project-link" target="_blank" rel="noopener noreferrer" aria-label="View ${project.title} project"><i class="fas fa-external-link-alt"></i>View Project</a>`);
            }
            if (project.github) {
                links.push(`<a href="${project.github}" class="project-link" target="_blank" rel="noopener noreferrer" aria-label="View ${project.title} source code"><i class="fab fa-github"></i>Code</a>`);
            }
            
            projectElement.innerHTML = `
                <div class="project-image">
                    <i class="fas fa-code"></i>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">${techTags}</div>
                    <div class="project-links">${links.join('')}</div>
                </div>
            `;
            container.appendChild(projectElement);
        });
    }

    updateStats(data) {
        const stats = {
            'projects-count': (data.projects || []).length,
            'experience-years': this.calculateExperienceYears(data.experience || []),
            'skills-count': this.getTotalSkillsCount(data.skills || {}),
            'clients-count': data.clientsCount || 10
        };

        Object.entries(stats).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                this.animateCounter(element, 0, value, 2000);
            }
        });
    }

    animateCounter(element, start, end, duration) {
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * this.easeOutCubic(progress));
            
            element.textContent = current + (end > 10 ? '+' : '');
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    calculateExperienceYears(experience) {
        if (!experience.length) return 2;
        
        const currentYear = new Date().getFullYear();
        const startYear = Math.min(...experience.map(exp => {
            const yearMatch = (exp.duration || exp.year || '').match(/(\d{4})/);
            return yearMatch ? parseInt(yearMatch[1]) : currentYear;
        }));
        
        return Math.max(1, currentYear - startYear);
    }

    getTotalSkillsCount(skills) {
        const technical = Array.isArray(skills.technical) ? skills.technical.length : 0;
        const soft = Array.isArray(skills.soft) ? skills.soft.length : 0;
        return technical + soft || 12;
    }

    loadSampleData() {
        const sampleData = {
            name: 'Alexandra Chen',
            title: 'Creative Developer & Designer',
            shortBio: 'Passionate creative developer crafting beautiful, functional digital experiences with modern technologies and innovative design.',
            email: 'alex.chen@email.com',
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA',
            linkedin: 'https://linkedin.com/in/alexandra-chen',
            github: 'https://github.com/alexandra-chen',
            website: 'https://alexandra-chen.dev',
            aboutParagraph1: 'I am a creative developer with over 6 years of experience designing and building innovative digital experiences. I specialize in React, Three.js, and modern web technologies, with a passion for creating immersive, user-centered designs.',
            aboutParagraph2: 'When I\'m not crafting digital experiences, you can find me exploring new creative technologies, contributing to open source projects, or sharing knowledge through workshops and mentoring aspiring developers.',
            skills: {
                technical: ['JavaScript', 'React', 'Three.js', 'Node.js', 'TypeScript', 'WebGL', 'GSAP', 'PostgreSQL', 'AWS', 'Docker'],
                soft: ['Creative Direction', 'User Experience', 'Problem Solving', 'Team Leadership', 'Client Communication']
            },
            experience: [
                {
                    position: 'Senior Creative Developer',
                    company: 'Digital Innovation Studio',
                    duration: '2022 - Present',
                    description: 'Leading creative development projects for major brands, specializing in interactive web experiences and immersive 3D applications. Managing a team of 5 developers and collaborating with design teams to bring cutting-edge digital concepts to life.'
                },
                {
                    position: 'Full Stack Developer',
                    company: 'TechStart Solutions',
                    duration: '2020 - 2022',
                    description: 'Developed responsive web applications and APIs using React, Node.js, and modern JavaScript frameworks. Collaborated with UX/UI designers to create pixel-perfect, accessible user interfaces.'
                },
                {
                    position: 'Frontend Developer',
                    company: 'Creative Agency Co.',
                    duration: '2018 - 2020',
                    description: 'Built interactive websites and web applications for creative campaigns. Implemented complex animations and responsive designs using CSS3, JavaScript, and various animation libraries.'
                }
            ],
            projects: [
                {
                    title: 'Interactive 3D Portfolio',
                    description: 'A fully interactive 3D portfolio website built with Three.js, featuring particle systems, animated models, and smooth WebGL transitions. Showcases modern web development capabilities.',
                    technologies: ['Three.js', 'WebGL', 'React', 'GSAP', 'Blender'],
                    link: 'https://interactive-portfolio.dev',
                    github: 'https://github.com/alexandra-chen/3d-portfolio'
                },
                {
                    title: 'E-commerce AR Experience',
                    description: 'Revolutionary e-commerce platform with augmented reality features, allowing customers to visualize products in their space before purchase. Built with cutting-edge AR technologies.',
                    technologies: ['React', 'WebXR', 'Three.js', 'Node.js', 'MongoDB'],
                    link: 'https://ar-ecommerce.dev'
                },
                {
                    title: 'Real-time Collaboration Tool',
                    description: 'A comprehensive collaboration platform with real-time editing, video conferencing, and project management features. Designed for remote creative teams.',
                    technologies: ['React', 'Socket.io', 'WebRTC', 'Express.js', 'PostgreSQL'],
                    link: 'https://collab-tool.dev',
                    github: 'https://github.com/alexandra-chen/collab-tool'
                },
                {
                    title: 'AI-Powered Design Assistant',
                    description: 'An intelligent design assistant that helps creatives generate ideas, color palettes, and layout suggestions using machine learning algorithms.',
                    technologies: ['Python', 'TensorFlow', 'React', 'FastAPI', 'OpenAI'],
                    link: 'https://design-ai.dev'
                }
            ]
        };

        this.currentData = sampleData;
        this.populatePortfolio(sampleData);
    }

    showControls() {
        const controls = document.querySelector('.portfolio-controls');
        if (controls) {
            controls.style.display = 'block';
            setTimeout(() => controls.classList.add('visible'), 100);
        }
    }

    // Utility functions
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
}

// Initialize the portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.modernPortfolio = new ModernProfessionalPortfolio();
});

// Add enhanced CSS for premium features
const premiumStyles = document.createElement('style');
premiumStyles.textContent = `
    /* Enhanced animations and micro-interactions */
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .keyboard-navigation *:focus {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
    }
    
    .nav-open {
        overflow: hidden;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    section:not(.animate-in) {
        opacity: 0;
        transform: translateY(30px);
    }
    
    [data-stagger]:not(.animate-in) {
        opacity: 0;
        transform: translateY(20px);
    }
    
    .form-group.focused .form-label {
        color: var(--color-primary);
        transform: translateY(-4px) scale(0.9);
    }
    
    .skill-item {
        cursor: pointer;
    }
    
    .project-card,
    .service-card {
        cursor: pointer;
    }
    
    /* Scroll indicator */
    .scroll-indicator {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
        z-index: var(--z-fixed);
        transition: width 0.1s ease;
    }
    
    /* Enhanced theme transitions */
    * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }
    
    /* Magnetic cursor effects */
    .btn,
    .nav-link,
    .social-link {
        transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    /* Loading states */
    .loading {
        position: relative;
        overflow: hidden;
    }
    
    .loading::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        animation: shimmer 1.5s infinite;
    }
    
    @keyframes shimmer {
        100% {
            left: 100%;
        }
    }
    
    /* Accessibility improvements */
    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
    
    /* High contrast mode support */
    @media (prefers-contrast: high) {
        :root {
            --color-border: #000000;
            --color-text-secondary: #000000;
        }
        
        [data-theme="dark"] {
            --color-border: #ffffff;
            --color-text-secondary: #ffffff;
        }
    }
    
    /* Print optimizations */
    @media print {
        .hero-background,
        .navbar,
        .portfolio-controls,
        .theme-toggle {
            display: none !important;
        }
        
        body {
            font-size: 12pt;
            line-height: 1.4;
            color: #000;
            background: #fff;
        }
        
        section {
            page-break-inside: avoid;
            margin-bottom: 20pt;
        }
    }
`;

document.head.appendChild(premiumStyles);