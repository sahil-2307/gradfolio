// Developer Portfolio JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeTerminalEffects();
    initializeContactForm();
});

function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
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

function initializeTerminalEffects() {
    // Add typing effect to commands
    const typingElements = document.querySelectorAll('.typing-animation');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        setTimeout(typeWriter, 2000);
    });
}

function initializeContactForm() {
    const form = document.querySelector('.contact-form form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Message sent successfully!');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Portfolio update functions
window.updateContent = {
    personal: function(data) {
        if (data.fullName) {
            document.getElementById('nav-name').textContent = data.fullName.toLowerCase().replace(' ', '_');
            document.getElementById('hero-name').textContent = data.fullName.toLowerCase().replace(' ', '_');
            document.getElementById('about-name').textContent = `"${data.fullName}"`;
        }
        if (data.designation) {
            document.getElementById('hero-designation').textContent = data.designation;
            document.getElementById('about-role').textContent = `"${data.designation}"`;
        }
        if (data.heroDescription) {
            document.getElementById('hero-description').textContent = data.heroDescription;
        }
        if (data.resumeUrl) {
            document.getElementById('download-resume').href = data.resumeUrl;
        }
    },

    about: function(data) {
        if (data.paragraph1) {
            document.getElementById('about-para1').textContent = `"${data.paragraph1}"`;
        }
        if (data.paragraph2) {
            document.getElementById('about-para2').textContent = `"${data.paragraph2}"`;
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
        if (data.location) {
            document.getElementById('about-location').textContent = `"${data.location}"`;
        }
    },

    contact: function(data) {
        if (data.contactDescription) {
            document.getElementById('contact-description').textContent = data.contactDescription;
        }
        if (data.email) {
            document.getElementById('contact-email').textContent = `"${data.email}"`;
        }
        if (data.phone) {
            document.getElementById('contact-phone').textContent = `"${data.phone}"`;
        }
        if (data.location) {
            document.getElementById('contact-location').textContent = `"${data.location}"`;
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
                <h3 class="skill-title">
                    <i class="fas fa-folder"></i>
                    ${category.category.toLowerCase()}/
                </h3>
                <div class="skill-items">
                    ${category.skills.map(skill => `
                        <span class="skill-tag">
                            <i class="fas fa-code"></i>
                            ${skill}
                        </span>
                    `).join('')}
                </div>
            `;
            container.appendChild(categoryDiv);
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
                <div class="project-header">
                    <div class="project-title">
                        <i class="fas fa-folder-open"></i>
                        <span>${project.title.toLowerCase().replace(/\s+/g, '-')}</span>
                    </div>
                    <div class="project-stars">
                        <i class="fas fa-star"></i>
                        <span>42</span>
                    </div>
                </div>
                <div class="project-description">
                    ${project.description}
                </div>
                <div class="project-languages">
                    ${project.technologies.map(tech => `
                        <span class="lang" data-lang="${tech.toLowerCase()}">${tech}</span>
                    `).join('')}
                </div>
                <div class="project-links">
                    ${project.liveUrl ? `<a href="${project.liveUrl}" class="project-link" target="_blank">
                        <i class="fas fa-external-link-alt"></i>
                        Live Demo
                    </a>` : ''}
                    ${project.githubUrl ? `<a href="${project.githubUrl}" class="project-link" target="_blank">
                        <i class="fab fa-github"></i>
                        Source
                    </a>` : ''}
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
            socialLink.setAttribute('data-tooltip', social.platform);
            socialLink.innerHTML = `<i class="${social.icon}"></i>`;
            container.appendChild(socialLink);
        });
    }
};