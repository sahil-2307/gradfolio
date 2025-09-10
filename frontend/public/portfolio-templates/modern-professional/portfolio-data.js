// Portfolio Data Management
// This file handles data loading and integration with various sources

window.PortfolioData = {
    // Load data from various sources
    async loadData() {
        // Priority order: URL params > localStorage > API > default
        
        // 1. Check URL parameters (for preview/sharing)
        const urlData = this.getDataFromURL();
        if (urlData) {
            console.log('Loading data from URL parameters');
            return urlData;
        }

        // 2. Check localStorage (for editing session)
        const localData = this.getDataFromLocalStorage();
        if (localData) {
            console.log('Loading data from localStorage');
            return localData;
        }

        // 3. Try to fetch from API (user's saved data)
        try {
            const apiData = await this.getDataFromAPI();
            if (apiData) {
                console.log('Loading data from API');
                return apiData;
            }
        } catch (error) {
            console.log('API data not available:', error.message);
        }

        // 4. Use default sample data
        console.log('Loading default sample data');
        return this.getDefaultData();
    },

    // Get data from URL parameters
    getDataFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const dataParam = urlParams.get('data');
        
        if (!dataParam) return null;
        
        try {
            return JSON.parse(decodeURIComponent(dataParam));
        } catch (error) {
            console.error('Error parsing URL data:', error);
            return null;
        }
    },

    // Get data from localStorage
    getDataFromLocalStorage() {
        try {
            const saved = localStorage.getItem('modern-portfolio-data');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error parsing localStorage data:', error);
            return null;
        }
    },

    // Get data from API
    async getDataFromAPI() {
        const userId = this.getCurrentUserId();
        if (!userId) return null;

        const response = await fetch(`/api/portfolio-data/${userId}`, {
            headers: {
                'Authorization': `Bearer ${this.getAuthToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        return await response.json();
    },

    // Save data to localStorage
    saveToLocalStorage(data) {
        try {
            localStorage.setItem('modern-portfolio-data', JSON.stringify(data));
            console.log('Data saved to localStorage');
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    // Save data to API
    async saveToAPI(data) {
        const userId = this.getCurrentUserId();
        if (!userId) {
            throw new Error('No user ID available');
        }

        const response = await fetch(`/api/portfolio-data/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getAuthToken()}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Save failed: ${response.status}`);
        }

        console.log('Data saved to API');
        return await response.json();
    },

    // Transform resume data to portfolio format
    transformResumeData(resumeData) {
        if (!resumeData) return null;

        return {
            // Basic Information
            name: resumeData.personal?.fullName || 'Your Name',
            title: resumeData.personal?.title || 'Professional',
            shortBio: resumeData.about?.paragraph1?.substring(0, 120) + '...' || 'Professional with expertise in their field.',
            email: resumeData.personal?.email || '',
            phone: resumeData.personal?.phone || '',
            location: resumeData.personal?.location || '',
            
            // Social Links
            linkedin: resumeData.personal?.linkedin || '',
            github: resumeData.personal?.github || '',
            website: resumeData.personal?.website || '',
            
            // About Section
            aboutParagraph1: resumeData.about?.paragraph1 || 'Professional with extensive experience and passion for excellence.',
            aboutParagraph2: resumeData.about?.paragraph2 || 'Dedicated to delivering high-quality results and building meaningful professional relationships.',
            
            // Skills
            skills: {
                technical: resumeData.skills?.technical || [],
                soft: resumeData.skills?.soft || []
            },
            
            // Experience
            experience: (resumeData.experience || []).map(exp => ({
                position: exp.position || exp.title,
                company: exp.company,
                duration: exp.duration || exp.year,
                description: exp.description || `Professional role at ${exp.company}.`
            })),
            
            // Education (can be shown as additional experience)
            education: (resumeData.education || []).map(edu => ({
                degree: edu.degree,
                institution: edu.institution,
                year: edu.year,
                description: edu.description || `${edu.degree} from ${edu.institution}`
            })),
            
            // Projects
            projects: (resumeData.projects || []).map(project => ({
                title: project.title,
                description: project.description,
                technologies: project.technologies || [],
                link: project.link || '',
                github: project.github || ''
            })),
            
            // Achievements (can be displayed as additional info)
            achievements: resumeData.achievements || []
        };
    },

    // Get default/sample data
    getDefaultData() {
        return {
            name: 'Professional Name',
            title: 'Your Professional Title',
            shortBio: 'Brief description of your professional background and expertise.',
            email: 'your.email@example.com',
            phone: '+1 (555) 123-4567',
            location: 'Your City, State',
            linkedin: '',
            github: '',
            website: '',
            aboutParagraph1: 'I am a dedicated professional with extensive experience in my field. I specialize in delivering high-quality results and building meaningful relationships.',
            aboutParagraph2: 'When not working, I enjoy exploring new technologies, contributing to the community, and continuously learning to stay ahead in my field.',
            skills: {
                technical: ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4', 'Skill 5'],
                soft: ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration']
            },
            experience: [
                {
                    position: 'Senior Position',
                    company: 'Company Name',
                    duration: '2022 - Present',
                    description: 'Led important projects and initiatives that delivered significant value to the organization and clients.'
                },
                {
                    position: 'Professional Role',
                    company: 'Previous Company',
                    duration: '2020 - 2022',
                    description: 'Contributed to key projects and developed expertise in relevant areas while collaborating with cross-functional teams.'
                }
            ],
            projects: [
                {
                    title: 'Featured Project 1',
                    description: 'Description of your most important project, highlighting the technologies used and the impact achieved.',
                    technologies: ['Technology 1', 'Technology 2', 'Technology 3'],
                    link: '',
                    github: ''
                },
                {
                    title: 'Featured Project 2',
                    description: 'Another significant project that demonstrates your skills and expertise in your field.',
                    technologies: ['Technology A', 'Technology B', 'Technology C'],
                    link: '',
                    github: ''
                }
            ]
        };
    },

    // Utility functions
    getCurrentUserId() {
        // Get from localStorage, session, or URL params
        return localStorage.getItem('userId') || 
               sessionStorage.getItem('userId') || 
               new URLSearchParams(window.location.search).get('userId') ||
               null;
    },

    getAuthToken() {
        return localStorage.getItem('authToken') || 
               sessionStorage.getItem('authToken') || 
               null;
    },

    // Data validation
    validateData(data) {
        if (!data || typeof data !== 'object') {
            return false;
        }

        // Check required fields
        const requiredFields = ['name'];
        return requiredFields.every(field => data[field]);
    },

    // Clean and sanitize data
    sanitizeData(data) {
        if (!data) return null;

        // Remove potentially harmful content
        const cleanText = (text) => {
            if (typeof text !== 'string') return text;
            return text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                      .replace(/javascript:/gi, '')
                      .trim();
        };

        const cleanObject = (obj) => {
            if (Array.isArray(obj)) {
                return obj.map(cleanObject);
            } else if (obj && typeof obj === 'object') {
                const cleaned = {};
                Object.keys(obj).forEach(key => {
                    cleaned[key] = cleanObject(obj[key]);
                });
                return cleaned;
            } else if (typeof obj === 'string') {
                return cleanText(obj);
            }
            return obj;
        };

        return cleanObject(data);
    },

    // Export data for download
    exportData(data) {
        const exportData = {
            ...data,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-data-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // Import data from file
    async importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    const sanitized = this.sanitizeData(data);
                    
                    if (this.validateData(sanitized)) {
                        resolve(sanitized);
                    } else {
                        reject(new Error('Invalid data format'));
                    }
                } catch (error) {
                    reject(new Error('Failed to parse JSON'));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }
};

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', async () => {
    if (window.modernPortfolio) {
        // Load data and populate portfolio
        const data = await window.PortfolioData.loadData();
        if (data) {
            const sanitizedData = window.PortfolioData.sanitizeData(data);
            if (window.PortfolioData.validateData(sanitizedData)) {
                window.modernPortfolio.currentData = sanitizedData;
                window.modernPortfolio.populatePortfolio(sanitizedData);
            }
        }
    }
});