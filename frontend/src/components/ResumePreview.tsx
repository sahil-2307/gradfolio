import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMobileDetection } from '../hooks/useMobileDetection';
import { ResumeService, ResumeData } from '../services/resumeService';
import './ResumePreview.css';

// Remove duplicate interface since we're importing it from resumeService

interface ResumePreviewProps {
  user?: any;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ user }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isMobile } = useMobileDetection();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [editedData, setEditedData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeSection, setActiveSection] = useState('personal');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    loadResumeData();
  }, []);

  useEffect(() => {
    // Apply theme
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const loadResumeData = async () => {
    try {
      // Get username from URL params or user prop
      const username = searchParams.get('username') || user?.username;
      
      if (!username) {
        setMessage('No user information found. Redirecting to dashboard...');
        setTimeout(() => navigate('/dashboard'), 2000);
        return;
      }

      console.log('Loading resume data for username:', username);
      
      // Load resume data from database first, fallback to localStorage
      const result = await ResumeService.getResumeData(username);
      
      if (!result.success || !result.data) {
        console.error('No resume data found:', result.error);
        setMessage('No resume data found. Please upload a resume first.');
        setTimeout(() => navigate('/dashboard'), 2000);
        return;
      }

      console.log('Resume data loaded successfully:', result.data);
      setResumeData(result.data);
      setEditedData(JSON.parse(JSON.stringify(result.data))); // Deep copy for editing
      setLoading(false);
    } catch (error) {
      console.error('Error loading resume data:', error);
      setMessage('Error loading resume data. Please try again.');
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  };

  const handleInputChange = (section: string, field: string, value: any, index?: number) => {
    if (!editedData) return;

    const newData = { ...editedData };
    
    if (index !== undefined) {
      // Handle array fields
      if (section === 'skills') {
        if (field === 'technical' || field === 'soft') {
          newData.skills[field as keyof typeof newData.skills] = value.split(',').map((item: string) => item.trim());
        }
      } else if (section === 'achievements') {
        newData.achievements[index] = value;
      } else {
        // Handle nested objects in arrays
        (newData[section as keyof ResumeData] as any)[index][field] = value;
      }
    } else {
      // Handle simple fields
      if (section === 'personal' || section === 'about') {
        (newData[section as keyof ResumeData] as any)[field] = value;
      }
    }
    
    setEditedData(newData);
  };

  const addArrayItem = (section: string) => {
    if (!editedData) return;

    const newData = { ...editedData };
    
    switch (section) {
      case 'experience':
        newData.experience.push({
          position: '',
          company: '',
          duration: '',
          description: ''
        });
        break;
      case 'education':
        newData.education.push({
          degree: '',
          institution: '',
          year: '',
          description: ''
        });
        break;
      case 'projects':
        newData.projects.push({
          title: '',
          description: '',
          technologies: [],
          link: ''
        });
        break;
      case 'achievements':
        newData.achievements.push('');
        break;
    }
    
    setEditedData(newData);
  };

  const removeArrayItem = (section: string, index: number) => {
    if (!editedData) return;

    const newData = { ...editedData };
    
    switch (section) {
      case 'experience':
        newData.experience.splice(index, 1);
        break;
      case 'education':
        newData.education.splice(index, 1);
        break;
      case 'projects':
        newData.projects.splice(index, 1);
        break;
      case 'achievements':
        newData.achievements.splice(index, 1);
        break;
    }
    
    setEditedData(newData);
  };

  const saveChanges = async () => {
    if (!editedData || !user?.username) return;

    setSaving(true);
    try {
      console.log('Saving resume changes to database:', editedData);
      
      // Save updated data to both database and localStorage
      const result = await ResumeService.saveResumeData(user.username, editedData);
      
      if (result.success) {
        setResumeData(editedData);
        if (result.error) {
          // Partial success - saved locally but not to database
          setMessage(`⚠️ ${result.error}`);
          setTimeout(() => setMessage(''), 8000);
        } else {
          // Full success
          setMessage('✅ Changes saved successfully to database!');
          setTimeout(() => setMessage(''), 3000);
        }
      } else {
        throw new Error(result.error || 'Failed to save changes');
      }
    } catch (error: any) {
      console.error('Error saving changes:', error);
      setMessage(`❌ Error saving changes: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  const createPortfolio = async () => {
    if (!editedData || !user?.username) return;

    setSaving(true);
    try {
      // Save any unsaved changes first
      const result = await ResumeService.saveResumeData(user.username, editedData);
      
      if (!result.success) {
        console.warn('Failed to save to database before creating portfolio:', result.error);
        // Still proceed, data is in localStorage
      }
      
      // Navigate to template selection with resume data
      navigate(`/templates?source=resume&username=${user.username}`);
    } catch (error) {
      console.error('Error saving before portfolio creation:', error);
      // Still proceed with portfolio creation
      navigate(`/templates?source=resume&username=${user.username}`);
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: 'fas fa-user' },
    { id: 'about', label: 'About', icon: 'fas fa-info-circle' },
    { id: 'experience', label: 'Experience', icon: 'fas fa-briefcase' },
    { id: 'education', label: 'Education', icon: 'fas fa-graduation-cap' },
    { id: 'skills', label: 'Skills', icon: 'fas fa-code' },
    { id: 'projects', label: 'Projects', icon: 'fas fa-project-diagram' },
    { id: 'achievements', label: 'Achievements', icon: 'fas fa-trophy' }
  ];

  const currentSectionIndex = sections.findIndex(section => section.id === activeSection);
  const canGoPrevious = currentSectionIndex > 0;
  const canGoNext = currentSectionIndex < sections.length - 1;

  const goToPreviousSection = () => {
    if (canGoPrevious) {
      setActiveSection(sections[currentSectionIndex - 1].id);
    }
  };

  const goToNextSection = () => {
    if (canGoNext) {
      setActiveSection(sections[currentSectionIndex + 1].id);
    }
  };

  if (loading) {
    return (
      <div className="resume-preview-container">
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <h2>Loading Resume Data...</h2>
        </div>
      </div>
    );
  }

  if (!resumeData || !editedData) {
    return (
      <div className="resume-preview-container">
        <div className="error-section">
          <i className="fas fa-exclamation-triangle"></i>
          <h2>Resume Data Not Found</h2>
          <p>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`resume-preview-container ${isMobile ? 'mobile' : ''}`}>
      {/* Header */}
      <div className="resume-header">
        <div className="header-content">
          <button onClick={() => navigate('/dashboard')} className="back-btn">
            <i className="fas fa-arrow-left"></i>
            <span>Back</span>
          </button>
          <button onClick={toggleTheme} className="theme-toggle">
            <div className="toggle-track">
              <div className={`toggle-thumb ${isDarkMode ? 'dark' : 'light'}`}></div>
            </div>
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className="message-display">
          {message}
        </div>
      )}

      <div className="resume-content">
        {/* Navigation Sidebar */}
        <div className="resume-nav">
          <div className="nav-sections">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
              >
                <i className={section.icon}></i>
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="resume-form">
          {activeSection === 'personal' && (
            <div className="form-section">
              <h2><i className="fas fa-user"></i> Personal Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editedData.personal.fullName}
                    onChange={(e) => handleInputChange('personal', 'fullName', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editedData.personal.email}
                    onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={editedData.personal.phone}
                    onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="form-group">
                  <label>LinkedIn</label>
                  <input
                    type="url"
                    value={editedData.personal.linkedin}
                    onChange={(e) => handleInputChange('personal', 'linkedin', e.target.value)}
                    placeholder="LinkedIn profile URL"
                  />
                </div>
                <div className="form-group">
                  <label>GitHub</label>
                  <input
                    type="url"
                    value={editedData.personal.github}
                    onChange={(e) => handleInputChange('personal', 'github', e.target.value)}
                    placeholder="GitHub profile URL"
                  />
                </div>
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    value={editedData.personal.website}
                    onChange={(e) => handleInputChange('personal', 'website', e.target.value)}
                    placeholder="Personal website URL"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'about' && (
            <div className="form-section">
              <h2><i className="fas fa-info-circle"></i> About Me</h2>
              <div className="form-group">
                <label>First Paragraph</label>
                <textarea
                  value={editedData.about.paragraph1}
                  onChange={(e) => handleInputChange('about', 'paragraph1', e.target.value)}
                  placeholder="Write about yourself..."
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label>Second Paragraph</label>
                <textarea
                  value={editedData.about.paragraph2}
                  onChange={(e) => handleInputChange('about', 'paragraph2', e.target.value)}
                  placeholder="Continue your story..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {activeSection === 'experience' && (
            <div className="form-section">
              <div className="section-header">
                <h2><i className="fas fa-briefcase"></i> Work Experience</h2>
                <button onClick={() => addArrayItem('experience')} className="btn btn-outline btn-sm">
                  <i className="fas fa-plus"></i> Add Experience
                </button>
              </div>
              {editedData.experience.map((exp, index) => (
                <div key={index} className="array-item">
                  <div className="item-header">
                    <h3>Experience {index + 1}</h3>
                    <button onClick={() => removeArrayItem('experience', index)} className="remove-btn">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Position</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => handleInputChange('experience', 'position', e.target.value, index)}
                        placeholder="Job title"
                      />
                    </div>
                    <div className="form-group">
                      <label>Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleInputChange('experience', 'company', e.target.value, index)}
                        placeholder="Company name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Duration</label>
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => handleInputChange('experience', 'duration', e.target.value, index)}
                        placeholder="e.g., Jan 2020 - Present"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => handleInputChange('experience', 'description', e.target.value, index)}
                      placeholder="Describe your role and achievements..."
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'education' && (
            <div className="form-section">
              <div className="section-header">
                <h2><i className="fas fa-graduation-cap"></i> Education</h2>
                <button onClick={() => addArrayItem('education')} className="btn btn-outline btn-sm">
                  <i className="fas fa-plus"></i> Add Education
                </button>
              </div>
              {editedData.education.map((edu, index) => (
                <div key={index} className="array-item">
                  <div className="item-header">
                    <h3>Education {index + 1}</h3>
                    <button onClick={() => removeArrayItem('education', index)} className="remove-btn">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleInputChange('education', 'degree', e.target.value, index)}
                        placeholder="Degree name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleInputChange('education', 'institution', e.target.value, index)}
                        placeholder="School/University name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Year</label>
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => handleInputChange('education', 'year', e.target.value, index)}
                        placeholder="Graduation year"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={edu.description}
                      onChange={(e) => handleInputChange('education', 'description', e.target.value, index)}
                      placeholder="Additional details about your education..."
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'skills' && (
            <div className="form-section">
              <h2><i className="fas fa-code"></i> Skills</h2>
              <div className="form-group">
                <label>Technical Skills</label>
                <textarea
                  value={editedData.skills.technical.join(', ')}
                  onChange={(e) => handleInputChange('skills', 'technical', e.target.value)}
                  placeholder="Enter technical skills separated by commas"
                  rows={3}
                />
                <small>Separate skills with commas (e.g., JavaScript, React, Node.js)</small>
              </div>
              <div className="form-group">
                <label>Soft Skills</label>
                <textarea
                  value={editedData.skills.soft.join(', ')}
                  onChange={(e) => handleInputChange('skills', 'soft', e.target.value)}
                  placeholder="Enter soft skills separated by commas"
                  rows={3}
                />
                <small>Separate skills with commas (e.g., Leadership, Communication, Problem Solving)</small>
              </div>
            </div>
          )}

          {activeSection === 'projects' && (
            <div className="form-section">
              <div className="section-header">
                <h2><i className="fas fa-project-diagram"></i> Projects</h2>
                <button onClick={() => addArrayItem('projects')} className="btn btn-outline btn-sm">
                  <i className="fas fa-plus"></i> Add Project
                </button>
              </div>
              {editedData.projects.map((project, index) => (
                <div key={index} className="array-item">
                  <div className="item-header">
                    <h3>Project {index + 1}</h3>
                    <button onClick={() => removeArrayItem('projects', index)} className="remove-btn">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => handleInputChange('projects', 'title', e.target.value, index)}
                        placeholder="Project title"
                      />
                    </div>
                    <div className="form-group">
                      <label>Link</label>
                      <input
                        type="url"
                        value={project.link}
                        onChange={(e) => handleInputChange('projects', 'link', e.target.value, index)}
                        placeholder="Project URL"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={project.description}
                      onChange={(e) => handleInputChange('projects', 'description', e.target.value, index)}
                      placeholder="Describe your project..."
                      rows={3}
                    />
                  </div>
                  <div className="form-group">
                    <label>Technologies</label>
                    <input
                      type="text"
                      value={project.technologies.join(', ')}
                      onChange={(e) => handleInputChange('projects', 'technologies', e.target.value.split(',').map(t => t.trim()), index)}
                      placeholder="Technologies used (separated by commas)"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'achievements' && (
            <div className="form-section">
              <div className="section-header">
                <h2><i className="fas fa-trophy"></i> Achievements</h2>
                <button onClick={() => addArrayItem('achievements')} className="btn btn-outline btn-sm">
                  <i className="fas fa-plus"></i> Add Achievement
                </button>
              </div>
              {editedData.achievements.map((achievement, index) => (
                <div key={index} className="array-item">
                  <div className="achievement-item">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => handleInputChange('achievements', '', e.target.value, index)}
                      placeholder="Enter achievement"
                    />
                    <button onClick={() => removeArrayItem('achievements', index)} className="remove-btn">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="bottom-navigation">
          <div className="nav-controls">
            <button 
              onClick={goToPreviousSection} 
              disabled={!canGoPrevious}
              className="btn btn-outline btn-nav"
            >
              <i className="fas fa-chevron-left"></i>
              Previous
            </button>

            <div className="center-actions">
              <button onClick={saveChanges} disabled={saving} className="btn btn-primary">
                <i className="fas fa-save"></i>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={createPortfolio} className="btn btn-outline">
                <i className="fas fa-magic"></i>
                Create Portfolio
              </button>
            </div>

            <button 
              onClick={goToNextSection} 
              disabled={!canGoNext}
              className="btn btn-primary btn-nav"
            >
              Next
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
