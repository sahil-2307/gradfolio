// Portfolio Data Updater for Professional Template

class PortfolioUpdater {
    constructor() {
        this.defaultData = {
            personal: {
                fullName: "John Doe",
                designation: "Senior Software Engineer",
                heroDescription: "Passionate about creating innovative solutions and leading development teams to build exceptional software products.",
                profilePhoto: "https://via.placeholder.com/400x400",
                resumeUrl: "#"
            },
            about: {
                paragraph1: "I am a dedicated software engineer with over 5 years of experience in developing scalable web applications and leading cross-functional teams.",
                paragraph2: "My expertise spans across modern web technologies, cloud architecture, and agile development methodologies. I'm passionate about writing clean, efficient code and mentoring junior developers.",
                statProjects: "25+",
                statExperience: "5+",
                statClients: "15+"
            },
            contact: {
                contactDescription: "Let's discuss how we can work together",
                email: "john.doe@email.com",
                phone: "+1 (555) 123-4567",
                location: "San Francisco, CA"
            },
            skills: [
                {
                    category: "Frontend",
                    skills: ["React", "TypeScript", "Vue.js", "Angular", "HTML5", "CSS3"]
                },
                {
                    category: "Backend",
                    skills: ["Node.js", "Python", "Java", "Express", "Django", "Spring Boot"]
                },
                {
                    category: "Database",
                    skills: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Elasticsearch"]
                },
                {
                    category: "DevOps",
                    skills: ["Docker", "Kubernetes", "AWS", "Jenkins", "Terraform"]
                }
            ],
            experience: [
                {
                    position: "Senior Software Engineer",
                    company: "Tech Company Inc.",
                    startDate: "2021",
                    endDate: "Present",
                    description: "Led development of enterprise-level applications serving millions of users. Mentored junior developers and implemented best practices across the team."
                },
                {
                    position: "Software Engineer",
                    company: "Innovation Labs",
                    startDate: "2019",
                    endDate: "2021",
                    description: "Developed and maintained web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality software solutions."
                },
                {
                    position: "Junior Developer",
                    company: "StartUp Solutions",
                    startDate: "2018",
                    endDate: "2019",
                    description: "Built responsive web interfaces and REST APIs. Gained experience in full-stack development and agile methodologies."
                }
            ],
            projects: [
                {
                    title: "E-commerce Platform",
                    description: "Full-stack e-commerce solution built with React and Node.js, featuring payment integration and inventory management.",
                    image: "https://via.placeholder.com/400x250",
                    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
                    liveUrl: "#",
                    githubUrl: "#"
                },
                {
                    title: "Task Management App",
                    description: "Collaborative project management tool with real-time updates and team collaboration features.",
                    image: "https://via.placeholder.com/400x250",
                    technologies: ["Vue.js", "Express", "PostgreSQL", "Socket.io"],
                    liveUrl: "#",
                    githubUrl: "#"
                },
                {
                    title: "Analytics Dashboard",
                    description: "Data visualization dashboard for business intelligence with interactive charts and reports.",
                    image: "https://via.placeholder.com/400x250",
                    technologies: ["React", "D3.js", "Python", "Flask"],
                    liveUrl: "#",
                    githubUrl: "#"
                }
            ],
            socialLinks: [
                {
                    platform: "LinkedIn",
                    url: "https://linkedin.com/in/johndoe",
                    icon: "fab fa-linkedin"
                },
                {
                    platform: "GitHub",
                    url: "https://github.com/johndoe",
                    icon: "fab fa-github"
                },
                {
                    platform: "Twitter",
                    url: "https://twitter.com/johndoe",
                    icon: "fab fa-twitter"
                }
            ]
        };

        this.initialize();
    }

    initialize() {
        // Try to load data from localStorage first
        const savedData = this.loadFromStorage();
        if (savedData) {
            this.updatePortfolio(savedData);
        } else {
            // Use default data if no saved data
            this.updatePortfolio(this.defaultData);
        }

        // Listen for custom events from admin panel
        window.addEventListener('portfolioDataUpdate', (event) => {
            this.updatePortfolio(event.detail);
        });

        // Listen for messages from parent window (admin panel)
        window.addEventListener('message', (event) => {
            if (event.data.type === 'portfolioUpdate') {
                this.updatePortfolio(event.data.data);
            }
        });
    }

    updatePortfolio(data) {
        try {
            // Update each section if data exists and update function is available
            if (data.personal && window.updateContent?.personal) {
                window.updateContent.personal(data.personal);
            }

            if (data.about && window.updateContent?.about) {
                window.updateContent.about(data.about);
            }

            if (data.contact && window.updateContent?.contact) {
                window.updateContent.contact(data.contact);
            }

            if (data.skills && window.updateContent?.skills) {
                window.updateContent.skills(data.skills);
            }

            if (data.experience && window.updateContent?.experience) {
                window.updateContent.experience(data.experience);
            }

            if (data.projects && window.updateContent?.projects) {
                window.updateContent.projects(data.projects);
            }

            if (data.socialLinks && window.updateContent?.socialLinks) {
                window.updateContent.socialLinks(data.socialLinks);
            }

            // Save to localStorage for persistence
            this.saveToStorage(data);

            console.log('Portfolio updated successfully');
        } catch (error) {
            console.error('Error updating portfolio:', error);
        }
    }

    saveToStorage(data) {
        try {
            localStorage.setItem('professionalPortfolioData', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem('professionalPortfolioData');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }

    // Method to get current portfolio data
    getCurrentData() {
        return this.loadFromStorage() || this.defaultData;
    }

    // Method to reset to default data
    resetToDefault() {
        this.updatePortfolio(this.defaultData);
        localStorage.removeItem('professionalPortfolioData');
    }

    // Export portfolio data
    exportData() {
        const data = this.getCurrentData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'professional-portfolio-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Import portfolio data
    importData(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            this.updatePortfolio(data);
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}

// Global functions for external access
window.portfolioUpdater = new PortfolioUpdater();
window.updatePortfolioData = (data) => window.portfolioUpdater.updatePortfolio(data);
window.getPortfolioData = () => window.portfolioUpdater.getCurrentData();
window.resetPortfolio = () => window.portfolioUpdater.resetToDefault();
window.exportPortfolio = () => window.portfolioUpdater.exportData();
window.importPortfolio = (data) => window.portfolioUpdater.importData(data);

// API for form integration
window.PortfolioAPI = {
    // Update specific sections
    updatePersonal: (data) => {
        const currentData = window.portfolioUpdater.getCurrentData();
        currentData.personal = { ...currentData.personal, ...data };
        window.portfolioUpdater.updatePortfolio(currentData);
    },

    updateAbout: (data) => {
        const currentData = window.portfolioUpdater.getCurrentData();
        currentData.about = { ...currentData.about, ...data };
        window.portfolioUpdater.updatePortfolio(currentData);
    },

    updateContact: (data) => {
        const currentData = window.portfolioUpdater.getCurrentData();
        currentData.contact = { ...currentData.contact, ...data };
        window.portfolioUpdater.updatePortfolio(currentData);
    },

    updateSkills: (data) => {
        const currentData = window.portfolioUpdater.getCurrentData();
        currentData.skills = data;
        window.portfolioUpdater.updatePortfolio(currentData);
    },

    updateExperience: (data) => {
        const currentData = window.portfolioUpdater.getCurrentData();
        currentData.experience = data;
        window.portfolioUpdater.updatePortfolio(currentData);
    },

    updateProjects: (data) => {
        const currentData = window.portfolioUpdater.getCurrentData();
        currentData.projects = data;
        window.portfolioUpdater.updatePortfolio(currentData);
    },

    updateSocialLinks: (data) => {
        const currentData = window.portfolioUpdater.getCurrentData();
        currentData.socialLinks = data;
        window.portfolioUpdater.updatePortfolio(currentData);
    },

    // Get specific sections
    getPersonal: () => window.portfolioUpdater.getCurrentData().personal,
    getAbout: () => window.portfolioUpdater.getCurrentData().about,
    getContact: () => window.portfolioUpdater.getCurrentData().contact,
    getSkills: () => window.portfolioUpdater.getCurrentData().skills,
    getExperience: () => window.portfolioUpdater.getCurrentData().experience,
    getProjects: () => window.portfolioUpdater.getCurrentData().projects,
    getSocialLinks: () => window.portfolioUpdater.getCurrentData().socialLinks
};

console.log('Professional Portfolio Updater initialized successfully');