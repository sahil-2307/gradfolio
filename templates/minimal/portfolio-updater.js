// Minimal Portfolio Data Updater

class MinimalPortfolioUpdater {
    constructor() {
        this.defaultData = {
            personal: {
                fullName: "John Doe",
                designation: "Minimalist Designer & Developer",
                heroDescription: "I create simple, elegant solutions that focus on user experience and clean aesthetics.",
                profilePhoto: "https://via.placeholder.com/300x300",
                resumeUrl: "#"
            },
            about: {
                paragraph1: "I believe in the power of simplicity. My approach to design and development focuses on creating clean, functional, and beautiful experiences.",
                paragraph2: "With a background in both design and development, I bridge the gap between aesthetics and functionality to deliver solutions that truly work.",
                statProjects: "50+",
                statExperience: "3+",
                statClients: "20+"
            },
            contact: {
                contactDescription: "I'm always interested in new opportunities and interesting projects. Let's create something beautiful together.",
                email: "hello@johndoe.com",
                phone: "+1 (555) 123-4567",
                location: "San Francisco, CA"
            },
            skills: [
                {
                    category: "Design",
                    skills: ["UI/UX", "Figma", "Adobe Creative Suite", "Prototyping"]
                },
                {
                    category: "Frontend",
                    skills: ["React", "TypeScript", "CSS", "HTML", "JavaScript"]
                },
                {
                    category: "Backend",
                    skills: ["Node.js", "Python", "Databases", "APIs"]
                }
            ],
            experience: [
                {
                    position: "Senior Designer",
                    company: "Creative Agency",
                    startDate: "2022",
                    endDate: "Now",
                    description: "Leading design projects and creating minimal, user-focused experiences."
                },
                {
                    position: "Frontend Developer",
                    company: "Tech Startup",
                    startDate: "2020",
                    endDate: "2022",
                    description: "Developed clean, responsive web applications with modern technologies."
                }
            ],
            projects: [
                {
                    title: "Minimal App",
                    description: "Clean mobile application design",
                    image: "https://via.placeholder.com/400x300",
                    technologies: ["React Native", "TypeScript"],
                    liveUrl: "#",
                    githubUrl: "#"
                },
                {
                    title: "Portfolio Website",
                    description: "Simple portfolio design",
                    image: "https://via.placeholder.com/400x300",
                    technologies: ["HTML", "CSS", "JavaScript"],
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
                    platform: "Dribbble",
                    url: "https://dribbble.com/johndoe",
                    icon: "fab fa-dribbble"
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
            if (data.experience && window.updateContent?.experience) {
                window.updateContent.experience(data.experience);
            }
            if (data.projects && window.updateContent?.projects) {
                window.updateContent.projects(data.projects);
            }
            if (data.socialLinks && window.updateContent?.socialLinks) {
                window.updateContent.socialLinks(data.socialLinks);
            }

            this.saveToStorage(data);
            console.log('Minimal portfolio updated successfully');
        } catch (error) {
            console.error('Error updating minimal portfolio:', error);
        }
    }

    saveToStorage(data) {
        try {
            localStorage.setItem('minimalPortfolioData', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem('minimalPortfolioData');
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
        localStorage.removeItem('minimalPortfolioData');
    }
}

// Initialize minimal portfolio updater
window.minimalPortfolioUpdater = new MinimalPortfolioUpdater();
window.updatePortfolioData = (data) => window.minimalPortfolioUpdater.updatePortfolio(data);
window.getPortfolioData = () => window.minimalPortfolioUpdater.getCurrentData();

console.log('Minimal Portfolio Updater initialized successfully');