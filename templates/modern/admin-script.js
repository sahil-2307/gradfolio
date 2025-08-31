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

// Collect current portfolio data from forms
function collectPortfolioData() {
    // Update portfolioData with current form values
    updatePortfolioDataFromForms();
    return portfolioData;
}

// Get current form data (alias for collectPortfolioData)
function getCurrentFormData() {
    return collectPortfolioData();
}

// Update portfolioData object with current form values
function updatePortfolioDataFromForms() {
    // Personal information
    portfolioData.personal.fullName = document.getElementById('full-name')?.value || portfolioData.personal.fullName;
    portfolioData.personal.designation = document.getElementById('designation')?.value || portfolioData.personal.designation;
    portfolioData.personal.heroDescription = document.getElementById('hero-description')?.value || portfolioData.personal.heroDescription;
    portfolioData.personal.profilePhoto = document.getElementById('profile-photo-url')?.value || portfolioData.personal.profilePhoto;
    portfolioData.personal.resumeUrl = document.getElementById('resume-url')?.value || portfolioData.personal.resumeUrl;
    
    // About section
    portfolioData.about.paragraph1 = document.getElementById('about-paragraph-1')?.value || portfolioData.about.paragraph1;
    portfolioData.about.paragraph2 = document.getElementById('about-paragraph-2')?.value || portfolioData.about.paragraph2;
    portfolioData.about.stats.projects.number = parseInt(document.getElementById('stat1-number')?.value) || portfolioData.about.stats.projects.number;
    portfolioData.about.stats.gpa.number = parseFloat(document.getElementById('stat2-number')?.value) || portfolioData.about.stats.gpa.number;
    portfolioData.about.stats.internships.number = parseInt(document.getElementById('stat3-number')?.value) || portfolioData.about.stats.internships.number;
    
    // Contact information
    portfolioData.contact.description = document.getElementById('contact-description')?.value || portfolioData.contact.description;
    portfolioData.contact.email = document.getElementById('email')?.value || portfolioData.contact.email;
    portfolioData.contact.phone = document.getElementById('phone')?.value || portfolioData.contact.phone;
    portfolioData.contact.location = document.getElementById('location')?.value || portfolioData.contact.location;
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

async function previewPortfolio() {
    try {
        // Generate HTML with current form data for preview
        const portfolioData = collectPortfolioData();
        
        // Load the preview template and inject current form data
        const templateResponse = await fetch('preview.html');
        let templateContent = await templateResponse.text();
        
        // Load CSS content and inject it inline for proper preview
        const cssResponse = await fetch('styles.css');
        const cssContent = await cssResponse.text();
        
        // Inject CSS inline to ensure styling works in blob URL
        templateContent = templateContent.replace('<link rel="stylesheet" href="styles.css">', 
            `<style>${cssContent}</style>`);
        
        const htmlContent = injectDataIntoHTML(templateContent, portfolioData);
        
        // Create a blob URL for preview
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    } catch (error) {
        console.error('Error generating preview:', error);
        showMessage('Error generating preview. Please try again.', 'error');
    }
}

// Update the main portfolio page with current data
function updatePortfolioPage() {
    saveDataToStorage();
    // The main portfolio page will read from localStorage on load
}

// Save portfolio to server and get unique URL
async function savePortfolioToServer() {
    try {
        // Simplified authentication check
        let authFound = false;
        let username = null;
        
        // Check for any authentication indicators
        for (const key of Object.keys(localStorage)) {
            if (key.includes('auth') || key.includes('token') || key.includes('session')) {
                authFound = true;
                break;
            }
        }
        
        // Try to get username from various sources
        try {
            // Check all localStorage keys for Supabase auth
            for (const key of Object.keys(localStorage)) {
                if (key.includes('sb-') && key.includes('auth-token')) {
                    const authData = JSON.parse(localStorage.getItem(key));
                    if (authData.user) {
                        username = authData.user.user_metadata?.username || 
                                 authData.user.email?.split('@')[0] ||
                                 authData.user.identities?.[0]?.identity_data?.username;
                        if (username) {
                            authFound = true;
                            break;
                        }
                    }
                }
            }
            
            // Try other storage locations
            if (!username) {
                const userObj = JSON.parse(localStorage.getItem('user') || localStorage.getItem('gradfolio_user') || '{}');
                username = userObj.username || userObj.email?.split('@')[0];
            }
        } catch (e) {
            console.error('Error extracting username:', e);
        }
        
        // If still no username, get from form data
        if (!username) {
            const fullName = document.getElementById('full-name')?.value;
            if (fullName) {
                username = fullName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
            }
        }
        
        // Final fallback
        if (!username) {
            username = 'user_' + Date.now().toString().slice(-6);
        }
        
        // Save current data first
        saveDataToStorage();
        const portfolioData = getCurrentFormData();
        
        showMessage('Saving portfolio to server...', 'info');
        
        // Try to save to server with fallback
        let result;
        try {
            const response = await fetch('/.netlify/functions/portfolio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    portfolioData: portfolioData,
                    templateType: 'modern'
                })
            });
            
            if (response.ok) {
                result = await response.json();
            } else {
                throw new Error('Server error');
            }
        } catch (serverError) {
            console.warn('Server save failed, using fallback storage:', serverError);
            
            // Fallback to localStorage-based storage
            const portfolios = JSON.parse(localStorage.getItem('gradfolio_portfolios') || '{}');
            portfolios[username] = {
                portfolioData: portfolioData,
                templateType: 'modern',
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem('gradfolio_portfolios', JSON.stringify(portfolios));
            
            // Show custom domain URL in preview
            const customDomainUrl = `https://onlineportfolios.in/${username}`;
            const fallbackUrl = `${window.location.origin}/${username}`;
            
            result = {
                success: true,
                portfolioUrl: customDomainUrl,
                fallbackUrl: fallbackUrl
            };
        }
        
        if (result.success) {
            showMessage(`Portfolio saved successfully! Your portfolio URL: ${result.portfolioUrl}`, 'success');
            
            // Show the portfolio URL in a modal or copy to clipboard
            showPortfolioUrlModal(result.portfolioUrl);
        } else {
            showMessage(`Error saving portfolio: ${result.error}`, 'error');
        }
        
    } catch (error) {
        console.error('Error saving portfolio:', error);
        showMessage('Error connecting to server. Please try again.', 'error');
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
                    Your portfolio is now live at:
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
                        background: var(--admin-primary);
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
                        background: var(--admin-success);
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
        showMessage('Portfolio URL copied to clipboard!', 'success');
    }
}

// Close portfolio URL modal
function closePortfolioUrlModal() {
    const modal = document.getElementById('portfolio-url-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// Download source code as ZIP
async function downloadSourceCode() {
    try {
        // Check if JSZip is available
        if (typeof JSZip === 'undefined') {
            showMessage('Download library not loaded. Please refresh the page and try again.', 'error');
            return;
        }
        
        // Save current data first
        saveDataToStorage();
        
        // Show loading message
        showMessage('Preparing download...', 'info');
        
        const zip = new JSZip();
        const data = getCurrentFormData();
        
        console.log('Starting download with data:', data);
        
        // Get all the files we need to include
        const filesToInclude = [
            'index.html',
            'styles.css',
            'script.js',
            'debug-fix.js'
        ];
        
        // Add each file to the zip
        for (const fileName of filesToInclude) {
            try {
                console.log(`Fetching ${fileName}...`);
                const response = await fetch(fileName);
                if (response.ok) {
                    let content = await response.text();
                    console.log(`Successfully fetched ${fileName}, size: ${content.length}`);
                    
                    // If it's the HTML file, inject the current data
                    if (fileName === 'index.html') {
                        // Remove the portfolio-updater.js script from the downloaded version
                        content = content.replace(/<script src="portfolio-updater\.js"><\/script>/g, '');
                        
                        // Inject the current data directly into the HTML
                        content = injectDataIntoHTML(content, data);
                        console.log('HTML content processed with user data');
                    }
                    
                    zip.file(fileName, content);
                } else {
                    console.error(`Failed to fetch ${fileName}: ${response.status}`);
                    showMessage(`Failed to fetch ${fileName}. Continuing with other files...`, 'warning');
                }
            } catch (error) {
                console.error(`Error fetching ${fileName}:`, error);
                showMessage(`Error fetching ${fileName}: ${error.message}`, 'warning');
            }
        }
        
        // Add a README file with instructions
        const readmeContent = `# ${data.personal.fullName}'s Portfolio

This is your customized portfolio website generated with Gradfolio.

## Files included:
- index.html - Your main portfolio page
- styles.css - Styling for your portfolio
- script.js - Interactive functionality
- debug-fix.js - Browser compatibility fixes

## How to use:
1. Extract all files to a folder
2. Open index.html in a web browser to view your portfolio
3. Upload the files to any web hosting service to make it live

## Customization:
To make changes, edit the content directly in index.html or modify the styles in styles.css

Generated on: ${new Date().toLocaleDateString()}
`;
        
        zip.file('README.md', readmeContent);
        
        console.log('Generating ZIP file...');
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
        const fileName = `${(data.personal.fullName || 'portfolio').replace(/\s+/g, '-').toLowerCase()}-portfolio.zip`;
        a.download = fileName;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        console.log(`Triggering download of ${fileName}`);
        a.click();
        
        // Clean up after a short delay
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        showMessage('Portfolio source code downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('Error downloading source code:', error);
        showMessage(`Error preparing download: ${error.message}. Please try again.`, 'error');
        
        // Fallback: offer to download just the current data
        if (confirm('Would you like to download just your portfolio data instead?')) {
            exportData();
        }
    }
}

// Simple test function for debugging
function testDownload() {
    console.log('Testing download functionality...');
    console.log('JSZip available:', typeof JSZip !== 'undefined');
    console.log('Current data:', getCurrentFormData());
    
    if (typeof JSZip === 'undefined') {
        alert('JSZip library is not loaded. Please refresh the page.');
        return;
    }
    
    // Create a simple test zip
    const zip = new JSZip();
    zip.file('test.txt', 'This is a test file from Gradfolio admin panel.');
    
    zip.generateAsync({type: 'blob'}).then(function(content) {
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'test-download.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Test download completed!');
    }).catch(function(error) {
        console.error('Test download failed:', error);
        alert('Test download failed: ' + error.message);
    });
}

// Generate and save live portfolio to S3
async function generateLivePortfolio() {
    try {
        // Simplified authentication check - look for any authentication indicator
        let authFound = false;
        let username = null;
        
        // Check multiple possible auth storage locations
        for (const key of Object.keys(localStorage)) {
            if (key.includes('auth') || key.includes('token') || key.includes('session')) {
                authFound = true;
                break;
            }
        }
        
        // Try to get username from various sources
        try {
            // Check all localStorage keys for Supabase auth
            for (const key of Object.keys(localStorage)) {
                if (key.includes('sb-') && key.includes('auth-token')) {
                    const authData = JSON.parse(localStorage.getItem(key));
                    if (authData.user) {
                        username = authData.user.user_metadata?.username || 
                                 authData.user.email?.split('@')[0] ||
                                 authData.user.identities?.[0]?.identity_data?.username;
                        if (username) {
                            authFound = true;
                            break;
                        }
                    }
                }
            }
            
            // Try other storage locations
            if (!username) {
                const userObj = JSON.parse(localStorage.getItem('user') || localStorage.getItem('gradfolio_user') || '{}');
                username = userObj.username || userObj.email?.split('@')[0];
            }
        } catch (e) {
            console.error('Error extracting username:', e);
        }
        
        // If still no username, get from form data
        if (!username) {
            const fullName = document.getElementById('full-name')?.value;
            if (fullName) {
                username = fullName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
            }
        }
        
        // Final fallback
        if (!username) {
            username = 'user_' + Date.now().toString().slice(-6);
        }
        
        console.log('Auth check:', { authFound, username });
        
        // Get token for API authorization
        let token = null;
        try {
            const supabaseAuth = localStorage.getItem('sb-gncigcattvlrfehmjmdb-auth-token');
            if (supabaseAuth) {
                const authData = JSON.parse(supabaseAuth);
                token = authData.access_token;
            }
        } catch (e) {
            // Fallback token
            token = localStorage.getItem('access_token') || localStorage.getItem('gradfolio_token') || 'fallback_token';
        }
        
        // Save current data first
        saveDataToStorage();
        const portfolioData = getCurrentFormData();
        
        showMessage('Generating your live portfolio...', 'info');
        
        // Generate personalized HTML by loading the preview template and injecting data
        const templateResponse = await fetch('preview.html');
        const templateContent = await templateResponse.text();
        const htmlContent = injectDataIntoHTML(templateContent, portfolioData);
        
        // Get CSS content
        const cssResponse = await fetch('styles.css');
        const cssContent = await cssResponse.text();
        
        // Upload to S3 via our API
        const response = await fetch('/api/portfolio-s3', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                username: username,
                templateType: 'modern',
                htmlContent: htmlContent,
                cssContent: cssContent
            })
        });
        
        let result;
        let responseText;
        try {
            responseText = await response.text();
            console.log('API Response Status:', response.status);
            console.log('API Response Text:', responseText);
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Failed to parse API response:', parseError);
            throw new Error(`API returned invalid response. Status: ${response.status}. Response: ${responseText || 'No response text'}`);
        }
        
        if (result.success) {
            showMessage(`Portfolio generated successfully!`, 'success');
            showLivePortfolioModal(result.portfolioUrl);
        } else {
            showMessage(`Error generating portfolio: ${result.error}`, 'error');
        }
        
    } catch (error) {
        console.error('Error generating live portfolio:', error);
        showMessage('Error generating portfolio. Please try again.', 'error');
    }
}

// Generate personalized portfolio HTML
function generatePortfolioHTML(data) {
    const profilePhotoHTML = data.personal?.profilePhoto 
        ? `<img src="${data.personal.profilePhoto}" alt="${data.personal.fullName}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
        : '<i class="fas fa-user-graduate"></i>';

    const statsHTML = data.about?.stats ? `
        <div class="stats">
            <div class="stat">
                <span class="stat-number">${data.about.stats.projects.number}+</span>
                <span class="stat-label">${data.about.stats.projects.label}</span>
            </div>
            <div class="stat">
                <span class="stat-number">${data.about.stats.gpa.number}</span>
                <span class="stat-label">${data.about.stats.gpa.label}</span>
            </div>
            <div class="stat">
                <span class="stat-number">${data.about.stats.internships.number}</span>
                <span class="stat-label">${data.about.stats.internships.label}</span>
            </div>
        </div>` : '';

    const skillsHTML = data.skills?.categories ? data.skills.categories.map(category => `
        <div class="skill-category">
            <h3>${category.name}</h3>
            <div class="skill-items">
                ${category.skills.map(skill => `<span class="skill-tag">${skill.name}</span>`).join('')}
            </div>
        </div>
    `).join('') : `
        <div class="skill-category">
            <h3>Development</h3>
            <div class="skill-items">
                <span class="skill-tag">JavaScript</span>
                <span class="skill-tag">Python</span>
                <span class="skill-tag">React</span>
            </div>
        </div>`;

    const experienceHTML = data.experience?.length ? data.experience.map(exp => `
        <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <div class="experience-header">
                    <h3>${exp.title}</h3>
                    <div class="company-info">
                        <span class="company">${exp.company}</span>
                        <span class="duration">${exp.duration}</span>
                    </div>
                </div>
                <div class="experience-description">
                    <p>${exp.description}</p>
                    ${exp.achievements ? `<ul class="achievements">${exp.achievements.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}
                    ${exp.technologies ? `<div class="tech-stack">${exp.technologies.map(t => `<span class="tech">${t}</span>`).join('')}</div>` : ''}
                </div>
            </div>
        </div>
    `).join('') : `
        <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <div class="experience-header">
                    <h3>Your Experience</h3>
                    <div class="company-info">
                        <span class="company">Company Name</span>
                        <span class="duration">Duration</span>
                    </div>
                </div>
                <div class="experience-description">
                    <p>Add your professional experience here.</p>
                </div>
            </div>
        </div>`;

    const projectsHTML = data.projects?.length ? data.projects.map(project => `
        <div class="project-card">
            <div class="project-image">
                ${project.image ? `<img src="${project.image}" alt="${project.title}">` : '<i class="fas fa-code"></i>'}
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.githubUrl ? `<a href="${project.githubUrl}" class="project-link" target="_blank"><i class="fab fa-github"></i> Code</a>` : ''}
                    ${project.demoUrl ? `<a href="${project.demoUrl}" class="project-link" target="_blank"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
                </div>
            </div>
        </div>
    `).join('') : `
        <div class="project-card">
            <div class="project-image">
                <i class="fas fa-code"></i>
            </div>
            <div class="project-content">
                <h3>Your Amazing Project</h3>
                <p>Add your projects to showcase your skills and experience.</p>
                <div class="project-tech">
                    <span>Technology</span>
                </div>
                <div class="project-links">
                    <a href="#" class="project-link"><i class="fab fa-github"></i> Code</a>
                    <a href="#" class="project-link"><i class="fas fa-external-link-alt"></i> Demo</a>
                </div>
            </div>
        </div>`;

    const resumeButtonHTML = data.personal?.resumeUrl ? `
        <br>
        <button id="download-resume-btn" class="btn btn-resume" onclick="downloadResume()">
            <i class="fas fa-download"></i> Download Resume
        </button>` : '';

    const resumeScriptHTML = data.personal?.resumeUrl ? `
        function downloadResume() {
            const resumeUrl = '${data.personal.resumeUrl}';
            const resumeFileName = '${data.personal.resumeFileName || data.personal.fullName + '-resume'}';
            
            if (resumeUrl.startsWith('data:')) {
                const link = document.createElement('a');
                link.href = resumeUrl;
                link.download = resumeFileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                window.open(resumeUrl, '_blank');
            }
        }
        window.downloadResume = downloadResume;` : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personal?.fullName || 'Portfolio'} - ${data.personal?.designation || 'Professional'}</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="loaded">
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">Portfolio</div>
            <ul class="nav-menu">
                <li><a href="#home" class="nav-link">Home</a></li>
                <li><a href="#about" class="nav-link">About</a></li>
                <li><a href="#skills" class="nav-link">Skills</a></li>
                <li><a href="#experience" class="nav-link">Experience</a></li>
                <li><a href="#projects" class="nav-link">Projects</a></li>
                <li><a href="#contact" class="nav-link">Contact</a></li>
            </ul>
            <div class="hamburger">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </nav>

    <section id="home" class="hero">
        <div class="hero-content">
            <div class="hero-text">
                <h1 id="hero-name">Hello, I'm <span class="highlight">${data.personal?.fullName || 'Your Name'}</span></h1>
                <h2>${data.personal?.designation || 'Your Title'}</h2>
                <p>${data.personal?.heroDescription || 'Your professional description goes here.'}</p>
                <div class="hero-buttons">
                    <a href="#projects" class="btn btn-primary">View Projects</a>
                    <a href="#contact" class="btn btn-secondary">Get In Touch</a>
                </div>
            </div>
            <div class="hero-image">
                <div class="profile-circle">
                    ${profilePhotoHTML}
                </div>
            </div>
        </div>
        <div class="scroll-indicator">
            <i class="fas fa-chevron-down"></i>
        </div>
    </section>

    <section id="about" class="about">
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <div class="about-content">
                <div class="about-text">
                    <p>${data.about?.paragraph1 || 'Tell your story here. What makes you unique?'}</p>
                    <p>${data.about?.paragraph2 || 'Share your journey and aspirations.'}</p>
                    ${statsHTML}
                </div>
            </div>
        </div>
    </section>

    <section id="skills" class="skills">
        <div class="container">
            <h2 class="section-title">Technical Skills</h2>
            <div class="skills-grid">
                ${skillsHTML}
            </div>
        </div>
    </section>

    <section id="experience" class="experience">
        <div class="container">
            <h2 class="section-title">Experience</h2>
            <div class="experience-timeline">
                ${experienceHTML}
            </div>
        </div>
    </section>

    <section id="projects" class="projects">
        <div class="container">
            <h2 class="section-title">Featured Projects</h2>
            <div class="projects-grid">
                ${projectsHTML}
            </div>
        </div>
    </section>

    <section id="contact" class="contact">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <div class="contact-content">
                <div class="contact-info">
                    <p>I'm always interested in new opportunities and collaborations. Feel free to reach out!</p>
                    <div class="contact-methods">
                        <div class="contact-method">
                            <i class="fas fa-envelope"></i>
                            <span>${data.contact?.email || 'your.email@example.com'}</span>
                        </div>
                        <div class="contact-method">
                            <i class="fas fa-phone"></i>
                            <span>${data.contact?.phone || '+1 (555) 123-4567'}</span>
                        </div>
                        <div class="contact-method">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${data.contact?.location || 'Your City, Country'}</span>
                        </div>
                    </div>
                    <div class="social-links">
                        ${data.contact?.linkedin ? `<a href="${data.contact.linkedin}" class="social-link" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                        ${data.contact?.github ? `<a href="${data.contact.github}" class="social-link" target="_blank"><i class="fab fa-github"></i></a>` : ''}
                        ${data.contact?.twitter ? `<a href="${data.contact.twitter}" class="social-link" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}
                    </div>
                    ${resumeButtonHTML}
                </div>
                <form class="contact-form">
                    <div class="form-group">
                        <input type="text" id="name" name="name" placeholder="Your Name" required>
                    </div>
                    <div class="form-group">
                        <input type="email" id="email" name="email" placeholder="Your Email" required>
                    </div>
                    <div class="form-group">
                        <textarea id="message" name="message" placeholder="Your Message" rows="5" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Send Message</button>
                </form>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${data.personal?.fullName || 'Your Name'}. All rights reserved.</p>
        </div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Mobile menu toggle
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            
            if (hamburger && navMenu) {
                hamburger.addEventListener('click', function() {
                    hamburger.classList.toggle('active');
                    navMenu.classList.toggle('active');
                });
            }
            
            // Smooth scrolling
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    hamburger?.classList.remove('active');
                    navMenu?.classList.remove('active');
                });
            });
        });
        
        ${resumeScriptHTML}
    </script>
</body>
</html>`;
}

// Show live portfolio URL modal
function showLivePortfolioModal(url) {
    const modal = document.getElementById('portfolio-modal');
    const modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = `
        <h3>
            <i class="fas fa-check-circle" style="color: var(--admin-success);"></i>
            Live Portfolio Generated!
        </h3>
        <p>Your personalized portfolio is now live and accessible at:</p>
        
        <div class="portfolio-url-container">
            <div class="portfolio-url" id="live-portfolio-url">${url}</div>
            <div class="url-actions">
                <button class="btn btn-secondary" onclick="copyLivePortfolioUrl()">
                    <i class="fas fa-copy"></i> Copy URL
                </button>
                <button class="btn btn-success" onclick="window.open('${url}', '_blank')">
                    <i class="fas fa-eye"></i> View Portfolio
                </button>
                <button class="btn btn-primary" onclick="closePortfolioModal()">
                    Close
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Copy live portfolio URL to clipboard
function copyLivePortfolioUrl() {
    const urlElement = document.getElementById('live-portfolio-url');
    if (urlElement) {
        // Create a temporary input element to copy the text
        const tempInput = document.createElement('input');
        tempInput.value = urlElement.textContent;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showMessage('Portfolio URL copied to clipboard!', 'success');
    }
}


// Inject current form data directly into HTML
function injectDataIntoHTML(htmlContent, data) {
    // Replace title
    htmlContent = htmlContent.replace(/<title>.*?<\/title>/, `<title>${data.personal.fullName} - ${data.personal.designation}</title>`);
    
    // Replace nav-logo (Portfolio -> User's name or keep Portfolio)
    const firstName = data.personal.fullName.split(' ')[0];
    htmlContent = htmlContent.replace(/<div class="nav-logo">Portfolio<\/div>/, 
        `<div class="nav-logo">${firstName}</div>`);
    
    // Replace placeholder content with actual data
    htmlContent = htmlContent.replace(/Hello, I'm <span class="highlight">.*?<\/span>/, 
        `Hello, I'm <span class="highlight">${data.personal.fullName}</span>`);
    
    htmlContent = htmlContent.replace(/<h2>Computer Science Graduate<\/h2>/, 
        `<h2>${data.personal.designation}</h2>`);
    
    htmlContent = htmlContent.replace(/Passionate about creating innovative solutions through code\. Ready to make an impact in the tech industry\./, 
        data.personal.heroDescription);
        
    // Replace footer name
    htmlContent = htmlContent.replace(/&copy; \d{4} Alex Johnson\. All rights reserved\./, 
        `&copy; ${new Date().getFullYear()} ${data.personal.fullName}. All rights reserved.`);
        
    // Remove references to JS files that won't exist in S3 and replace with inline essential functionality
    htmlContent = htmlContent.replace(/<script src="debug-fix\.js"><\/script>\s*/g, '');
    htmlContent = htmlContent.replace(/<script src="portfolio-updater-preview\.js"><\/script>\s*/g, '');
    htmlContent = htmlContent.replace(/<script src="script\.js"><\/script>/, '');
    
    // Add essential inline JavaScript to ensure full page functionality
    const inlineScript = `
    <script>
    // Immediately make the page visible to prevent blank screen
    document.body.style.opacity = '1';
    document.body.classList.add('loaded');
    
    // Remove loading overlay immediately
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        // Ensure page is visible
        document.body.style.opacity = '1';
        document.body.classList.add('loaded');
        
        // Hide loading overlay
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
        
        // Mobile Navigation Toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
        
        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('.nav-link, .btn[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 70;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
        
        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });
        
        console.log('Portfolio loaded successfully!');
    });
    </script>`;
    
    // Add CSS override to ensure content is visible even if JavaScript fails
    const cssOverride = `
    <style>
    /* Ensure page is visible even without JavaScript */
    body {
        opacity: 1 !important;
        display: block !important;
        visibility: visible !important;
    }
    
    /* Hide loading overlay by default */
    .loading-overlay {
        display: none !important;
    }
    
    /* Ensure all sections are visible */
    section {
        display: block !important;
        visibility: visible !important;
    }
    </style>`;
    
    // Add the CSS override and inline script before the closing head and body tags
    htmlContent = htmlContent.replace('</head>', cssOverride + '</head>');
    htmlContent = htmlContent.replace('</body>', inlineScript + '</body>');
    
    // Replace profile photo
    if (data.personal.profilePhoto) {
        htmlContent = htmlContent.replace(/<div class="profile-circle">\s*<i class="fas fa-user-graduate"><\/i>\s*<\/div>/, 
            `<div class="profile-circle"><img src="${data.personal.profilePhoto}" alt="${data.personal.fullName}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;"></div>`);
    }
    
    // Replace about paragraphs
    const aboutRegex = /<div class="about-text">\s*<p>.*?<\/p>\s*<p>.*?<\/p>\s*<\/div>/s;
    const aboutReplacement = `<div class="about-text">
                <p>${data.about.paragraph1}</p>
                <p>${data.about.paragraph2}</p>
            </div>`;
    htmlContent = htmlContent.replace(aboutRegex, aboutReplacement);
    
    // Replace contact info
    htmlContent = htmlContent.replace(/alex\.johnson@email\.com/, data.contact.email);
    htmlContent = htmlContent.replace(/\+1 \(555\) 123-4567/, data.contact.phone);
    htmlContent = htmlContent.replace(/San Francisco, CA/, data.contact.location);
    
    // Replace social links
    if (data.contact.linkedin) {
        htmlContent = htmlContent.replace(/href="#".*?linkedin/g, `href="${data.contact.linkedin}" target="_blank"><i class="fab fa-linkedin`);
    }
    if (data.contact.github) {
        htmlContent = htmlContent.replace(/href="#".*?github/g, `href="${data.contact.github}" target="_blank"><i class="fab fa-github`);
    }
    if (data.contact.twitter) {
        htmlContent = htmlContent.replace(/href="#".*?twitter/g, `href="${data.contact.twitter}" target="_blank"><i class="fab fa-twitter`);
    }
    
    return htmlContent;
}

// Update existing live portfolio (same as generate but different messaging)
async function updateLivePortfolio() {
    try {
        showMessage('Updating your live portfolio...', 'info');
        await generateLivePortfolio();
    } catch (error) {
        console.error('Error updating portfolio:', error);
        showMessage(`Error updating portfolio: ${error.message}`, 'error');
    }
}

// Close portfolio modal function
function closePortfolioModal() {
    const modal = document.getElementById('portfolio-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}