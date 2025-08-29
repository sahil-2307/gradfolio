// Portfolio Data Structure
let portfolioData = {
    personal: {
        fullName: "Alex Johnson",
        designation: "Computer Science Graduate",
        heroDescription: "Passionate about creating innovative solutions through code. Ready to make an impact in the tech industry.",
        profilePhoto: "",
        resumeUrl: ""
    },
    about: {
        paragraph1: "I'm a recent Computer Science graduate with a passion for full-stack development and problem-solving. During my studies, I've worked on various projects that showcase my ability to learn new technologies quickly and deliver quality solutions.",
        paragraph2: "My journey in technology started with curiosity and has evolved into a deep appreciation for clean code, user experience, and innovative solutions. I'm always eager to take on new challenges and contribute to meaningful projects.",
        stats: {
            projects: { number: 15, label: "Projects Completed" },
            gpa: { number: 3.8, label: "GPA" },
            internships: { number: 2, label: "Internships" }
        }
    },
    skills: {
        categories: [
            {
                id: "frontend",
                name: "Frontend",
                icon: "fas fa-laptop-code",
                skills: ["HTML5", "CSS3", "JavaScript", "React", "Vue.js", "TypeScript"]
            },
            {
                id: "backend",
                name: "Backend",
                icon: "fas fa-server",
                skills: ["Node.js", "Python", "Java", "Express.js", "Django", "REST APIs"]
            },
            {
                id: "tools",
                name: "Database & Tools",
                icon: "fas fa-tools",
                skills: ["MySQL", "MongoDB", "Git", "Docker", "AWS", "Linux"]
            }
        ]
    },
    experience: [
        {
            id: "exp1",
            title: "Software Engineering Intern",
            company: "TechCorp Solutions",
            duration: "Jun 2023 - Aug 2023",
            description: "Developed and maintained web applications using React and Node.js. Collaborated with senior developers on feature implementation and code optimization.",
            achievements: [
                "Built responsive user interfaces for 3 client projects",
                "Improved application performance by 25% through code optimization",
                "Participated in agile development processes and daily standups"
            ],
            technologies: ["React", "Node.js", "MongoDB", "Git"]
        },
        {
            id: "exp2",
            title: "Frontend Developer Intern",
            company: "Digital Innovations Ltd",
            duration: "Jan 2023 - Apr 2023",
            description: "Focused on creating modern, responsive web interfaces and improving user experience across multiple platforms.",
            achievements: [
                "Redesigned company landing page resulting in 40% increase in conversions",
                "Implemented mobile-first design principles for better accessibility",
                "Collaborated with UX/UI team to translate designs into functional code"
            ],
            technologies: ["Vue.js", "Sass", "JavaScript", "Figma"]
        }
    ],
    projects: [
        {
            id: "proj1",
            title: "E-Commerce Platform",
            description: "Full-stack e-commerce solution built with React, Node.js, and MongoDB. Features user authentication, payment integration, and admin dashboard.",
            image: "fas fa-shopping-cart",
            technologies: ["React", "Node.js", "MongoDB"],
            githubUrl: "#",
            liveUrl: "#",
            featured: true
        },
        {
            id: "proj2",
            title: "Task Management App",
            description: "Collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
            image: "fas fa-tasks",
            technologies: ["Vue.js", "Socket.io", "Express"],
            githubUrl: "#",
            liveUrl: "#",
            featured: true
        }
    ],
    contact: {
        description: "I'm always interested in new opportunities and collaborations. Feel free to reach out if you'd like to discuss potential projects or just want to connect!",
        methods: {
            email: "alex.johnson@email.com",
            phone: "+1 (555) 123-4567",
            location: "San Francisco, CA"
        },
        socialLinks: [
            { id: "linkedin", name: "LinkedIn", url: "#", icon: "fab fa-linkedin" },
            { id: "github", name: "GitHub", url: "#", icon: "fab fa-github" },
            { id: "twitter", name: "Twitter", url: "#", icon: "fab fa-twitter" }
        ]
    },
    theme: {
        primaryColor: "#00bfa6",
        secondaryColor: "#00acc1",
        accentColor: "#00bfa6",
        backgroundColor: "#121212",
        textColor: "#f5f5f5"
    }
};

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromStorage();
    initializeAdminPanel();
    populateForms();
});

// Load data from localStorage
function loadDataFromStorage() {
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
        portfolioData = { ...portfolioData, ...JSON.parse(savedData) };
    }
}

// Save data to localStorage
function saveDataToStorage() {
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
}

// Initialize Admin Panel
function initializeAdminPanel() {
    // Navigation menu functionality
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.admin-section');

    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            
            // Update active menu item
            menuItems.forEach(mi => mi.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetSection + '-section').classList.add('active');
        });
    });

    // Initialize dynamic sections
    renderSkillCategories();
    renderExperienceList();
    renderProjectsList();
    renderSocialLinks();
}

// Populate forms with existing data
function populateForms() {
    // Personal info
    document.getElementById('full-name').value = portfolioData.personal.fullName;
    document.getElementById('designation').value = portfolioData.personal.designation;
    document.getElementById('hero-description').value = portfolioData.personal.heroDescription;
    document.getElementById('profile-photo-url').value = portfolioData.personal.profilePhoto;
    document.getElementById('resume-url').value = portfolioData.personal.resumeUrl;

    // About info
    document.getElementById('about-paragraph-1').value = portfolioData.about.paragraph1;
    document.getElementById('about-paragraph-2').value = portfolioData.about.paragraph2;
    document.getElementById('stat1-number').value = portfolioData.about.stats.projects.number;
    document.getElementById('stat2-number').value = portfolioData.about.stats.gpa.number;
    document.getElementById('stat3-number').value = portfolioData.about.stats.internships.number;

    // Contact info
    document.getElementById('contact-description').value = portfolioData.contact.description;
    document.getElementById('email').value = portfolioData.contact.methods.email;
    document.getElementById('phone').value = portfolioData.contact.methods.phone;
    document.getElementById('location').value = portfolioData.contact.methods.location;

    // Theme colors
    document.getElementById('primary-color').value = portfolioData.theme.primaryColor;
    document.getElementById('secondary-color').value = portfolioData.theme.secondaryColor;
    document.getElementById('accent-color').value = portfolioData.theme.accentColor;
    document.getElementById('background-color').value = portfolioData.theme.backgroundColor;
    document.getElementById('text-color').value = portfolioData.theme.textColor;

    // Profile photo preview
    const photoUrl = portfolioData.personal.profilePhoto;
    if (photoUrl) {
        showPhotoPreview(photoUrl);
    }

    // Resume preview
    const resumeFileName = portfolioData.personal.resumeFileName;
    if (resumeFileName) {
        showResumePreview(resumeFileName);
    }

    // Photo preview functionality
    document.getElementById('profile-photo-url').addEventListener('input', function(e) {
        const url = e.target.value;
        if (url) {
            showPhotoPreview(url);
        }
    });
}

// Show photo preview
function showPhotoPreview(url) {
    const preview = document.getElementById('photo-preview-img');
    const removeBtn = document.querySelector('.photo-remove');
    preview.src = url;
    preview.style.display = 'block';
    removeBtn.style.display = 'flex';
    preview.onerror = function() {
        this.style.display = 'none';
        removeBtn.style.display = 'none';
    };
}

// Photo upload functions
function triggerPhotoUpload() {
    document.getElementById('profile-photo-file').click();
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        showMessage('Please select an image file', 'error');
        return;
    }

    // Validate file size (max 10MB for better quality)
    if (file.size > 10 * 1024 * 1024) {
        showMessage('File size should be less than 10MB', 'error');
        return;
    }

    // Process image for optimal quality
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Create canvas for image processing
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set optimal size (max 800px for good quality but manageable size)
            const maxSize = 800;
            let { width, height } = img;
            
            if (width > height) {
                if (width > maxSize) {
                    height = (height * maxSize) / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width = (width * maxSize) / height;
                    height = maxSize;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Enable image smoothing for better quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // Draw and compress image
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to high-quality JPEG (0.9 quality)
            const dataURL = canvas.toDataURL('image/jpeg', 0.9);
            
            // Clear URL input when using file upload
            document.getElementById('profile-photo-url').value = '';
            
            // Store the processed data URL
            portfolioData.personal.profilePhoto = dataURL;
            
            // Show preview
            showPhotoPreview(dataURL);
            
            showMessage('Photo uploaded and optimized successfully!', 'success');
        };
        
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

function removePhoto() {
    const preview = document.getElementById('photo-preview-img');
    const removeBtn = document.querySelector('.photo-remove');
    const urlInput = document.getElementById('profile-photo-url');
    const fileInput = document.getElementById('profile-photo-file');
    
    preview.style.display = 'none';
    removeBtn.style.display = 'none';
    urlInput.value = '';
    fileInput.value = '';
    
    portfolioData.personal.profilePhoto = '';
    
    showMessage('Photo removed successfully!', 'success');
}

// Resume upload functions
function triggerResumeUpload() {
    document.getElementById('resume-file').click();
}

function handleResumeUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
        showMessage('Please select a PDF, DOC, or DOCX file', 'error');
        return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showMessage('File size should be less than 10MB', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const dataURL = e.target.result;
        
        // Clear URL input when using file upload
        document.getElementById('resume-url').value = '';
        
        // Store the data URL in portfolio data
        portfolioData.personal.resumeUrl = dataURL;
        portfolioData.personal.resumeFileName = file.name;
        
        // Show preview
        showResumePreview(file.name);
        
        showMessage('Resume uploaded successfully!', 'success');
    };
    
    reader.readAsDataURL(file);
}

function showResumePreview(fileName) {
    const resumeInfo = document.getElementById('resume-info');
    const resumeName = document.getElementById('resume-name');
    
    resumeName.textContent = fileName;
    resumeInfo.style.display = 'flex';
}

function removeResume() {
    const resumeInfo = document.getElementById('resume-info');
    const urlInput = document.getElementById('resume-url');
    const fileInput = document.getElementById('resume-file');
    
    resumeInfo.style.display = 'none';
    urlInput.value = '';
    fileInput.value = '';
    
    portfolioData.personal.resumeUrl = '';
    portfolioData.personal.resumeFileName = '';
    
    showMessage('Resume removed successfully!', 'success');
}

// Save Functions
function savePersonalInfo() {
    const photoUrlInput = document.getElementById('profile-photo-url').value;
    const resumeUrlInput = document.getElementById('resume-url').value;
    
    // Use URL input if provided, otherwise keep existing data (from file upload)
    if (photoUrlInput && photoUrlInput.trim()) {
        portfolioData.personal.profilePhoto = photoUrlInput.trim();
    }
    
    // Handle resume URL input
    if (resumeUrlInput && resumeUrlInput.trim()) {
        portfolioData.personal.resumeUrl = resumeUrlInput.trim();
        portfolioData.personal.resumeFileName = '';
    }
    
    portfolioData.personal.fullName = document.getElementById('full-name').value;
    portfolioData.personal.designation = document.getElementById('designation').value;
    portfolioData.personal.heroDescription = document.getElementById('hero-description').value;
    
    saveDataToStorage();
    showMessage('Personal information saved successfully!', 'success');
}

function saveAboutInfo() {
    portfolioData.about = {
        paragraph1: document.getElementById('about-paragraph-1').value,
        paragraph2: document.getElementById('about-paragraph-2').value,
        stats: {
            projects: { 
                number: parseInt(document.getElementById('stat1-number').value) || 0, 
                label: "Projects Completed" 
            },
            gpa: { 
                number: parseFloat(document.getElementById('stat2-number').value) || 0, 
                label: "GPA" 
            },
            internships: { 
                number: parseInt(document.getElementById('stat3-number').value) || 0, 
                label: "Internships" 
            }
        }
    };
    saveDataToStorage();
    showMessage('About information saved successfully!', 'success');
}

function saveContactInfo() {
    portfolioData.contact.description = document.getElementById('contact-description').value;
    portfolioData.contact.methods = {
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value
    };
    
    // Save social links
    const socialLinksData = [];
    document.querySelectorAll('.social-link-item').forEach(item => {
        const id = item.dataset.id;
        const name = item.querySelector('.social-name').value;
        const url = item.querySelector('.social-url').value;
        const icon = item.querySelector('.social-icon').value;
        if (name && url && icon) {
            socialLinksData.push({ id, name, url, icon });
        }
    });
    portfolioData.contact.socialLinks = socialLinksData;
    
    saveDataToStorage();
    showMessage('Contact information saved successfully!', 'success');
}

// Skills Management
function renderSkillCategories() {
    const container = document.getElementById('skill-categories');
    container.innerHTML = '';

    portfolioData.skills.categories.forEach(category => {
        const categoryElement = createSkillCategoryElement(category);
        container.appendChild(categoryElement);
    });
}

function createSkillCategoryElement(category) {
    const div = document.createElement('div');
    div.className = 'skill-category-item';
    div.dataset.id = category.id;
    
    div.innerHTML = `
        <div class="category-header">
            <h3><i class="${category.icon}"></i> ${category.name}</h3>
            <button type="button" class="btn btn-danger btn-sm" onclick="removeSkillCategory('${category.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="skills-list">
            ${category.skills.map(skill => `
                <div class="skill-item">
                    <input type="text" value="${skill}" onchange="updateSkill('${category.id}', this)">
                    <button type="button" class="btn btn-danger btn-xs" onclick="removeSkill('${category.id}', this)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('')}
            <button type="button" class="btn btn-secondary btn-sm" onclick="addSkill('${category.id}')">
                <i class="fas fa-plus"></i> Add Skill
            </button>
        </div>
    `;
    
    return div;
}

function addSkillCategory() {
    const name = document.getElementById('category-name').value;
    const icon = document.getElementById('category-icon').value;
    
    if (!name || !icon) {
        showMessage('Please fill in both category name and icon', 'error');
        return;
    }
    
    const id = name.toLowerCase().replace(/\s+/g, '-');
    const newCategory = { id, name, icon, skills: [] };
    
    portfolioData.skills.categories.push(newCategory);
    renderSkillCategories();
    
    // Clear form
    document.getElementById('category-name').value = '';
    document.getElementById('category-icon').value = '';
    
    showMessage('Category added successfully!', 'success');
}

function removeSkillCategory(categoryId) {
    if (confirm('Are you sure you want to remove this category?')) {
        portfolioData.skills.categories = portfolioData.skills.categories.filter(cat => cat.id !== categoryId);
        renderSkillCategories();
        showMessage('Category removed successfully!', 'success');
    }
}

function addSkill(categoryId) {
    const category = portfolioData.skills.categories.find(cat => cat.id === categoryId);
    if (category) {
        category.skills.push('New Skill');
        renderSkillCategories();
    }
}

function removeSkill(categoryId, button) {
    const skillItem = button.closest('.skill-item');
    const skillIndex = Array.from(skillItem.parentNode.querySelectorAll('.skill-item')).indexOf(skillItem);
    
    const category = portfolioData.skills.categories.find(cat => cat.id === categoryId);
    if (category) {
        category.skills.splice(skillIndex, 1);
        renderSkillCategories();
    }
}

function updateSkill(categoryId, input) {
    const skillItem = input.closest('.skill-item');
    const skillIndex = Array.from(skillItem.parentNode.querySelectorAll('.skill-item')).indexOf(skillItem);
    
    const category = portfolioData.skills.categories.find(cat => cat.id === categoryId);
    if (category) {
        category.skills[skillIndex] = input.value;
    }
}

function saveSkills() {
    saveDataToStorage();
    showMessage('Skills saved successfully!', 'success');
}

// Experience Management
function renderExperienceList() {
    const container = document.getElementById('experience-list');
    container.innerHTML = '';

    portfolioData.experience.forEach((exp, index) => {
        const expElement = createExperienceElement(exp, index);
        container.appendChild(expElement);
    });
}

function createExperienceElement(experience, index) {
    const div = document.createElement('div');
    div.className = 'experience-item';
    div.dataset.index = index;
    
    div.innerHTML = `
        <div class="experience-form">
            <div class="form-row">
                <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" class="exp-title" value="${experience.title}">
                </div>
                <div class="form-group">
                    <label>Company</label>
                    <input type="text" class="exp-company" value="${experience.company}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Duration</label>
                    <input type="text" class="exp-duration" value="${experience.duration}">
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="exp-description" rows="3">${experience.description}</textarea>
            </div>
            <div class="form-group">
                <label>Achievements (one per line)</label>
                <textarea class="exp-achievements" rows="4">${experience.achievements.join('\n')}</textarea>
            </div>
            <div class="form-group">
                <label>Technologies (comma separated)</label>
                <input type="text" class="exp-technologies" value="${experience.technologies.join(', ')}">
            </div>
            <div class="item-actions">
                <button type="button" class="btn btn-danger" onclick="removeExperience(${index})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `;
    
    return div;
}

function addExperienceEntry() {
    const newExperience = {
        id: 'exp' + Date.now(),
        title: '',
        company: '',
        duration: '',
        description: '',
        achievements: [],
        technologies: []
    };
    
    portfolioData.experience.push(newExperience);
    renderExperienceList();
}

function removeExperience(index) {
    if (confirm('Are you sure you want to remove this experience?')) {
        portfolioData.experience.splice(index, 1);
        renderExperienceList();
    }
}

function saveExperience() {
    document.querySelectorAll('.experience-item').forEach((item, index) => {
        const exp = portfolioData.experience[index];
        exp.title = item.querySelector('.exp-title').value;
        exp.company = item.querySelector('.exp-company').value;
        exp.duration = item.querySelector('.exp-duration').value;
        exp.description = item.querySelector('.exp-description').value;
        exp.achievements = item.querySelector('.exp-achievements').value.split('\n').filter(a => a.trim());
        exp.technologies = item.querySelector('.exp-technologies').value.split(',').map(t => t.trim()).filter(t => t);
    });
    
    saveDataToStorage();
    showMessage('Experience saved successfully!', 'success');
}

// Projects Management
function renderProjectsList() {
    const container = document.getElementById('projects-list');
    container.innerHTML = '';

    portfolioData.projects.forEach((project, index) => {
        const projectElement = createProjectElement(project, index);
        container.appendChild(projectElement);
    });
}

function createProjectElement(project, index) {
    const div = document.createElement('div');
    div.className = 'project-item';
    div.dataset.index = index;
    
    div.innerHTML = `
        <div class="project-form">
            <div class="form-row">
                <div class="form-group">
                    <label>Project Title</label>
                    <input type="text" class="proj-title" value="${project.title}">
                </div>
                <div class="form-group">
                    <label>Icon Class</label>
                    <input type="text" class="proj-image" value="${project.image}" placeholder="fas fa-code">
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="proj-description" rows="3">${project.description}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Technologies (comma separated)</label>
                    <input type="text" class="proj-technologies" value="${project.technologies.join(', ')}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>GitHub URL</label>
                    <input type="url" class="proj-github" value="${project.githubUrl}">
                </div>
                <div class="form-group">
                    <label>Live Demo URL</label>
                    <input type="url" class="proj-live" value="${project.liveUrl}">
                </div>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" class="proj-featured" ${project.featured ? 'checked' : ''}>
                    Featured Project
                </label>
            </div>
            <div class="item-actions">
                <button type="button" class="btn btn-danger" onclick="removeProject(${index})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `;
    
    return div;
}

function addProjectEntry() {
    const newProject = {
        id: 'proj' + Date.now(),
        title: '',
        description: '',
        image: 'fas fa-code',
        technologies: [],
        githubUrl: '',
        liveUrl: '',
        featured: false
    };
    
    portfolioData.projects.push(newProject);
    renderProjectsList();
}

function removeProject(index) {
    if (confirm('Are you sure you want to remove this project?')) {
        portfolioData.projects.splice(index, 1);
        renderProjectsList();
    }
}

function saveProjects() {
    document.querySelectorAll('.project-item').forEach((item, index) => {
        const proj = portfolioData.projects[index];
        proj.title = item.querySelector('.proj-title').value;
        proj.description = item.querySelector('.proj-description').value;
        proj.image = item.querySelector('.proj-image').value;
        proj.technologies = item.querySelector('.proj-technologies').value.split(',').map(t => t.trim()).filter(t => t);
        proj.githubUrl = item.querySelector('.proj-github').value;
        proj.liveUrl = item.querySelector('.proj-live').value;
        proj.featured = item.querySelector('.proj-featured').checked;
    });
    
    saveDataToStorage();
    showMessage('Projects saved successfully!', 'success');
}

// Social Links Management
function renderSocialLinks() {
    const container = document.getElementById('social-links-container');
    container.innerHTML = '';

    portfolioData.contact.socialLinks.forEach((link, index) => {
        const linkElement = createSocialLinkElement(link, index);
        container.appendChild(linkElement);
    });
}

function createSocialLinkElement(link, index) {
    const div = document.createElement('div');
    div.className = 'social-link-item';
    div.dataset.id = link.id;
    
    div.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Platform Name</label>
                <input type="text" class="social-name" value="${link.name}">
            </div>
            <div class="form-group">
                <label>URL</label>
                <input type="url" class="social-url" value="${link.url}">
            </div>
            <div class="form-group">
                <label>Icon Class</label>
                <input type="text" class="social-icon" value="${link.icon}">
            </div>
            <div class="form-group">
                <button type="button" class="btn btn-danger btn-sm" onclick="removeSocialLink(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    return div;
}

function addSocialLink() {
    const newLink = {
        id: 'social' + Date.now(),
        name: '',
        url: '',
        icon: 'fab fa-link'
    };
    
    portfolioData.contact.socialLinks.push(newLink);
    renderSocialLinks();
}

function removeSocialLink(index) {
    portfolioData.contact.socialLinks.splice(index, 1);
    renderSocialLinks();
}

// Theme Management
function saveTheme() {
    portfolioData.theme = {
        primaryColor: document.getElementById('primary-color').value,
        secondaryColor: document.getElementById('secondary-color').value,
        accentColor: document.getElementById('accent-color').value,
        backgroundColor: document.getElementById('background-color').value,
        textColor: document.getElementById('text-color').value
    };
    
    saveDataToStorage();
    showMessage('Theme saved successfully!', 'success');
}

function applyThemePreset(preset) {
    const presets = {
        teal: {
            primaryColor: "#00bfa6",
            secondaryColor: "#00acc1",
            accentColor: "#00bfa6",
            backgroundColor: "#121212",
            textColor: "#f5f5f5"
        },
        blue: {
            primaryColor: "#2196f3",
            secondaryColor: "#1976d2",
            accentColor: "#03a9f4",
            backgroundColor: "#121212",
            textColor: "#f5f5f5"
        },
        purple: {
            primaryColor: "#9c27b0",
            secondaryColor: "#7b1fa2",
            accentColor: "#e91e63",
            backgroundColor: "#121212",
            textColor: "#f5f5f5"
        },
        green: {
            primaryColor: "#4caf50",
            secondaryColor: "#388e3c",
            accentColor: "#8bc34a",
            backgroundColor: "#121212",
            textColor: "#f5f5f5"
        }
    };
    
    const themeData = presets[preset];
    if (themeData) {
        Object.entries(themeData).forEach(([key, value]) => {
            const inputId = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            document.getElementById(inputId).value = value;
        });
    }
}

// Utility Functions
function showMessage(message, type = 'info') {
    const container = document.getElementById('message-container');
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    
    container.appendChild(messageEl);
    
    setTimeout(() => {
        messageEl.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        messageEl.classList.remove('show');
        setTimeout(() => {
            container.removeChild(messageEl);
        }, 300);
    }, 3000);
}

function exportData() {
    const dataStr = JSON.stringify(portfolioData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'portfolio-data.json';
    link.click();
    
    showMessage('Data exported successfully!', 'success');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            portfolioData = { ...portfolioData, ...importedData };
            saveDataToStorage();
            populateForms();
            renderSkillCategories();
            renderExperienceList();
            renderProjectsList();
            renderSocialLinks();
            showMessage('Data imported successfully!', 'success');
        } catch (error) {
            showMessage('Invalid JSON file', 'error');
        }
    };
    reader.readAsText(file);
}

function previewPortfolio() {
    // Apply current data and open preview
    updatePortfolioPage();
    window.open('index.html', '_blank');
}

// Update the main portfolio page with current data
function updatePortfolioPage() {
    saveDataToStorage();
    // The main portfolio page will read from localStorage on load
}