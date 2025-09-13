import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthService } from '../services/authService';
import './ResumeTemplatePreview.css';

interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    website: string;
  };
  about: {
    paragraph1: string;
    paragraph2: string;
  };
  experience: Array<{
    position: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    description: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    link: string;
  }>;
  achievements: string[];
}

interface Template {
  id: number;
  name: string;
  description: string;
  previewUrl: string;
  deploymentUrl: string;
}

const templates: Template[] = [
  {
    id: 1,
    name: "Modern Professional",
    description: "Clean, minimalist design perfect for developers and tech professionals",
    previewUrl: "/portfolio-templates/modern-professional/index.html",
    deploymentUrl: "/portfolio-templates/modern-professional/index.html"
  },
  {
    id: 2,
    name: "Creative Plus", 
    description: "Vibrant and creative design for designers and creative professionals",
    previewUrl: "https://gradfolio-previews.s3.amazonaws.com/creative/preview.html",
    deploymentUrl: "/templates/creative/index.html"
  }
];

const ResumeTemplatePreview: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [deployedUrl, setDeployedUrl] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

  useEffect(() => {
    loadUserAndData();

    // Handle window resize for mobile detection
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadUserAndData = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);

      // Get resume data from query params or localStorage
      const dataParam = searchParams.get('data');
      if (dataParam) {
        const data = JSON.parse(decodeURIComponent(dataParam));
        setResumeData(data);
      } else {
        // Try to get from localStorage
        const savedData = localStorage.getItem(`resume_data_${currentUser.username}`);
        if (savedData) {
          setResumeData(JSON.parse(savedData));
        } else {
          // No data available, redirect back
          navigate('/dashboard');
          return;
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const generatePreviewData = () => {
    if (!resumeData) return {};
    
    return {
      // Transform resume data to template format
      name: resumeData.personal.fullName,
      email: resumeData.personal.email,
      phone: resumeData.personal.phone,
      linkedin: resumeData.personal.linkedin,
      github: resumeData.personal.github,
      website: resumeData.personal.website,
      about: resumeData.about.paragraph1 + ' ' + resumeData.about.paragraph2,
      experience: resumeData.experience,
      education: resumeData.education,
      skills: [...resumeData.skills.technical, ...resumeData.skills.soft],
      projects: resumeData.projects,
      achievements: resumeData.achievements
    };
  };

  const handleTemplateChange = (template: Template) => {
    setSelectedTemplate(template);
    setDeploymentStatus('idle');
    setDeployedUrl('');
  };

  const handlePreviewInNewTab = () => {
    const previewData = generatePreviewData();
    const previewUrl = selectedTemplate.previewUrl + '?data=' + encodeURIComponent(JSON.stringify(previewData)) + '&mobile=' + (isMobile ? 'true' : 'false');
    window.open(previewUrl, '_blank');
  };

  const handleDeployPortfolio = async () => {
    if (!user || !resumeData) return;

    setIsDeploying(true);
    setDeploymentStatus('deploying');

    try {
      const response = await fetch('/api/portfolio-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deploy',
          userId: user.id,
          username: user.username,
          templateId: selectedTemplate.id,
          resumeData: resumeData,
          templateData: generatePreviewData()
        }),
      });

      const result = await response.json();

      if (result.success) {
        setDeploymentStatus('success');
        setDeployedUrl(result.portfolioUrl);
        
        // Update user's portfolio status
        localStorage.setItem(`portfolio_url_${user.username}`, result.portfolioUrl);
      } else {
        throw new Error(result.error || 'Deployment failed');
      }
    } catch (error) {
      console.error('Deployment error:', error);
      setDeploymentStatus('error');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="resume-template-preview loading">
        <div className="loading-spinner"></div>
        <p>Loading preview...</p>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="resume-template-preview error">
        <h2>No Resume Data Found</h2>
        <p>Please upload your resume first.</p>
        <button onClick={handleBackToDashboard} className="back-btn">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="resume-template-preview">
      <div className="preview-header">
        <button onClick={handleBackToDashboard} className="back-button">
          <i className="fas fa-arrow-left"></i>
          Back to Dashboard
        </button>
        <div className="header-content">
          <h1>Preview Your Portfolio</h1>
          <p>See how your resume data looks in different templates</p>
        </div>
      </div>

      <div className="preview-container">
        {/* Template Selector */}
        <div className="template-tabs">
          {templates.map((template) => (
            <button
              key={template.id}
              className={`template-tab ${selectedTemplate.id === template.id ? 'active' : ''}`}
              onClick={() => handleTemplateChange(template)}
            >
              <div className="tab-content">
                <h3>{template.name}</h3>
                <p>{template.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Preview Frame */}
        <div className="preview-section">
          <div className="preview-frame">
            <div className="preview-toolbar">
              <div className="preview-controls">
                <span className="preview-label">Preview: {selectedTemplate.name}</span>
                <button 
                  onClick={handlePreviewInNewTab}
                  className="preview-external-btn"
                >
                  <i className="fas fa-external-link-alt"></i>
                  Open in New Tab
                </button>
              </div>
            </div>
            
            <iframe
              src={selectedTemplate.previewUrl + '?data=' + encodeURIComponent(JSON.stringify(generatePreviewData())) + '&mobile=' + (isMobile ? 'true' : 'false')}
              className="preview-iframe"
              title={`${selectedTemplate.name} Preview`}
              style={{
                transform: isMobile ? 'scale(0.75)' : 'scale(1)',
                transformOrigin: 'top left',
                width: isMobile ? '133%' : '100%',
                height: isMobile ? '133%' : '100%'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="preview-actions">
            {deploymentStatus === 'idle' && (
              <div className="action-group">
                <div className="action-info">
                  <h3>Ready to Launch?</h3>
                  <p>Deploy your portfolio to get a shareable URL</p>
                </div>
                <button 
                  onClick={handleDeployPortfolio}
                  className="deploy-btn primary"
                  disabled={isDeploying}
                >
                  <i className="fas fa-rocket"></i>
                  Deploy My Portfolio
                </button>
              </div>
            )}

            {deploymentStatus === 'deploying' && (
              <div className="deployment-status deploying">
                <div className="loading-spinner"></div>
                <div>
                  <h3>Deploying Your Portfolio...</h3>
                  <p>This may take a few moments</p>
                </div>
              </div>
            )}

            {deploymentStatus === 'success' && (
              <div className="deployment-status success">
                <div className="success-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div>
                  <h3>Portfolio Deployed Successfully!</h3>
                  <p>Your portfolio is now live and ready to share</p>
                  <div className="deployed-url">
                    <input 
                      type="text" 
                      value={deployedUrl} 
                      readOnly 
                      className="url-input"
                    />
                    <button 
                      onClick={() => navigator.clipboard.writeText(deployedUrl)}
                      className="copy-btn"
                    >
                      <i className="fas fa-copy"></i>
                    </button>
                    <button 
                      onClick={() => window.open(deployedUrl, '_blank')}
                      className="visit-btn"
                    >
                      <i className="fas fa-external-link-alt"></i>
                      Visit
                    </button>
                  </div>
                </div>
              </div>
            )}

            {deploymentStatus === 'error' && (
              <div className="deployment-status error">
                <div className="error-icon">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div>
                  <h3>Deployment Failed</h3>
                  <p>Something went wrong. Please try again.</p>
                  <button 
                    onClick={() => setDeploymentStatus('idle')}
                    className="retry-btn"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Data Summary */}
        <div className="data-summary">
          <h3>Your Data Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Name:</span>
              <span className="summary-value">{resumeData.personal.fullName}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Experience:</span>
              <span className="summary-value">{resumeData.experience.length} positions</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Education:</span>
              <span className="summary-value">{resumeData.education.length} entries</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Skills:</span>
              <span className="summary-value">{resumeData.skills.technical.length + resumeData.skills.soft.length} skills</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Projects:</span>
              <span className="summary-value">{resumeData.projects.length} projects</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplatePreview;