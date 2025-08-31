// Advanced Portfolio Admin Panel JavaScript
class AdvancedPortfolioAdmin {
    constructor() {
        this.data = {
            personal: {
                fullName: "Sahil Bhujbal",
                designation: "Full Stack Developer",
                heroDescription: "Passionate about creating innovative digital solutions that blend creativity with cutting-edge technology. I transform ideas into immersive experiences.",
                typingRoles: ["Full Stack Developer", "UI/UX Designer", "Creative Coder", "Problem Solver"],
                profilePhoto: "",
                resumeUrl: "",
                resumeFileName: ""
            },
            about: {
                title: "Creative Developer & Problem Solver",
                description: "I'm a passionate full-stack developer with over 3 years of experience creating digital experiences that make a difference. My journey began with curiosity about how things work, and it has evolved into a deep love for crafting elegant solutions to complex problems.",
                whatIDo: "I specialize in building modern web applications using cutting-edge technologies. From responsive frontends to scalable backends, I create comprehensive solutions.",
                myApproach: "I believe in clean code, user-centered design, and continuous learning. Every project is an opportunity to push boundaries and explore new possibilities.",
                stats: {
                    projects: 50,
                    experience: 3,
                    clients: 25,
                    technologies: 15
                }
            },
            skills: {
                categories: [
                    {
                        id: "frontend",
                        name: "Frontend Development",
                        icon: "fas fa-palette",
                        skills: [
                            { name: "React.js", level: 95 },
                            { name: "JavaScript", level: 92 },
                            { name: "CSS/SASS", level: 90 },
                            { name: "TypeScript", level: 88 }
                        ]
                    },
                    {
                        id: "backend",
                        name: "Backend Development",
                        icon: "fas fa-server",
                        skills: [
                            { name: "Node.js", level: 90 },
                            { name: "Python", level: 85 },
                            { name: "Express.js", level: 88 },
                            { name: "MongoDB", level: 82 }
                        ]
                    },
                    {
                        id: "tools",
                        name: "Tools & Technologies",
                        icon: "fas fa-tools",
                        skills: [
                            { name: "Git & GitHub", level: 93 },
                            { name: "Docker", level: 80 },
                            { name: "AWS", level: 75 },
                            { name: "Figma", level: 85 }
                        ]
                    }
                ]
            },
            experience: [
                {
                    id: "exp1",
                    title: "Senior Full Stack Developer",
                    company: "Tech Innovators Inc.",
                    duration: "2024 - Present",
                    description: "Leading development of scalable web applications using React, Node.js, and cloud technologies. Mentoring junior developers and architecting solutions for complex business requirements.",
                    tags: ["React", "Node.js", "AWS", "Leadership"]
                },
                {
                    id: "exp2",
                    title: "Full Stack Developer",
                    company: "Digital Solutions Ltd.",
                    duration: "2023 - 2024",
                    description: "Developed and maintained multiple client projects, implemented CI/CD pipelines, and collaborated with cross-functional teams to deliver high-quality software solutions.",
                    tags: ["Vue.js", "Python", "Docker", "MongoDB"]
                },
                {
                    id: "exp3",
                    title: "Frontend Developer",
                    company: "Creative Web Agency",
                    duration: "2022 - 2023",
                    description: "Specialized in creating responsive and interactive user interfaces. Worked closely with designers to implement pixel-perfect designs and optimize user experience.",
                    tags: ["JavaScript", "CSS3", "SASS", "Figma"]
                }
            ],
            projects: [
                {
                    id: "proj1",
                    title: "E-Commerce Platform",
                    description: "A full-featured e-commerce platform with user authentication, payment processing, and admin dashboard. Built with modern technologies for optimal performance.",
                    category: "web",
                    technologies: ["React", "Node.js"],
                    githubUrl: "",
                    liveUrl: "",
                    featured: true
                },
                {
                    id: "proj2",
                    title: "Task Management App",
                    description: "Collaborative task management application with real-time updates, team collaboration features, and advanced project tracking capabilities.",
                    category: "web",
                    technologies: ["Vue.js", "Python"],
                    githubUrl: "",
                    liveUrl: "",
                    featured: true
                },
                {
                    id: "proj3",
                    title: "Fitness Tracker",
                    description: "Mobile application for tracking fitness activities, monitoring progress, and connecting with a community of fitness enthusiasts.",
                    category: "mobile",
                    technologies: ["React Native", "Firebase"],
                    githubUrl: "",
                    liveUrl: "",
                    featured: true
                },
                {
                    id: "proj4",
                    title: "Banking App Design",
                    description: "Modern and intuitive banking application design focused on user experience, accessibility, and seamless financial transaction flows.",
                    category: "design",
                    technologies: ["Figma", "UI/UX"],
                    githubUrl: "",
                    liveUrl: "",
                    featured: false
                }
            ],
            contact: {
                email: "sahil@example.com",
                phone: "+1 (555) 123-4567",
                location: "San Francisco, CA",
                socialLinks: [
                    { id: "linkedin", name: "LinkedIn", url: "", icon: "fab fa-linkedin-in" },
                    { id: "github", name: "GitHub", url: "", icon: "fab fa-github" },
                    { id: "twitter", name: "Twitter", url: "", icon: "fab fa-twitter" },
                    { id: "instagram", name: "Instagram", url: "", icon: "fab fa-instagram" }
                ]
            },
            theme: {
                primaryColor: "#667eea",
                secondaryColor: "#764ba2",
                accentColor: "#f093fb",
                backgroundColor: "#0a0a0a"
            }
        };
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.populateForms();
        this.hideLoadingOverlay();
    }
    
    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            setTimeout(() => {
                overlay.classList.add('hidden');
                setTimeout(() => overlay.remove(), 500);
            }, 1000);
        }
    }
    
    loadData() {
        const savedData = localStorage.getItem('advancedPortfolioData');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                this.data = { ...this.data, ...parsed };
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    }
    
    saveData() {
        try {
            localStorage.setItem('advancedPortfolioData', JSON.stringify(this.data));
            this.showMessage('Data saved successfully!', 'success');
        } catch (e) {
            console.error('Error saving data:', e);
            this.showMessage('Failed to save data. Please try again.', 'error');
        }
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(item.getAttribute('data-section'));
                
                // Update active state
                document.querySelectorAll('.menu-item').forEach(mi => mi.classList.remove('active'));
                item.classList.add('active');
            });
        });
        
        // Form submissions
        document.getElementById('personal-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePersonalInfo();
        });
        
        document.getElementById('about-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAboutInfo();
        });
        
        document.getElementById('contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveContactInfo();
        });
        
        document.getElementById('theme-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTheme();
        });
    }
    
    showSection(sectionId) {
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }
    
    populateForms() {
        this.populatePersonalForm();
        this.populateAboutForm();
        this.populateSkillsSection();
        this.populateExperienceSection();
        this.populateProjectsSection();
        this.populateContactForm();
        this.populateThemeForm();
    }
    
    populatePersonalForm() {
        const form = document.getElementById('personal-form');
        const data = this.data.personal;
        
        form.fullName.value = data.fullName || '';
        form.designation.value = data.designation || '';
        form.heroDescription.value = data.heroDescription || '';
        form.typingRoles.value = Array.isArray(data.typingRoles) ? data.typingRoles.join(', ') : '';
        
        // Show profile photo if exists
        if (data.profilePhoto) {
            this.showPhotoPreview(data.profilePhoto);
        }
        
        // Show resume if exists
        if (data.resumeUrl) {
            this.showResumePreview(data.resumeUrl, data.resumeFileName);
        }
    }
    
    populateAboutForm() {
        const form = document.getElementById('about-form');
        const data = this.data.about;
        
        form.aboutTitle.value = data.title || '';
        form.aboutDescription.value = data.description || '';
        form.whatIDo.value = data.whatIDo || '';
        form.myApproach.value = data.myApproach || '';
        
        // Populate stats
        form.projectsCount.value = data.stats?.projects || 0;
        form.yearsExperience.value = data.stats?.experience || 0;
        form.happyClients.value = data.stats?.clients || 0;
        form.technologies.value = data.stats?.technologies || 0;
    }
    
    populateSkillsSection() {
        const container = document.getElementById('skills-categories');
        container.innerHTML = '';
        
        this.data.skills.categories.forEach(category => {
            const categoryDiv = this.createSkillCategoryElement(category);
            container.appendChild(categoryDiv);
        });
    }
    
    createSkillCategoryElement(category) {
        const div = document.createElement('div');
        div.className = 'skill-category-item';
        div.innerHTML = `
            <div class="category-header">
                <h3><i class="${category.icon}"></i> ${category.name}</h3>
                <button type="button" class="btn btn-danger btn-xs" onclick="removeSkillCategory('${category.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="skills-list" id="skills-${category.id}">
                ${category.skills.map((skill, index) => `
                    <div class="skill-item">
                        <input type="text" value="${skill.name}" placeholder="Skill Name" 
                               onchange="updateSkillName('${category.id}', ${index}, this.value)">
                        <input type="number" class="skill-level-input" min="0" max="100" value="${skill.level}" 
                               onchange="updateSkillLevel('${category.id}', ${index}, this.value)">
                        <button type="button" class="btn btn-danger btn-xs" 
                                onclick="removeSkill('${category.id}', ${index})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('')}
                <button type="button" class="btn btn-secondary btn-sm" 
                        onclick="addSkill('${category.id}')">
                    <i class="fas fa-plus"></i> Add Skill
                </button>
            </div>
        `;
        return div;
    }
    
    populateExperienceSection() {
        const container = document.getElementById('experience-list');
        container.innerHTML = '';
        
        this.data.experience.forEach((exp, index) => {
            const expDiv = this.createExperienceElement(exp, index);
            container.appendChild(expDiv);
        });
    }
    
    createExperienceElement(exp, index) {
        const div = document.createElement('div');
        div.className = 'experience-item';
        div.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" value="${exp.title}" onchange="updateExperience(${index}, 'title', this.value)">
                </div>
                <div class="form-group">
                    <label>Company</label>
                    <input type="text" value="${exp.company}" onchange="updateExperience(${index}, 'company', this.value)">
                </div>
            </div>
            <div class="form-group">
                <label>Duration</label>
                <input type="text" value="${exp.duration}" onchange="updateExperience(${index}, 'duration', this.value)">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea rows="3" onchange="updateExperience(${index}, 'description', this.value)">${exp.description}</textarea>
            </div>
            <div class="form-group">
                <label>Technologies/Tags (comma separated)</label>
                <input type="text" value="${exp.tags.join(', ')}" onchange="updateExperienceTags(${index}, this.value)">
            </div>
            <div class="item-actions">
                <button type="button" class="btn btn-danger" onclick="removeExperience(${index})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        return div;
    }
    
    populateProjectsSection() {
        const container = document.getElementById('projects-list');
        container.innerHTML = '';
        
        this.data.projects.forEach((project, index) => {
            const projectDiv = this.createProjectElement(project, index);
            container.appendChild(projectDiv);
        });
    }
    
    createProjectElement(project, index) {
        const div = document.createElement('div');
        div.className = 'project-item';
        div.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Project Title</label>
                    <input type="text" value="${project.title}" onchange="updateProject(${index}, 'title', this.value)">
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select onchange="updateProject(${index}, 'category', this.value)">
                        <option value="web" ${project.category === 'web' ? 'selected' : ''}>Web Application</option>
                        <option value="mobile" ${project.category === 'mobile' ? 'selected' : ''}>Mobile App</option>
                        <option value="design" ${project.category === 'design' ? 'selected' : ''}>Design</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea rows="3" onchange="updateProject(${index}, 'description', this.value)">${project.description}</textarea>
            </div>
            <div class="form-group">
                <label>Technologies (comma separated)</label>
                <input type="text" value="${project.technologies.join(', ')}" onchange="updateProjectTechnologies(${index}, this.value)">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>GitHub URL</label>
                    <input type="url" value="${project.githubUrl}" onchange="updateProject(${index}, 'githubUrl', this.value)">
                </div>
                <div class="form-group">
                    <label>Live URL</label>
                    <input type="url" value="${project.liveUrl}" onchange="updateProject(${index}, 'liveUrl', this.value)">
                </div>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" ${project.featured ? 'checked' : ''} 
                           onchange="updateProject(${index}, 'featured', this.checked)">
                    Featured Project
                </label>
            </div>
            <div class="item-actions">
                <button type="button" class="btn btn-danger" onclick="removeProject(${index})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        return div;
    }
    
    populateContactForm() {
        const form = document.getElementById('contact-form');
        const data = this.data.contact;
        
        form.contactEmail.value = data.email || '';
        form.contactPhone.value = data.phone || '';
        form.contactLocation.value = data.location || '';
        
        this.populateSocialLinks();
    }
    
    populateSocialLinks() {
        const container = document.getElementById('social-links-list');
        container.innerHTML = '';
        
        this.data.contact.socialLinks.forEach((link, index) => {
            const linkDiv = document.createElement('div');
            linkDiv.className = 'social-link-item';
            linkDiv.innerHTML = `
                <div class="form-row">
                    <div class="form-group">
                        <label>Platform</label>
                        <input type="text" value="${link.name}" onchange="updateSocialLink(${index}, 'name', this.value)">
                    </div>
                    <div class="form-group">
                        <label>URL</label>
                        <input type="url" value="${link.url}" onchange="updateSocialLink(${index}, 'url', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Icon Class</label>
                        <input type="text" value="${link.icon}" onchange="updateSocialLink(${index}, 'icon', this.value)">
                    </div>
                    <button type="button" class="btn btn-danger btn-xs" onclick="removeSocialLink(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(linkDiv);
        });
    }
    
    populateThemeForm() {
        const form = document.getElementById('theme-form');
        const data = this.data.theme;
        
        form.primaryColor.value = data.primaryColor || '#667eea';
        form.secondaryColor.value = data.secondaryColor || '#764ba2';
        form.accentColor.value = data.accentColor || '#f093fb';
        form.backgroundColor.value = data.backgroundColor || '#0a0a0a';
    }
    
    // Save functions
    savePersonalInfo() {
        const form = document.getElementById('personal-form');
        this.data.personal.fullName = form.fullName.value;
        this.data.personal.designation = form.designation.value;
        this.data.personal.heroDescription = form.heroDescription.value;
        this.data.personal.typingRoles = form.typingRoles.value.split(',').map(s => s.trim());
        
        this.saveData();
    }
    
    saveAboutInfo() {
        const form = document.getElementById('about-form');
        this.data.about.title = form.aboutTitle.value;
        this.data.about.description = form.aboutDescription.value;
        this.data.about.whatIDo = form.whatIDo.value;
        this.data.about.myApproach = form.myApproach.value;
        this.data.about.stats = {
            projects: parseInt(form.projectsCount.value) || 0,
            experience: parseInt(form.yearsExperience.value) || 0,
            clients: parseInt(form.happyClients.value) || 0,
            technologies: parseInt(form.technologies.value) || 0
        };
        
        this.saveData();
    }
    
    saveContactInfo() {
        const form = document.getElementById('contact-form');
        this.data.contact.email = form.contactEmail.value;
        this.data.contact.phone = form.contactPhone.value;
        this.data.contact.location = form.contactLocation.value;
        
        this.saveData();
    }
    
    saveTheme() {
        const form = document.getElementById('theme-form');
        this.data.theme = {
            primaryColor: form.primaryColor.value,
            secondaryColor: form.secondaryColor.value,
            accentColor: form.accentColor.value,
            backgroundColor: form.backgroundColor.value
        };
        
        this.saveData();
    }
    
    // File handling
    handleProfilePhoto(event) {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                this.showMessage('File size should be less than 5MB', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                this.data.personal.profilePhoto = e.target.result;
                this.showPhotoPreview(e.target.result);
                this.saveData();
            };
            reader.readAsDataURL(file);
        }
    }
    
    loadPhotoFromURL() {
        const url = document.getElementById('profile-photo-url').value;
        if (url) {
            this.data.personal.profilePhoto = url;
            this.showPhotoPreview(url);
            this.saveData();
            document.getElementById('profile-photo-url').value = '';
        }
    }
    
    showPhotoPreview(src) {
        const preview = document.getElementById('photo-preview');
        const img = document.getElementById('photo-preview-img');
        img.src = src;
        preview.style.display = 'block';
    }
    
    removePhoto() {
        this.data.personal.profilePhoto = '';
        document.getElementById('photo-preview').style.display = 'none';
        this.saveData();
    }
    
    handleResumeUpload(event) {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                this.showMessage('File size should be less than 10MB', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                this.data.personal.resumeUrl = e.target.result;
                this.data.personal.resumeFileName = file.name;
                this.showResumePreview(e.target.result, file.name);
                this.saveData();
            };
            reader.readAsDataURL(file);
        }
    }
    
    loadResumeFromURL() {
        const url = document.getElementById('resume-url').value;
        if (url) {
            this.data.personal.resumeUrl = url;
            this.data.personal.resumeFileName = 'Resume';
            this.showResumePreview(url, 'Resume');
            this.saveData();
            document.getElementById('resume-url').value = '';
        }
    }
    
    showResumePreview(url, filename) {
        const preview = document.getElementById('resume-preview');
        const filenameSpan = document.getElementById('resume-filename');
        filenameSpan.textContent = filename;
        preview.style.display = 'block';
    }
    
    removeResume() {
        this.data.personal.resumeUrl = '';
        this.data.personal.resumeFileName = '';
        document.getElementById('resume-preview').style.display = 'none';
        this.saveData();
    }
    
    showMessage(message, type = 'info') {
        const container = document.getElementById('message-container');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle"></i>
            ${message}
        `;
        
        container.appendChild(messageDiv);
        
        setTimeout(() => messageDiv.classList.add('show'), 100);
        
        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => messageDiv.remove(), 300);
        }, 4000);
    }
}

// Global functions for inline handlers
let adminInstance;

// Skills management
function addSkillCategory() {
    const name = document.getElementById('new-category-name').value;
    const icon = document.getElementById('new-category-icon').value;
    
    if (name && icon) {
        const newCategory = {
            id: 'category_' + Date.now(),
            name: name,
            icon: icon,
            skills: []
        };
        
        adminInstance.data.skills.categories.push(newCategory);
        adminInstance.populateSkillsSection();
        adminInstance.saveData();
        
        document.getElementById('new-category-name').value = '';
        document.getElementById('new-category-icon').value = '';
    }
}

function removeSkillCategory(categoryId) {
    adminInstance.data.skills.categories = adminInstance.data.skills.categories.filter(cat => cat.id !== categoryId);
    adminInstance.populateSkillsSection();
    adminInstance.saveData();
}

function addSkill(categoryId) {
    const category = adminInstance.data.skills.categories.find(cat => cat.id === categoryId);
    if (category) {
        category.skills.push({ name: 'New Skill', level: 80 });
        adminInstance.populateSkillsSection();
        adminInstance.saveData();
        // Trigger update on main portfolio
        if (window.opener && window.opener.advancedPortfolioUpdater) {
            window.opener.advancedPortfolioUpdater.refresh();
        }
    }
}

function removeSkill(categoryId, skillIndex) {
    const category = adminInstance.data.skills.categories.find(cat => cat.id === categoryId);
    if (category) {
        category.skills.splice(skillIndex, 1);
        adminInstance.populateSkillsSection();
    }
}

function updateSkillName(categoryId, skillIndex, value) {
    const category = adminInstance.data.skills.categories.find(cat => cat.id === categoryId);
    if (category && category.skills[skillIndex]) {
        category.skills[skillIndex].name = value;
        adminInstance.saveData();
        // Trigger update on main portfolio
        if (window.opener && window.opener.advancedPortfolioUpdater) {
            window.opener.advancedPortfolioUpdater.refresh();
        }
    }
}

function updateSkillLevel(categoryId, skillIndex, value) {
    const category = adminInstance.data.skills.categories.find(cat => cat.id === categoryId);
    if (category && category.skills[skillIndex]) {
        category.skills[skillIndex].level = parseInt(value) || 0;
        adminInstance.saveData();
        // Trigger update on main portfolio
        if (window.opener && window.opener.advancedPortfolioUpdater) {
            window.opener.advancedPortfolioUpdater.refresh();
        }
    }
}

function saveSkills() {
    adminInstance.saveData();
    // Trigger update on main portfolio if it exists
    if (window.opener && window.opener.advancedPortfolioUpdater) {
        window.opener.advancedPortfolioUpdater.refresh();
    }
}

// Experience management
function addExperience() {
    const newExp = {
        id: 'exp_' + Date.now(),
        title: 'New Position',
        company: 'Company Name',
        duration: '2024 - Present',
        description: 'Job description...',
        tags: []
    };
    
    adminInstance.data.experience.unshift(newExp);
    adminInstance.populateExperienceSection();
}

function removeExperience(index) {
    adminInstance.data.experience.splice(index, 1);
    adminInstance.populateExperienceSection();
    adminInstance.saveData();
}

function updateExperience(index, field, value) {
    if (adminInstance.data.experience[index]) {
        adminInstance.data.experience[index][field] = value;
    }
}

function updateExperienceTags(index, value) {
    if (adminInstance.data.experience[index]) {
        adminInstance.data.experience[index].tags = value.split(',').map(s => s.trim());
    }
}

function saveExperience() {
    adminInstance.saveData();
}

// Project management
function addProject() {
    const newProject = {
        id: 'proj_' + Date.now(),
        title: 'New Project',
        description: 'Project description...',
        category: 'web',
        technologies: [],
        githubUrl: '',
        liveUrl: '',
        featured: false
    };
    
    adminInstance.data.projects.unshift(newProject);
    adminInstance.populateProjectsSection();
}

function removeProject(index) {
    adminInstance.data.projects.splice(index, 1);
    adminInstance.populateProjectsSection();
    adminInstance.saveData();
}

function updateProject(index, field, value) {
    if (adminInstance.data.projects[index]) {
        adminInstance.data.projects[index][field] = value;
    }
}

function updateProjectTechnologies(index, value) {
    if (adminInstance.data.projects[index]) {
        adminInstance.data.projects[index].technologies = value.split(',').map(s => s.trim());
    }
}

function saveProjects() {
    adminInstance.saveData();
}

// Social links management
function addSocialLink() {
    const newLink = {
        id: 'social_' + Date.now(),
        name: 'New Platform',
        url: '',
        icon: 'fab fa-link'
    };
    
    adminInstance.data.contact.socialLinks.push(newLink);
    adminInstance.populateSocialLinks();
}

function removeSocialLink(index) {
    adminInstance.data.contact.socialLinks.splice(index, 1);
    adminInstance.populateSocialLinks();
    adminInstance.saveData();
}

function updateSocialLink(index, field, value) {
    if (adminInstance.data.contact.socialLinks[index]) {
        adminInstance.data.contact.socialLinks[index][field] = value;
    }
}

// Theme presets
function applyThemePreset(preset) {
    const presets = {
        purple: { primary: '#667eea', secondary: '#764ba2', accent: '#f093fb', background: '#0a0a0a' },
        blue: { primary: '#4facfe', secondary: '#00f2fe', accent: '#43e97b', background: '#0a0a0a' },
        green: { primary: '#43e97b', secondary: '#38f9d7', accent: '#667eea', background: '#0a0a0a' },
        orange: { primary: '#fa709a', secondary: '#fee140', accent: '#667eea', background: '#0a0a0a' },
        pink: { primary: '#f093fb', secondary: '#f5576c', accent: '#4facfe', background: '#0a0a0a' },
        default: { primary: '#667eea', secondary: '#764ba2', accent: '#f093fb', background: '#0a0a0a' }
    };
    
    const colors = presets[preset];
    if (colors) {
        const form = document.getElementById('theme-form');
        form.primaryColor.value = colors.primary;
        form.secondaryColor.value = colors.secondary;
        form.accentColor.value = colors.accent;
        form.backgroundColor.value = colors.background;
        
        adminInstance.data.theme = colors;
        adminInstance.saveData();
    }
}

// File handlers for inline usage
function handleProfilePhoto(event) {
    adminInstance.handleProfilePhoto(event);
}

function loadPhotoFromURL() {
    adminInstance.loadPhotoFromURL();
}

function removePhoto() {
    adminInstance.removePhoto();
}

function handleResumeUpload(event) {
    adminInstance.handleResumeUpload(event);
}

function loadResumeFromURL() {
    adminInstance.loadResumeFromURL();
}

function removeResume() {
    adminInstance.removeResume();
}

// Utility functions
function previewSite() {
    window.open('https://gradfolio-previews.s3.amazonaws.com/creative/preview.html', '_blank');
}

function exportData() {
    const dataStr = JSON.stringify(adminInstance.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'advanced-portfolio-data.json';
    link.click();
    
    adminInstance.showMessage('Data exported successfully!', 'success');
}

function importData(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                adminInstance.data = { ...adminInstance.data, ...importedData };
                adminInstance.populateForms();
                adminInstance.saveData();
                adminInstance.showMessage('Data imported successfully!', 'success');
            } catch (error) {
                adminInstance.showMessage('Error importing data: Invalid JSON file', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Download source code as ZIP
async function downloadSourceCode() {
    try {
        // Check if JSZip is available
        if (typeof JSZip === 'undefined') {
            alert('Download library not loaded. Please refresh the page and try again.');
            return;
        }
        
        if (!adminInstance) {
            console.error('Admin instance not found');
            return;
        }
        
        // Save current data first
        adminInstance.saveData();
        
        // Show loading message
        adminInstance.showNotification('Preparing download...', 'info');
        
        const zip = new JSZip();
        const data = adminInstance.getCurrentData();
        
        console.log('Starting download for landing_2 with data:', data);
        
        // Get all the files we need to include
        const filesToInclude = [
            'index.html',
            'styles.css',
            'particles.js',
            'script.js'
        ];
        
        // Add each file to the zip
        for (const fileName of filesToInclude) {
            try {
                const response = await fetch(fileName);
                if (response.ok) {
                    let content = await response.text();
                    
                    // If it's the HTML file, inject the current data
                    if (fileName === 'index.html') {
                        // Remove the portfolio-updater.js script from the downloaded version
                        content = content.replace(/<script src="portfolio-updater\.js"[^>]*><\/script>/g, '');
                        
                        // Inject the current data directly into the HTML
                        content = injectDataIntoHTML(content, data);
                    }
                    
                    zip.file(fileName, content);
                }
            } catch (error) {
                console.error(`Error fetching ${fileName}:`, error);
            }
        }
        
        // Add a README file with instructions
        const readmeContent = `# ${data.personal?.name || 'Your'} Creative Portfolio

This is your customized creative portfolio website generated with Gradfolio.

## Files included:
- index.html - Your main portfolio page
- styles.css - Styling for your portfolio  
- particles.js - Interactive particle effects
- script.js - Interactive functionality

## How to use:
1. Extract all files to a folder
2. Open index.html in a web browser to view your portfolio
3. Upload the files to any web hosting service to make it live

## Customization:
To make changes, edit the content directly in index.html or modify the styles in styles.css

Generated on: ${new Date().toLocaleDateString()}
`;
        
        zip.file('README.md', readmeContent);
        
        console.log('Generating ZIP file for landing_2...');
        // Generate and download the ZIP file
        const zipBlob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: {
                level: 6
            }
        });
        
        console.log(`ZIP file generated, size: ${zipBlob.size} bytes`);
        
        const url = URL.createObjectURL(zipBlob);
        
        const a = document.createElement('a');
        a.href = url;
        const fileName = (data.personal?.name || 'creative-portfolio').replace(/\s+/g, '-').toLowerCase();
        a.download = `${fileName}-portfolio.zip`;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        console.log(`Triggering download of ${fileName}-portfolio.zip`);
        a.click();
        
        // Clean up after a short delay
        setTimeout(() => {
            if (document.body.contains(a)) {
                document.body.removeChild(a);
            }
            URL.revokeObjectURL(url);
        }, 100);
        
        adminInstance.showNotification('Portfolio source code downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('Error downloading source code:', error);
        if (adminInstance) {
            adminInstance.showNotification('Error preparing download. Please try again.', 'error');
        }
    }
}

// Inject current form data directly into HTML for landing_2
function injectDataIntoHTML(htmlContent, data) {
    if (!data || !data.personal) return htmlContent;
    
    // Replace hero content
    if (data.personal.name) {
        htmlContent = htmlContent.replace(/<h1 class="hero-title"[^>]*>.*?<\/h1>/s, 
            `<h1 class="hero-title">${data.personal.name}</h1>`);
    }
    
    if (data.personal.title) {
        htmlContent = htmlContent.replace(/<h2 class="hero-subtitle"[^>]*>.*?<\/h2>/s, 
            `<h2 class="hero-subtitle">${data.personal.title}</h2>`);
    }
    
    if (data.personal.tagline) {
        htmlContent = htmlContent.replace(/<p class="hero-description"[^>]*>.*?<\/p>/s, 
            `<p class="hero-description">${data.personal.tagline}</p>`);
    }
    
    // Replace about section
    if (data.about?.description) {
        const aboutRegex = /<div class="about-text"[^>]*>[\s\S]*?<\/div>/;
        const aboutReplacement = `<div class="about-text">
                        <p>${data.about.description}</p>
                    </div>`;
        htmlContent = htmlContent.replace(aboutRegex, aboutReplacement);
    }
    
    // Replace contact info
    if (data.contact?.email) {
        htmlContent = htmlContent.replace(/creative@email\.com/g, data.contact.email);
    }
    if (data.contact?.phone) {
        htmlContent = htmlContent.replace(/\+1 \(555\) 987-6543/g, data.contact.phone);
    }
    if (data.contact?.location) {
        htmlContent = htmlContent.replace(/New York, NY/g, data.contact.location);
    }
    
    // Replace social links
    if (data.contact?.linkedin) {
        htmlContent = htmlContent.replace(/href="#"([^>]*linkedin)/g, `href="${data.contact.linkedin}" target="_blank"$1`);
    }
    if (data.contact?.github) {
        htmlContent = htmlContent.replace(/href="#"([^>]*github)/g, `href="${data.contact.github}" target="_blank"$1`);
    }
    if (data.contact?.twitter) {
        htmlContent = htmlContent.replace(/href="#"([^>]*twitter)/g, `href="${data.contact.twitter}" target="_blank"$1`);
    }
    if (data.contact?.instagram) {
        htmlContent = htmlContent.replace(/href="#"([^>]*instagram)/g, `href="${data.contact.instagram}" target="_blank"$1`);
    }
    
    return htmlContent;
}

// Save portfolio to server and get unique URL
async function savePortfolioToServer() {
    try {
        // Check if user is authenticated
        const token = localStorage.getItem('gradfolio_token');
        const user = JSON.parse(localStorage.getItem('gradfolio_user') || '{}');
        
        if (!token || !user.username) {
            alert('Please login to save your portfolio. Redirecting to login...');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
            return;
        }
        
        if (!adminInstance) {
            console.error('Admin instance not found');
            return;
        }
        
        // Save current data first
        adminInstance.saveData();
        const portfolioData = adminInstance.getCurrentData();
        
        adminInstance.showNotification('Saving portfolio to server...', 'info');
        
        // Send to server
        const response = await fetch('/.netlify/functions/portfolio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                portfolioData: portfolioData,
                templateType: 'creative'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            adminInstance.showNotification(`Portfolio saved successfully! Your portfolio URL: ${result.portfolioUrl}`, 'success');
            
            // Show the portfolio URL in a modal
            showPortfolioUrlModal(result.portfolioUrl);
        } else {
            adminInstance.showNotification(`Error saving portfolio: ${result.error}`, 'error');
        }
        
    } catch (error) {
        console.error('Error saving portfolio:', error);
        if (adminInstance) {
            adminInstance.showNotification('Error connecting to server. Please try again.', 'error');
        }
    }
}

// Show portfolio URL modal
function showPortfolioUrlModal(url) {
    // Create modal HTML
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        ">
            <div style="
                background: var(--admin-surface);
                padding: 2rem;
                border-radius: 15px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                max-width: 600px;
                width: 90%;
                text-align: center;
                border: 1px solid var(--admin-border);
            ">
                <h2 style="color: var(--admin-success); margin-bottom: 1rem;">
                    <i class="fas fa-check-circle"></i> Portfolio Saved!
                </h2>
                <p style="color: var(--admin-text); margin-bottom: 1.5rem;">
                    Your creative portfolio is now live at:
                </p>
                <div style="
                    background: var(--admin-surface-light);
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    border: 1px solid var(--admin-border);
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                ">
                    <input 
                        type="text" 
                        value="${url}" 
                        readonly 
                        id="portfolio-url-input"
                        style="
                            flex: 1;
                            background: transparent;
                            border: none;
                            color: var(--admin-primary);
                            font-size: 1rem;
                            outline: none;
                        "
                    >
                    <button onclick="copyPortfolioUrl()" style="
                        background: linear-gradient(135deg, var(--gradient-primary));
                        color: white;
                        border: none;
                        padding: 0.5rem 1rem;
                        border-radius: 5px;
                        cursor: pointer;
                    ">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="window.open('${url}', '_blank')" style="
                        background: linear-gradient(135deg, var(--gradient-primary));
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 500;
                    ">
                        <i class="fas fa-eye"></i> View Portfolio
                    </button>
                    <button onclick="closePortfolioUrlModal()" style="
                        background: var(--admin-surface-light);
                        color: var(--admin-text);
                        border: 1px solid var(--admin-border);
                        padding: 0.75rem 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 500;
                    ">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.id = 'portfolio-url-modal';
    document.body.appendChild(modal);
}

// Copy portfolio URL to clipboard
function copyPortfolioUrl() {
    const input = document.getElementById('portfolio-url-input');
    if (input) {
        input.select();
        document.execCommand('copy');
        if (adminInstance) {
            adminInstance.showNotification('Portfolio URL copied to clipboard!', 'success');
        }
    }
}

// Close portfolio URL modal
function closePortfolioUrlModal() {
    const modal = document.getElementById('portfolio-url-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
    adminInstance = new AdvancedPortfolioAdmin();
});