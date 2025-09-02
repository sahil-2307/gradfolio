import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserForm.css';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  type: 'fulltime' | 'internship';
  startDate: string;
  endDate: string;
  description: string;
}

interface Skill {
  name: string;
  proficiency: number;
}


interface FormData {
  username: string;
  name: string;
  bio: string;
  graduationYear: string;
  university: string;
  template: string;
  email: string;
  phone?: string;
  includePhone: boolean;
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
}

const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    name: '',
    bio: '',
    graduationYear: '',
    university: '',
    template: 'modern',
    email: '',
    phone: '',
    includePhone: false,
    skills: [],
    projects: [],
    experiences: [],
    socialLinks: {}
  });
  
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [currentProject, setCurrentProject] = useState<Project>({
    id: '',
    title: '',
    description: '',
    technologies: [],
    link: '',
    github: ''
  });
  const [currentTech, setCurrentTech] = useState('');
  const [currentSkill, setCurrentSkill] = useState({ name: '', proficiency: 50 });
  const [currentExperience, setCurrentExperience] = useState<Experience>({
    id: '',
    title: '',
    company: '',
    type: 'fulltime',
    startDate: '',
    endDate: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const templates = [
    { value: 'modern', label: 'Modern Portfolio', description: 'Clean design inspired by Bruno Erdison template' },
    { value: 'classic', label: 'Classic Professional', description: 'Traditional layout with gradient header' },
    { value: 'minimal', label: 'Minimal & Clean', description: 'Typography-focused minimal design' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const addSkill = () => {
    if (currentSkill.name.trim() && !formData.skills.some(s => s.name === currentSkill.name.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { name: currentSkill.name.trim(), proficiency: currentSkill.proficiency }]
      }));
      setCurrentSkill({ name: '', proficiency: 50 });
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.name !== skillToRemove)
    }));
  };

  const addTech = () => {
    if (currentTech.trim() && !currentProject.technologies.includes(currentTech.trim())) {
      setCurrentProject(prev => ({
        ...prev,
        technologies: [...prev.technologies, currentTech.trim()]
      }));
      setCurrentTech('');
    }
  };

  const removeTech = (techToRemove: string) => {
    setCurrentProject(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  const addProject = () => {
    if (currentProject.title.trim() && currentProject.description.trim()) {
      const newProject = {
        ...currentProject,
        id: Date.now().toString()
      };
      setFormData(prev => ({
        ...prev,
        projects: [...prev.projects, newProject]
      }));
      setCurrentProject({
        id: '',
        title: '',
        description: '',
        technologies: [],
        link: '',
        github: ''
      });
    }
  };

  const removeProject = (projectId: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== projectId)
    }));
  };

  const addExperience = () => {
    if (currentExperience.title.trim() && currentExperience.company.trim()) {
      const newExperience = {
        ...currentExperience,
        id: Date.now().toString()
      };
      setFormData(prev => ({
        ...prev,
        experiences: [...prev.experiences, newExperience]
      }));
      setCurrentExperience({
        id: '',
        title: '',
        company: '',
        type: 'fulltime',
        startDate: '',
        endDate: '',
        description: ''
      });
    }
  };

  const removeExperience = (experienceId: string) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== experienceId)
    }));
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profilePhoto' | 'resume') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'profilePhoto') {
        setProfilePhoto(file);
      } else {
        setResume(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitFormData = new FormData();
      
      // Append text fields
      submitFormData.append('username', formData.username);
      submitFormData.append('name', formData.name);
      submitFormData.append('bio', formData.bio);
      submitFormData.append('graduationYear', formData.graduationYear);
      submitFormData.append('university', formData.university);
      submitFormData.append('template', formData.template);
      submitFormData.append('email', formData.email);
      if (formData.includePhone && formData.phone) {
        submitFormData.append('phone', formData.phone);
      }
      submitFormData.append('skills', JSON.stringify(formData.skills));
      submitFormData.append('projects', JSON.stringify(formData.projects));
      submitFormData.append('experiences', JSON.stringify(formData.experiences));
      submitFormData.append('socialLinks', JSON.stringify(formData.socialLinks));
      
      // Append files
      if (profilePhoto) {
        submitFormData.append('profilePhoto', profilePhoto);
      }
      if (resume) {
        submitFormData.append('resume', resume);
      }

      const response = await axios.post('http://localhost:5000/api/profile', submitFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Profile created:', response.data);
      navigate(`/profile/${formData.username}`);
    } catch (error: any) {
      console.error('Form submission error:', error);
      setError(error.response?.data?.error || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="user-form-container">
        <div className="user-form">
          <h1>Create Your GradGen Portfolio</h1>
          <p>Generate your professional landing page in minutes</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Basic Information</h2>
              
              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="your-unique-username"
                  required
                />
                <small>This will be your public URL: onlineportfolios.in/{formData.username}</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bio">Bio *</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell the world about yourself..."
                  rows={4}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="graduationYear">Graduation Year *</label>
                  <input
                    type="text"
                    id="graduationYear"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleInputChange}
                    placeholder="2024"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="university">University *</label>
                  <input
                    type="text"
                    id="university"
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    placeholder="Stanford University"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@gmail.com"
                  required
                />
              </div>
              
              <div className="form-group">
                <div className="phone-section">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.includePhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, includePhone: e.target.checked }))}
                    />
                    Include Phone Number (Optional)
                  </label>
                  
                  {formData.includePhone && (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="phone-input"
                    />
                  )}
                </div>
              </div>
            </div>


            <div className="form-section">
              <h2>🎨 Choose Your Template</h2>
              <p className="section-description">Select a design template that best represents your style</p>
              <div className="template-options">
                {templates.map((template) => (
                  <label key={template.value} className={`template-option ${formData.template === template.value ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="template"
                      value={template.value}
                      checked={formData.template === template.value}
                      onChange={handleInputChange}
                    />
                    <div className="template-preview">
                      <div className={`template-thumbnail ${template.value}`}>
                        {template.value === 'modern' && (
                          <div className="modern-preview">
                            <div className="sidebar"></div>
                            <div className="content">
                              <div className="profile-circle"></div>
                              <div className="text-lines">
                                <div className="line long"></div>
                                <div className="line short"></div>
                              </div>
                            </div>
                          </div>
                        )}
                        {template.value === 'classic' && (
                          <div className="classic-preview">
                            <div className="header"></div>
                            <div className="content-grid">
                              <div className="content-block"></div>
                              <div className="content-block"></div>
                            </div>
                          </div>
                        )}
                        {template.value === 'minimal' && (
                          <div className="minimal-preview">
                            <div className="minimal-header">
                              <div className="line short"></div>
                              <div className="dots">
                                <div className="dot"></div>
                                <div className="dot"></div>
                              </div>
                            </div>
                            <div className="minimal-content">
                              <div className="line long"></div>
                              <div className="line medium"></div>
                              <div className="line short"></div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="template-info">
                        <h4>{template.label}</h4>
                        <p>{template.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

          <div className="form-section">
            <h2>Files</h2>
            
            <div className="form-group">
              <label htmlFor="profilePhoto">Profile Photo</label>
              <input
                type="file"
                id="profilePhoto"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'profilePhoto')}
              />
              {profilePhoto && <span className="file-selected">{profilePhoto.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="resume">Resume (PDF)</label>
              <input
                type="file"
                id="resume"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, 'resume')}
              />
              {resume && <span className="file-selected">{resume.name}</span>}
            </div>
          </div>

          <div className="form-section">
            <h2>💪 Skills & Proficiency</h2>
            <p className="section-description">Add your technical skills with proficiency levels</p>
            
            <div className="skill-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Skill Name</label>
                  <input
                    type="text"
                    value={currentSkill.name}
                    onChange={(e) => setCurrentSkill(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="React, JavaScript, Python..."
                  />
                </div>
                <div className="form-group">
                  <label>Proficiency Level: {currentSkill.proficiency}%</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="10"
                    value={currentSkill.proficiency}
                    onChange={(e) => setCurrentSkill(prev => ({ ...prev, proficiency: parseInt(e.target.value) }))}
                    className="proficiency-slider"
                  />
                  <div className="proficiency-labels">
                    <span>Beginner</span>
                    <span>Intermediate</span>
                    <span>Expert</span>
                  </div>
                </div>
              </div>
              <button type="button" onClick={addSkill} className="add-skill-btn">
                ➕ Add Skill
              </button>
            </div>
            
            <div className="skills-list">
              {formData.skills.map((skill, index) => (
                <div key={index} className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-percentage">{skill.proficiency}%</span>
                  </div>
                  <div className="skill-bar">
                    <div 
                      className="skill-fill" 
                      style={{width: `${skill.proficiency}%`}}
                    ></div>
                  </div>
                  <button type="button" onClick={() => removeSkill(skill.name)} className="remove-skill">
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h2>Social Links</h2>
            
            <div className="form-group">
              <label htmlFor="linkedin">LinkedIn</label>
              <input
                type="url"
                id="linkedin"
                placeholder="https://linkedin.com/in/yourprofile"
                value={formData.socialLinks.linkedin || ''}
                onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="github">GitHub</label>
              <input
                type="url"
                id="github"
                placeholder="https://github.com/yourusername"
                value={formData.socialLinks.github || ''}
                onChange={(e) => handleSocialLinkChange('github', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="twitter">Twitter</label>
              <input
                type="url"
                id="twitter"
                placeholder="https://twitter.com/yourusername"
                value={formData.socialLinks.twitter || ''}
                onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="website">Personal Website</label>
              <input
                type="url"
                id="website"
                placeholder="https://yourwebsite.com"
                value={formData.socialLinks.website || ''}
                onChange={(e) => handleSocialLinkChange('website', e.target.value)}
              />
            </div>
          </div>

            <div className="form-section">
              <h2>🚀 Projects</h2>
              <p className="section-description">Showcase your best work and technical projects</p>
              
              <div className="project-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Project Title</label>
                    <input
                      type="text"
                      value={currentProject.title}
                      onChange={(e) => setCurrentProject(prev => ({...prev, title: e.target.value}))}
                      placeholder="E-commerce Website"
                    />
                  </div>
                  <div className="form-group">
                    <label>Live Demo Link</label>
                    <input
                      type="url"
                      value={currentProject.link}
                      onChange={(e) => setCurrentProject(prev => ({...prev, link: e.target.value}))}
                      placeholder="https://myproject.com"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>GitHub Repository</label>
                  <input
                    type="url"
                    value={currentProject.github}
                    onChange={(e) => setCurrentProject(prev => ({...prev, github: e.target.value}))}
                    placeholder="https://github.com/username/project"
                  />
                </div>
                
                <div className="form-group">
                  <label>Project Description</label>
                  <textarea
                    value={currentProject.description}
                    onChange={(e) => setCurrentProject(prev => ({...prev, description: e.target.value}))}
                    placeholder="Describe your project, its features, and your role..."
                    rows={3}
                  />
                </div>
                
                <div className="form-group">
                  <label>Technologies Used</label>
                  <div className="tech-input">
                    <input
                      type="text"
                      value={currentTech}
                      onChange={(e) => setCurrentTech(e.target.value)}
                      placeholder="React, Node.js, MongoDB..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    />
                    <button type="button" onClick={addTech}>Add Tech</button>
                  </div>
                  <div className="tech-list">
                    {currentProject.technologies.map((tech, index) => (
                      <span key={index} className="tech-tag">
                        {tech}
                        <button type="button" onClick={() => removeTech(tech)}>×</button>
                      </span>
                    ))}
                  </div>
                </div>
                
                <button type="button" onClick={addProject} className="add-project-btn">
                  ➕ Add Project
                </button>
              </div>
              
              <div className="projects-list">
                {formData.projects.map((project) => (
                  <div key={project.id} className="project-item">
                    <div className="project-header">
                      <h4>{project.title}</h4>
                      <button type="button" onClick={() => removeProject(project.id)} className="remove-btn">
                        🗑️
                      </button>
                    </div>
                    <p>{project.description}</p>
                    <div className="project-links">
                      {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer">🔗 Demo</a>}
                      {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer">📁 Code</a>}
                    </div>
                    <div className="project-techs">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="tech-badge">{tech}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h2>💼 Professional Experience</h2>
              <p className="section-description">Add your work experience, internships, or relevant positions</p>
              
              <div className="experience-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Job Title</label>
                    <input
                      type="text"
                      value={currentExperience.title}
                      onChange={(e) => setCurrentExperience(prev => ({...prev, title: e.target.value}))}
                      placeholder="Software Engineer, Data Analyst..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Company</label>
                    <input
                      type="text"
                      value={currentExperience.company}
                      onChange={(e) => setCurrentExperience(prev => ({...prev, company: e.target.value}))}
                      placeholder="Google, Microsoft, Startup Inc..."
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Experience Type</label>
                    <select
                      value={currentExperience.type}
                      onChange={(e) => setCurrentExperience(prev => ({...prev, type: e.target.value as 'fulltime' | 'internship'}))}
                    >
                      <option value="fulltime">Full-time</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={currentExperience.startDate}
                      onChange={(e) => setCurrentExperience(prev => ({...prev, startDate: e.target.value}))}
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={currentExperience.endDate}
                      onChange={(e) => setCurrentExperience(prev => ({...prev, endDate: e.target.value}))}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Description & Achievements</label>
                  <textarea
                    value={currentExperience.description}
                    onChange={(e) => setCurrentExperience(prev => ({...prev, description: e.target.value}))}
                    placeholder="Describe your responsibilities, achievements, and impact..."
                    rows={3}
                  />
                </div>
                
                <button type="button" onClick={addExperience} className="add-experience-btn">
                  ➕ Add Experience
                </button>
              </div>
              
              <div className="experiences-list">
                {formData.experiences.map((experience) => (
                  <div key={experience.id} className="experience-item">
                    <div className="experience-header">
                      <h4>{experience.title}</h4>
                      <span className="experience-type">{experience.type === 'fulltime' ? 'Full-time' : 'Internship'}</span>
                      <button type="button" onClick={() => removeExperience(experience.id)} className="remove-btn">
                        🗑️
                      </button>
                    </div>
                    <h5>{experience.company}</h5>
                    <p className="experience-period">
                      {new Date(experience.startDate).toLocaleDateString()} - {new Date(experience.endDate).toLocaleDateString()}
                    </p>
                    <p>{experience.description}</p>
                  </div>
                ))}
              </div>
            </div>


            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Creating Profile...' : '🚀 Create My GradGen'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserForm;