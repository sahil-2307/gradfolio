// Minimal Portfolio JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeContactForm();
});

// Navigation
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            navMenu.classList.remove('active');
        });
    });
}

// Scroll effects
function initializeScrollEffects() {
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.9)';
        }
    });
}

// Contact form
function initializeContactForm() {
    const form = document.querySelector('.contact-form form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Thank you for your message!');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Portfolio update functions
window.updateContent = {
    personal: function(data) {
        if (data.fullName) {
            document.getElementById('nav-name').textContent = data.fullName;
            document.getElementById('hero-name').textContent = data.fullName;
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
            const emailLink = document.getElementById('contact-email');
            emailLink.textContent = data.email;
            emailLink.href = 'mailto:' + data.email;
        }
        if (data.phone) {
            const phoneLink = document.getElementById('contact-phone');
            phoneLink.textContent = data.phone;
            phoneLink.href = 'tel:' + data.phone;
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
            const skillDiv = document.createElement('div');
            skillDiv.className = 'skill-item';
            skillDiv.innerHTML = `
                <h3>${category.category}</h3>
                <p>${category.skills.join(', ')}</p>
            `;
            container.appendChild(skillDiv);
        });
    },

    experience: function(experienceData) {
        const container = document.getElementById('experience-container');
        if (!container || !experienceData) return;

        container.innerHTML = '';
        experienceData.forEach(exp => {
            const expDiv = document.createElement('div');
            expDiv.className = 'exp-item';
            expDiv.innerHTML = `
                <div class="exp-year">${exp.startDate} - ${exp.endDate}</div>
                <div class="exp-content">
                    <h3>${exp.position}</h3>
                    <p>${exp.company}</p>
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
            projectDiv.className = 'work-item';
            projectDiv.innerHTML = `
                <div class="work-image">
                    <img src="${project.image || 'https://via.placeholder.com/400x300'}" alt="${project.title}">
                </div>
                <div class="work-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="work-links">
                        ${project.liveUrl ? `<a href="${project.liveUrl}" class="work-link" target="_blank">View</a>` : ''}
                        ${project.githubUrl ? `<a href="${project.githubUrl}" class="work-link" target="_blank">Code</a>` : ''}
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
            socialLink.textContent = social.platform;
            container.appendChild(socialLink);
        });
    }
};