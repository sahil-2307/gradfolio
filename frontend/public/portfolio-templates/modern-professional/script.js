// Modern Professional Portfolio Script
class ModernPortfolio {
    constructor() {
        this.isEditing = false;
        this.currentData = null;
        this.init();
    }

    init() {
        // Initialize portfolio
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupControls();
        this.loadPortfolioData();
        
        // Check if we're in preview/edit mode
        const urlParams = new URLSearchParams(window.location.search);
        const isPreview = urlParams.get('preview') === 'true';
        const editMode = urlParams.get('edit') === 'true';
        
        if (isPreview || editMode) {
            this.showControls();
        }
    }

    setupNavigation() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile hamburger menu
        hamburger?.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Smooth scrolling for nav links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Close mobile menu
                    hamburger?.classList.remove('active');
                    navMenu?.classList.remove('active');
                    
                    // Update active nav link
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });

        // Update active nav link on scroll
        window.addEventListener('scroll', this.updateActiveNavLink.bind(this));
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

    setupScrollEffects() {
        // Navbar background on scroll
        const navbar = document.getElementById('navbar');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    setupControls() {
        const editBtn = document.getElementById('edit-btn');
        const deployBtn = document.getElementById('deploy-btn');
        const previewBtn = document.getElementById('preview-btn');

        editBtn?.addEventListener('click', this.handleEdit.bind(this));
        deployBtn?.addEventListener('click', this.handleDeploy.bind(this));
        previewBtn?.addEventListener('click', this.handlePreview.bind(this));
    }

    showControls() {
        const controls = document.getElementById('portfolio-controls');
        if (controls) {
            controls.classList.add('visible');
        }
    }

    hideControls() {
        const controls = document.getElementById('portfolio-controls');
        if (controls) {
            controls.classList.remove('visible');
        }
    }

    handleEdit() {
        console.log('Edit mode activated');
        this.isEditing = !this.isEditing;
        
        if (this.isEditing) {
            this.enableEditMode();
        } else {
            this.disableEditMode();
        }
    }

    enableEditMode() {
        // Make editable fields contenteditable
        const editableFields = document.querySelectorAll('[data-field]');
        editableFields.forEach(field => {
            field.contentEditable = true;
            field.classList.add('editable');
            field.addEventListener('blur', this.handleFieldEdit.bind(this));
        });

        // Update button text
        const editBtn = document.getElementById('edit-btn');
        if (editBtn) {
            editBtn.innerHTML = '<i class="fas fa-save"></i><span>Save Changes</span>';
            editBtn.classList.add('saving');
        }

        // Show editing indicators
        document.body.classList.add('editing-mode');
        this.showEditingTips();
    }

    disableEditMode() {
        // Remove contenteditable
        const editableFields = document.querySelectorAll('[data-field]');
        editableFields.forEach(field => {
            field.contentEditable = false;
            field.classList.remove('editable');
        });

        // Update button text
        const editBtn = document.getElementById('edit-btn');
        if (editBtn) {
            editBtn.innerHTML = '<i class="fas fa-edit"></i><span>Edit Portfolio</span>';
            editBtn.classList.remove('saving');
        }

        // Hide editing indicators
        document.body.classList.remove('editing-mode');
        this.hideEditingTips();

        // Save changes
        this.saveChanges();
    }

    handleFieldEdit(event) {
        const field = event.target;
        const fieldName = field.getAttribute('data-field');
        const newValue = field.textContent || field.innerText;
        
        // Update current data
        if (this.currentData && fieldName) {
            this.updateNestedProperty(this.currentData, fieldName, newValue);
        }

        console.log(`Field ${fieldName} updated to:`, newValue);
    }

    updateNestedProperty(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
    }

    showEditingTips() {
        // Create editing tips overlay
        const tipsOverlay = document.createElement('div');
        tipsOverlay.id = 'editing-tips';
        tipsOverlay.className = 'editing-tips';
        tipsOverlay.innerHTML = `
            <div class="tips-content">
                <h4>Editing Mode Active</h4>
                <p>Click on any text to edit it. Click "Save Changes" when done.</p>
                <button onclick="this.parentElement.parentElement.style.display='none'">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        document.body.appendChild(tipsOverlay);
    }

    hideEditingTips() {
        const tips = document.getElementById('editing-tips');
        if (tips) {
            tips.remove();
        }
    }

    async handleDeploy() {
        console.log('Deploy initiated');
        const deployBtn = document.getElementById('deploy-btn');
        
        if (deployBtn) {
            // Show loading state
            deployBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Deploying...</span>';
            deployBtn.disabled = true;
        }

        try {
            // Save current changes first
            await this.saveChanges();
            
            // Deploy portfolio
            const result = await this.deployToS3();
            
            if (result.success) {
                this.showDeploySuccess(result.url);
            } else {
                this.showDeployError(result.error);
            }
        } catch (error) {
            console.error('Deploy error:', error);
            this.showDeployError(error.message);
        } finally {
            if (deployBtn) {
                deployBtn.innerHTML = '<i class="fas fa-rocket"></i><span>Deploy Live</span>';
                deployBtn.disabled = false;
            }
        }
    }

    async deployToS3() {
        // This would integrate with your S3 deployment API
        const deployData = {
            portfolioData: this.currentData,
            template: 'modern-professional',
            userId: this.getUserId(),
            timestamp: Date.now()
        };

        const response = await fetch('/api/deploy-portfolio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deployData)
        });

        return await response.json();
    }

    handlePreview() {
        console.log('Preview mode activated');
        // Open preview in new tab
        const previewUrl = `${window.location.href}?preview=true`;
        window.open(previewUrl, '_blank');
    }

    async saveChanges() {
        if (!this.currentData) return;

        try {
            // Save to localStorage
            localStorage.setItem('portfolioData', JSON.stringify(this.currentData));
            
            // Save to server
            const response = await fetch('/api/save-portfolio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: this.currentData,
                    userId: this.getUserId(),
                    template: 'modern-professional'
                })
            });

            if (response.ok) {
                this.showSaveSuccess();
            } else {
                throw new Error('Failed to save changes');
            }
        } catch (error) {
            console.error('Save error:', error);
            this.showSaveError(error.message);
        }
    }

    loadPortfolioData() {
        // Check for data in URL params (for preview mode)
        const urlParams = new URLSearchParams(window.location.search);
        const dataParam = urlParams.get('data');
        
        if (dataParam) {
            try {
                this.currentData = JSON.parse(decodeURIComponent(dataParam));
                this.populatePortfolio(this.currentData);
                return;
            } catch (error) {
                console.error('Error parsing URL data:', error);
            }
        }

        // Check localStorage
        const savedData = localStorage.getItem('portfolioData');
        if (savedData) {
            try {
                this.currentData = JSON.parse(savedData);
                this.populatePortfolio(this.currentData);
                return;
            } catch (error) {
                console.error('Error parsing saved data:', error);
            }
        }

        // Load default/sample data
        this.loadSampleData();
    }

    populatePortfolio(data) {
        console.log('Populating portfolio with data:', data);

        // Basic information
        this.updateField('fullName', data.name || data.personal?.fullName);
        this.updateField('title', data.title || 'Professional');
        this.updateField('shortBio', data.about || data.shortBio);
        this.updateField('email', data.email || data.personal?.email);
        this.updateField('phone', data.phone || data.personal?.phone);
        this.updateField('location', data.location || 'Location');

        // About section
        if (data.about || data.personal) {
            this.updateField('aboutParagraph1', data.about?.paragraph1 || data.aboutParagraph1);
            this.updateField('aboutParagraph2', data.about?.paragraph2 || data.aboutParagraph2);
        }

        // Social links
        this.updateSocialLinks(data);

        // Stats
        this.updateStats(data);

        // Skills
        this.populateSkills(data.skills || {});

        // Experience
        this.populateExperience(data.experience || []);

        // Projects
        this.populateProjects(data.projects || []);
    }

    updateField(fieldName, value) {
        const elements = document.querySelectorAll(`[data-field="${fieldName}"]`);
        elements.forEach(element => {
            if (value) {
                element.textContent = value;
            }
        });

        // Also update placeholder replacements
        const placeholderElements = document.querySelectorAll(`*:not(script)`);
        placeholderElements.forEach(element => {
            if (element.textContent) {
                element.textContent = element.textContent.replace(
                    new RegExp(`{{${fieldName.toUpperCase()}}}`, 'g'),
                    value || ''
                );
            }
        });
    }

    updateSocialLinks(data) {
        const socialLinks = {
            linkedin: data.linkedin || data.personal?.linkedin,
            github: data.github || data.personal?.github,
            website: data.website || data.personal?.website
        };

        Object.entries(socialLinks).forEach(([platform, url]) => {
            const link = document.querySelector(`.social-link.${platform}`);
            if (link && url) {
                link.href = url;
                link.style.display = 'flex';
            } else if (link) {
                link.style.display = 'none';
            }
        });
    }

    updateStats(data) {
        const projectsCount = data.projects?.length || 0;
        const experienceYears = this.calculateExperienceYears(data.experience || []);
        const skillsCount = this.getTotalSkillsCount(data.skills || {});

        document.getElementById('projects-count').textContent = projectsCount;
        document.getElementById('experience-years').textContent = experienceYears;
        document.getElementById('skills-count').textContent = skillsCount;
    }

    calculateExperienceYears(experience) {
        if (!experience.length) return '2+';
        
        const currentYear = new Date().getFullYear();
        const startYear = Math.min(...experience.map(exp => {
            const year = parseInt(exp.startYear || exp.year || currentYear);
            return isNaN(year) ? currentYear : year;
        }));
        
        return Math.max(1, currentYear - startYear);
    }

    getTotalSkillsCount(skills) {
        const technical = Array.isArray(skills.technical) ? skills.technical.length : 0;
        const soft = Array.isArray(skills.soft) ? skills.soft.length : 0;
        return technical + soft;
    }

    populateSkills(skills) {
        const technicalSkills = skills.technical || [];
        const softSkills = skills.soft || [];

        this.renderSkills('technical-skills', technicalSkills);
        this.renderSkills('soft-skills', softSkills);
    }

    renderSkills(containerId, skillsList) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        
        skillsList.forEach(skill => {
            const skillElement = document.createElement('div');
            skillElement.className = 'skill-item';
            skillElement.innerHTML = `
                <div class="skill-name">${skill}</div>
            `;
            container.appendChild(skillElement);
        });
    }

    populateExperience(experience) {
        const container = document.getElementById('experience-timeline');
        if (!container) return;

        container.innerHTML = '';

        experience.forEach((exp, index) => {
            const expElement = document.createElement('div');
            expElement.className = 'experience-item';
            expElement.innerHTML = `
                <div class="experience-content">
                    <div class="experience-title" data-field="experience.${index}.position">${exp.position || exp.title}</div>
                    <div class="experience-company" data-field="experience.${index}.company">${exp.company}</div>
                    <div class="experience-description" data-field="experience.${index}.description">${exp.description}</div>
                </div>
                <div class="experience-date">${exp.duration || exp.year}</div>
            `;
            container.appendChild(expElement);
        });
    }

    populateProjects(projects) {
        const container = document.getElementById('projects-grid');
        if (!container) return;

        container.innerHTML = '';

        projects.slice(0, 6).forEach((project, index) => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project-card';
            projectElement.innerHTML = `
                <div class="project-image">
                    <i class="fas fa-code"></i>
                </div>
                <div class="project-content">
                    <h3 class="project-title" data-field="projects.${index}.title">${project.title}</h3>
                    <p class="project-description" data-field="projects.${index}.description">${project.description}</p>
                    <div class="project-tech">
                        ${(project.technologies || []).map(tech => 
                            `<span class="tech-tag">${tech}</span>`
                        ).join('')}
                    </div>
                    <div class="project-links">
                        ${project.link ? `<a href="${project.link}" class="project-link" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i>View Project</a>` : ''}
                        ${project.github ? `<a href="${project.github}" class="project-link" target="_blank" rel="noopener"><i class="fab fa-github"></i>Code</a>` : ''}
                    </div>
                </div>
            `;
            container.appendChild(projectElement);
        });
    }

    loadSampleData() {
        const sampleData = {
            name: 'Alex Johnson',
            title: 'Full Stack Developer',
            shortBio: 'Passionate developer creating modern web applications with cutting-edge technologies.',
            email: 'alex.johnson@email.com',
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA',
            linkedin: 'https://linkedin.com/in/alexjohnson',
            github: 'https://github.com/alexjohnson',
            website: 'https://alexjohnson.dev',
            aboutParagraph1: 'I am a passionate full stack developer with over 5 years of experience creating innovative web applications. I specialize in React, Node.js, and modern JavaScript frameworks.',
            aboutParagraph2: 'When I\'m not coding, you can find me exploring new technologies, contributing to open source projects, or sharing knowledge through technical writing and mentoring.',
            skills: {
                technical: ['JavaScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker'],
                soft: ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration']
            },
            experience: [
                {
                    position: 'Senior Full Stack Developer',
                    company: 'TechCorp Inc.',
                    duration: '2022 - Present',
                    description: 'Leading development of scalable web applications serving millions of users. Architected microservices infrastructure and mentored junior developers.'
                },
                {
                    position: 'Frontend Developer',
                    company: 'StartupXYZ',
                    duration: '2020 - 2022',
                    description: 'Built responsive web applications using React and TypeScript. Collaborated with design team to create intuitive user experiences.'
                }
            ],
            projects: [
                {
                    title: 'E-commerce Platform',
                    description: 'A full-featured e-commerce platform built with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.',
                    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
                    link: 'https://example.com'
                },
                {
                    title: 'Task Management App',
                    description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
                    technologies: ['Vue.js', 'Express.js', 'MongoDB', 'Socket.io'],
                    link: 'https://example.com'
                }
            ]
        };

        this.currentData = sampleData;
        this.populatePortfolio(sampleData);
    }

    getUserId() {
        // This would normally get the user ID from authentication
        return localStorage.getItem('userId') || 'anonymous';
    }

    showSaveSuccess() {
        this.showNotification('Changes saved successfully!', 'success');
    }

    showSaveError(message) {
        this.showNotification(`Error saving changes: ${message}`, 'error');
    }

    showDeploySuccess(url) {
        const message = `Portfolio deployed successfully! <a href="${url}" target="_blank">View Live Site</a>`;
        this.showNotification(message, 'success', 10000);
    }

    showDeployError(message) {
        this.showNotification(`Deployment failed: ${message}`, 'error');
    }

    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after duration
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.modernPortfolio = new ModernPortfolio();
});

// Add CSS for editing mode and notifications
const style = document.createElement('style');
style.textContent = `
    .editable {
        outline: 2px dashed var(--primary-color);
        outline-offset: 2px;
        cursor: text;
        transition: all 0.2s ease;
    }

    .editable:hover {
        background-color: rgba(37, 99, 235, 0.05);
    }

    .editing-tips {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: var(--shadow-large);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .tips-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .tips-content h4 {
        margin: 0;
        font-size: 1rem;
    }

    .tips-content p {
        margin: 0;
        font-size: 0.9rem;
        opacity: 0.9;
    }

    .tips-content button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 4px;
        transition: background-color 0.2s ease;
    }

    .tips-content button:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }

    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        box-shadow: var(--shadow-large);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 1002;
        max-width: 400px;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-success {
        background-color: #10b981;
    }

    .notification-error {
        background-color: #ef4444;
    }

    .notification-info {
        background-color: var(--primary-color);
    }

    .notification a {
        color: white;
        text-decoration: underline;
    }
`;
document.head.appendChild(style);