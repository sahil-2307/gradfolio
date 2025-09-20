// Professional Portfolio JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeContactForm();
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll effects
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Active navigation highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animateElements = document.querySelectorAll('.timeline-item, .project-card, .skill-category, .stat-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // Add animate-in styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.innerHTML = '';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }

        setTimeout(typeWriter, 500);
    }
}

// Contact form
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name') || this.querySelector('input[type="text"]').value;
            const email = formData.get('email') || this.querySelector('input[type="email"]').value;
            const message = formData.get('message') || this.querySelector('textarea').value;

            // Simulate form submission
            const submitBtn = this.querySelector('.btn-primary');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert('Thank you for your message! I\'ll get back to you soon.');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Utility functions
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll-to-top button
function addScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(20px);
        z-index: 1000;
    `;

    scrollBtn.addEventListener('click', scrollToTop);
    document.body.appendChild(scrollBtn);

    // Show/hide scroll button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.transform = 'translateY(0)';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.transform = 'translateY(20px)';
        }
    });
}

// Initialize scroll-to-top button
addScrollToTopButton();

// Portfolio data update functions
window.updateContent = {
    personal: function(data) {
        if (data.fullName) {
            document.getElementById('nav-name').textContent = data.fullName;
            document.getElementById('hero-name').textContent = data.fullName;
            document.getElementById('footer-name').textContent = data.fullName;
        }
        if (data.designation) {
            document.getElementById('hero-designation').textContent = data.designation;
        }
        if (data.heroDescription) {
            document.getElementById('hero-description').textContent = data.heroDescription;
        }
        if (data.profilePhoto) {
            document.getElementById('hero-photo').src = data.profilePhoto;
        }
        if (data.resumeUrl) {
            document.getElementById('download-resume').href = data.resumeUrl;
        }
    },

    about: function(data) {
        if (data.paragraph1) {
            document.getElementById('about-para1').textContent = data.paragraph1;
        }
        if (data.paragraph2) {
            document.getElementById('about-para2').textContent = data.paragraph2;
        }
        if (data.statProjects) {
            document.getElementById('stat-projects').textContent = data.statProjects;
        }
        if (data.statExperience) {
            document.getElementById('stat-experience').textContent = data.statExperience;
        }
        if (data.statClients) {
            document.getElementById('stat-clients').textContent = data.statClients;
        }
    },

    contact: function(data) {
        if (data.contactDescription) {
            document.getElementById('contact-description').textContent = data.contactDescription;
        }
        if (data.email) {
            document.getElementById('contact-email').textContent = data.email;
        }
        if (data.phone) {
            document.getElementById('contact-phone').textContent = data.phone;
        }
        if (data.location) {
            document.getElementById('contact-location').textContent = data.location;
        }
    },

    skills: function(skillsData) {
        const container = document.getElementById('skills-container');
        if (!container || !skillsData) return;

        container.innerHTML = '';
        skillsData.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'skill-category';
            categoryDiv.innerHTML = `
                <h3>${category.category}</h3>
                <div class="skill-tags">
                    ${category.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            `;
            container.appendChild(categoryDiv);
        });
    },

    experience: function(experienceData) {
        const container = document.getElementById('experience-container');
        if (!container || !experienceData) return;

        container.innerHTML = '';
        experienceData.forEach((exp, index) => {
            const expDiv = document.createElement('div');
            expDiv.className = 'timeline-item';
            expDiv.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <h3>${exp.position}</h3>
                    <h4>${exp.company}</h4>
                    <p class="timeline-date">${exp.startDate} - ${exp.endDate}</p>
                    <p>${exp.description}</p>
                </div>
            `;
            container.appendChild(expDiv);
        });
    },

    projects: function(projectsData) {
        const container = document.getElementById('projects-container');
        if (!container || !projectsData) return;

        container.innerHTML = '';
        projectsData.forEach(project => {
            const projectDiv = document.createElement('div');
            projectDiv.className = 'project-card';
            projectDiv.innerHTML = `
                <div class="project-image">
                    <img src="${project.image || 'https://via.placeholder.com/400x250'}" alt="${project.title}">
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tech">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        ${project.liveUrl ? `<a href="${project.liveUrl}" class="project-link" target="_blank">Live Demo</a>` : ''}
                        ${project.githubUrl ? `<a href="${project.githubUrl}" class="project-link" target="_blank">GitHub</a>` : ''}
                    </div>
                </div>
            `;
            container.appendChild(projectDiv);
        });
    },

    socialLinks: function(socialData) {
        const container = document.getElementById('social-links');
        if (!container || !socialData) return;

        container.innerHTML = '';
        socialData.forEach(social => {
            const socialLink = document.createElement('a');
            socialLink.href = social.url;
            socialLink.className = 'social-link';
            socialLink.target = '_blank';
            socialLink.innerHTML = `<i class="${social.icon}"></i>`;
            container.appendChild(socialLink);
        });
    }
};