// Advanced Portfolio JavaScript
class AdvancedPortfolio {
    constructor() {
        this.isLoaded = false;
        this.currentSection = 'home';
        this.scrollY = 0;
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        this.setupGSAP();
        this.setupEventListeners();
        this.initializeComponents();
        this.handleLoading();
    }
    
    setupGSAP() {
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            
            // Set default GSAP settings
            gsap.defaults({
                duration: 0.8,
                ease: "power2.out"
            });
        }
    }
    
    setupEventListeners() {
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('load', () => this.completeLoading());
        
        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link')) {
                e.preventDefault();
                this.handleNavigation(e.target);
            }
        });
        
        // Mobile menu toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    }
    
    initializeComponents() {
        this.initTypingAnimation();
        this.initSkillBars();
        this.initCounters();
        this.initProjectFilters();
        this.initContactForm();
        this.initScrollAnimations();
        this.initParallaxEffects();
    }
    
    handleLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        const loadingProgress = document.querySelector('.loading-progress');
        
        // Simulate loading progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => this.completeLoading(), 500);
            }
            
            if (loadingProgress) {
                loadingProgress.style.width = progress + '%';
            }
        }, 150);
    }
    
    completeLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.remove();
                this.isLoaded = true;
                this.startAnimations();
            }, 500);
        }
    }
    
    startAnimations() {
        this.animateHero();
        this.setupScrollTriggers();
    }
    
    animateHero() {
        if (typeof gsap === 'undefined') return;
        
        const tl = gsap.timeline();
        
        tl.from('.hero-greeting', {
            y: 30,
            opacity: 0,
            duration: 0.8
        })
        .from('.hero-name', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "back.out(1.7)"
        }, "-=0.6")
        .from('.hero-roles', {
            y: 30,
            opacity: 0,
            duration: 0.8
        }, "-=0.4")
        .from('.hero-description', {
            y: 30,
            opacity: 0,
            duration: 0.8
        }, "-=0.6")
        .from('.hero-buttons .btn', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.2
        }, "-=0.4")
        .from('.hero-social .social-link', {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }, "-=0.4")
        .from('.hero-avatar', {
            scale: 0.8,
            opacity: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)"
        }, "-=1");
    }
    
    setupScrollTriggers() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        
        // Navbar scroll effect
        ScrollTrigger.create({
            start: "top -80",
            end: 99999,
            toggleClass: {className: "scrolled", targets: ".navbar"}
        });
        
        // Section animations
        gsap.utils.toArray('section').forEach(section => {
            if (section.id === 'home') return;
            
            gsap.from(section.querySelector('.section-header'), {
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "bottom 20%"
                },
                y: 60,
                opacity: 0,
                duration: 1
            });
        });
        
        // About section animations
        ScrollTrigger.create({
            trigger: ".about",
            start: "top 80%",
            onEnter: () => {
                gsap.from(".about-intro", { y: 50, opacity: 0, duration: 0.8 });
                gsap.from(".detail-item", { 
                    y: 30, 
                    opacity: 0, 
                    duration: 0.6, 
                    stagger: 0.2, 
                    delay: 0.3 
                });
            }
        });
        
        // Skills animation
        ScrollTrigger.create({
            trigger: ".skills",
            start: "top 80%",
            onEnter: () => this.animateSkills()
        });
        
        // Timeline animation
        ScrollTrigger.create({
            trigger: ".timeline",
            start: "top 80%",
            onEnter: () => this.animateTimeline()
        });
        
        // Projects animation
        ScrollTrigger.create({
            trigger: ".projects",
            start: "top 80%",
            onEnter: () => this.animateProjects()
        });
    }
    
    animateSkills() {
        if (typeof gsap === 'undefined') return;
        
        gsap.from('.skill-category', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2
        });
        
        // Animate skill bars
        setTimeout(() => {
            document.querySelectorAll('.skill-progress').forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            });
        }, 600);
    }
    
    animateTimeline() {
        if (typeof gsap === 'undefined') return;
        
        gsap.from('.timeline-item', {
            x: (index) => index % 2 === 0 ? -50 : 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.3
        });
    }
    
    animateProjects() {
        if (typeof gsap === 'undefined') return;
        
        gsap.from('.project-card', {
            y: 50,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15
        });
    }
    
    initTypingAnimation() {
        // Clear existing animation if any
        if (this.typingInterval) {
            clearTimeout(this.typingInterval);
        }
        
        // Use dynamic roles from portfolio data or fallback to defaults
        const roles = window.portfolioTypingRoles || [
            'Full Stack Developer',
            'UI/UX Designer', 
            'Creative Coder',
            'Problem Solver'
        ];
        
        let currentRoleIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        const roleElement = document.getElementById('changing-role');
        
        if (!roleElement) return;
        
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const pauseDuration = 2000;
        
        const type = () => {
            const currentRole = roles[currentRoleIndex];
            
            if (isDeleting) {
                roleElement.textContent = currentRole.substring(0, currentCharIndex - 1);
                currentCharIndex--;
            } else {
                roleElement.textContent = currentRole.substring(0, currentCharIndex + 1);
                currentCharIndex++;
            }
            
            let speed = isDeleting ? deleteSpeed : typeSpeed;
            
            if (!isDeleting && currentCharIndex === currentRole.length) {
                speed = pauseDuration;
                isDeleting = true;
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            }
            
            this.typingInterval = setTimeout(type, speed);
        };
        
        type();
    }
    
    initSkillBars() {
        const observerOptions = {
            threshold: 0.7
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBars = entry.target.querySelectorAll('.skill-progress');
                    skillBars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        setTimeout(() => {
                            bar.style.width = width + '%';
                        }, 200);
                    });
                }
            });
        }, observerOptions);
        
        const skillsSection = document.querySelector('.skills');
        if (skillsSection) {
            observer.observe(skillsSection);
        }
    }
    
    initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const observerOptions = {
            threshold: 0.7
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count'));
                    let current = 0;
                    
                    const increment = target / 100;
                    
                    const updateCounter = () => {
                        current += increment;
                        counter.textContent = Math.floor(current);
                        
                        if (current < target) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, observerOptions);
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    initProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        if (typeof gsap !== 'undefined') {
                            gsap.from(card, { scale: 0.8, opacity: 0, duration: 0.5 });
                        }
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        
        // Add form field animations
        const formGroups = form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            const highlight = group.querySelector('.form-highlight');
            
            if (input && highlight) {
                input.addEventListener('focus', () => {
                    highlight.style.width = '100%';
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value.trim()) {
                        highlight.style.width = '0%';
                    } else {
                        highlight.style.width = '100%';
                    }
                });
                
                // Check if input has value on page load
                if (input.value.trim()) {
                    highlight.style.width = '100%';
                }
            }
        });
        
        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });
    }
    
    handleFormSubmission(form) {
        const submitButton = form.querySelector('.btn-submit');
        const formData = new FormData(form);
        
        // Add loading state
        submitButton.classList.add('loading');
        
        // Simulate form submission
        setTimeout(() => {
            submitButton.classList.remove('loading');
            
            // Show success message
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form
            form.reset();
            
            // Reset form highlights
            form.querySelectorAll('.form-highlight').forEach(highlight => {
                highlight.style.width = '0%';
            });
            
        }, 2000);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add notification styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#4caf50' : '#2196f3',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: '10000',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    initScrollAnimations() {
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navMenu = document.getElementById('nav-menu');
                    const navToggle = document.getElementById('nav-toggle');
                    if (navMenu && navToggle) {
                        navMenu.classList.remove('active');
                        navToggle.classList.remove('active');
                    }
                }
            });
        });
    }
    
    initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-speed]');
        
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    parallaxElements.forEach(element => {
                        const speed = element.getAttribute('data-speed');
                        const yPos = -(window.scrollY * speed / 10);
                        element.style.transform = `translateY(${yPos}px)`;
                    });
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });
    }
    
    handleScroll() {
        this.scrollY = window.scrollY;
        this.updateActiveNavLink();
        this.updateScrollIndicator();
    }
    
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (this.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    }
    
    updateScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.opacity = this.scrollY > 100 ? '0' : '1';
        }
    }
    
    handleNavigation(link) {
        const section = link.getAttribute('data-section');
        const targetElement = document.getElementById(section);
        
        if (targetElement) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    handleResize() {
        // Handle responsive adjustments
        if (window.innerWidth < 768) {
            // Mobile optimizations
        }
    }
}

// Cursor effects
class CustomCursor {
    constructor() {
        this.cursor = null;
        this.cursorFollower = null;
        this.init();
    }
    
    init() {
        if (window.innerWidth < 768) return; // Skip on mobile
        
        this.createCursor();
        this.addEventListeners();
    }
    
    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        
        this.cursorFollower = document.createElement('div');
        this.cursorFollower.className = 'custom-cursor-follower';
        
        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorFollower);
        
        // Add cursor styles
        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor {
                position: fixed;
                width: 10px;
                height: 10px;
                background: #667eea;
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                transition: transform 0.1s ease;
            }
            
            .custom-cursor-follower {
                position: fixed;
                width: 40px;
                height: 40px;
                border: 2px solid rgba(102, 126, 234, 0.3);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.15s ease;
            }
            
            .custom-cursor.hover {
                transform: scale(1.5);
                background: #f093fb;
            }
            
            .custom-cursor-follower.hover {
                transform: scale(1.2);
                border-color: rgba(240, 147, 251, 0.5);
            }
        `;
        document.head.appendChild(style);
    }
    
    addEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX - 5 + 'px';
            this.cursor.style.top = e.clientY - 5 + 'px';
            
            this.cursorFollower.style.left = e.clientX - 20 + 'px';
            this.cursorFollower.style.top = e.clientY - 20 + 'px';
        });
        
        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
            this.cursorFollower.style.opacity = '1';
        });
        
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
            this.cursorFollower.style.opacity = '0';
        });
        
        // Add hover effects for interactive elements
        const hoverElements = 'a, button, .btn, .project-card, .social-link, .nav-link';
        document.addEventListener('mouseover', (e) => {
            if (e.target.matches(hoverElements)) {
                this.cursor.classList.add('hover');
                this.cursorFollower.classList.add('hover');
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.matches(hoverElements)) {
                this.cursor.classList.remove('hover');
                this.cursorFollower.classList.remove('hover');
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new AdvancedPortfolio();
    const cursor = new CustomCursor();
    
    // Make portfolio instance globally available for debugging
    window.portfolio = portfolio;
});

// Performance optimization: Lazy load images
const lazyImages = document.querySelectorAll('img[data-src]');
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}