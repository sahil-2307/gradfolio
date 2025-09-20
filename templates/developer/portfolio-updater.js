// Developer Portfolio Data Updater

class DeveloperPortfolioUpdater {
    constructor() {
        this.defaultData = {
            personal: {
                fullName: "John Doe",
                designation: "Full Stack Developer",
                heroDescription: "Building elegant solutions through clean code and innovative thinking.",
                profilePhoto: "https://via.placeholder.com/400x400",
                resumeUrl: "#"
            },
            about: {
                paragraph1: "Passionate developer with expertise in modern web technologies.",
                paragraph2: "I love creating efficient, scalable solutions and contributing to open source.",
                statProjects: "50",
                statExperience: "5",
                statClients: "2000",
                location: "San Francisco, CA"
            },
            contact: {
                contactDescription: "Always excited to collaborate on innovative projects and discuss new opportunities.",
                email: "john@example.com",
                phone: "+1 (555) 123-4567",
                location: "San Francisco, CA"
            },
            skills: [
                {
                    category: "Frontend",
                    skills: ["React", "TypeScript", "Vue.js", "JavaScript", "HTML5", "CSS3"]
                },
                {
                    category: "Backend",
                    skills: ["Node.js", "Python", "Express", "Django", "PostgreSQL", "MongoDB"]
                },
                {
                    category: "DevOps",
                    skills: ["Docker", "Kubernetes", "AWS", "Jenkins", "Git", "Linux"]
                },
                {
                    category: "Tools",
                    skills: ["VS Code", "Terminal", "Figma", "Postman", "Jest", "Webpack"]
                }
            ],
            projects: [
                {
                    title: "Code Editor",
                    description: "A modern code editor with syntax highlighting and live preview",
                    image: "https://via.placeholder.com/400x250",
                    technologies: ["React", "TypeScript", "Monaco Editor"],
                    liveUrl: "#",
                    githubUrl: "#"
                },
                {
                    title: "Terminal App",
                    description: "Cross-platform terminal application with custom themes",
                    image: "https://via.placeholder.com/400x250",
                    technologies: ["Electron", "Node.js", "CSS"],
                    liveUrl: "#",
                    githubUrl: "#"
                },
                {
                    title: "API Gateway",
                    description: "Microservices API gateway with rate limiting and authentication",
                    image: "https://via.placeholder.com/400x250",
                    technologies: ["Node.js", "Express", "Redis", "JWT"],
                    liveUrl: "#",
                    githubUrl: "#"
                }
            ],
            socialLinks: [
                {
                    platform: "GitHub",
                    url: "https://github.com/johndoe",
                    icon: "fab fa-github"
                },
                {
                    platform: "LinkedIn",
                    url: "https://linkedin.com/in/johndoe",
                    icon: "fab fa-linkedin"
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
        const savedData = this.loadFromStorage();
        if (savedData) {
            this.updatePortfolio(savedData);
        } else {
            this.updatePortfolio(this.defaultData);
        }

        window.addEventListener('portfolioDataUpdate', (event) => {
            this.updatePortfolio(event.detail);
        });

        window.addEventListener('message', (event) => {
            if (event.data.type === 'portfolioUpdate') {
                this.updatePortfolio(event.data.data);
            }
        });
    }

    updatePortfolio(data) {
        try {
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
            if (data.projects && window.updateContent?.projects) {
                window.updateContent.projects(data.projects);
            }
            if (data.socialLinks && window.updateContent?.socialLinks) {
                window.updateContent.socialLinks(data.socialLinks);
            }

            this.saveToStorage(data);
            console.log('Developer portfolio updated successfully');
        } catch (error) {
            console.error('Error updating developer portfolio:', error);
        }
    }

    saveToStorage(data) {
        try {
            localStorage.setItem('developerPortfolioData', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem('developerPortfolioData');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }

    getCurrentData() {
        return this.loadFromStorage() || this.defaultData;
    }

    resetToDefault() {
        this.updatePortfolio(this.defaultData);
        localStorage.removeItem('developerPortfolioData');
    }
}

// Initialize developer portfolio updater
window.developerPortfolioUpdater = new DeveloperPortfolioUpdater();
window.updatePortfolioData = (data) => window.developerPortfolioUpdater.updatePortfolio(data);
window.getPortfolioData = () => window.developerPortfolioUpdater.getCurrentData();

console.log('Developer Portfolio Updater initialized successfully');