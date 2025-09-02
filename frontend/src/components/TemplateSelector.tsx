import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TemplateSelector.css';
import PaymentPage from './PaymentPage';
import { AuthService } from '../services/authService';

interface Template {
  id: number;
  name: string;
  description: string;
  features: string[];
  image: string;
  adminUrl: string;
  previewUrl: string;
  badge?: string;
}

const templates: Template[] = [
  {
    id: 1,
    name: "Basic",
    description: "Clean, minimalist design perfect for developers and tech professionals",
    features: [
      "Dark theme with gold accents",
      "Animated particles background",
      "Interactive project showcase",
      "Skills visualization",
      "Contact form integration"
    ],
    image: "/landing_1/preview.png",
    adminUrl: "/landing_1/admin.html",
    previewUrl: "/landing_1/preview.html",
    badge: "Most Popular"
  },
  {
    id: 2,
    name: "Plus",
    description: "Vibrant and creative design for designers and creative professionals",
    features: [
      "Colorful gradient themes",
      "Image gallery showcase",
      "Creative animations",
      "Portfolio grid layout",
      "Social media integration"
    ],
    image: "/landing_2/preview.png",
    adminUrl: "/landing_2/admin.html",
    previewUrl: "/landing_2/preview.html",
    badge: "New"
  },
  {
    id: 3,
    name: "Pro",
    description: "Advanced professional template with premium features and customization",
    features: [
      "Advanced customization options",
      "Premium animations and effects",
      "Multi-language support",
      "Advanced SEO optimization",
      "Priority customer support"
    ],
    image: "/landing_3/preview.png",
    adminUrl: "/landing_3/admin.html",
    previewUrl: "/landing_3/index.html",
    badge: "Coming Soon"
  },
  {
    id: 4,
    name: "Executive",
    description: "Elite business template for C-level executives and senior professionals",
    features: [
      "Executive dashboard layout",
      "Premium business themes",
      "Advanced analytics integration",
      "Custom branding options",
      "White-label solutions"
    ],
    image: "/landing_4/preview.png",
    adminUrl: "/landing_4/admin.html",
    previewUrl: "/landing_4/index.html",
    badge: "Coming Soon"
  }
];

const TemplateSelector: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [isParsingLoading, setIsParsingLoading] = useState(false);

  const navigate = useNavigate();

  const handleTemplateSelect = async (template: Template) => {
    if (template.id === 3 || template.id === 4) {
      alert('This template is coming soon! Please choose another template.');
      return;
    }
    
    // Check if user is authenticated
    const isAuthenticated = await AuthService.isAuthenticated();
    if (!isAuthenticated) {
      // Redirect to login page
      navigate('/login');
      return;
    }

    // Check if user has already paid for this template
    const user = await AuthService.getCurrentUser();
    if (user) {
      try {
        const response = await fetch(`/api/check-access?userId=${user.id}&templateId=${template.id}`);
        const accessData = await response.json();
        
        if (accessData.success && accessData.hasTemplateAccess) {
          // User has already paid for this template, redirect directly to admin
          window.location.href = template.adminUrl;
          return;
        }
      } catch (error) {
        console.error('Error checking access:', error);
        // Continue to payment page if check fails
      }
    }
    
    // Show payment page for new purchase
    setSelectedTemplate(template);
    setShowPayment(true);
  };

  const handleCancelPayment = () => {
    setShowPayment(false);
    setSelectedTemplate(null);
  };

  const handlePreview = (template: Template, event: React.MouseEvent) => {
    event.stopPropagation();
    if (template.id === 3 || template.id === 4) {
      alert('This template is coming soon!');
      return;
    }
    // Use S3 URLs for previews - updated with working S3 bucket
    let previewUrl = '';
    if (template.id === 1) {
      previewUrl = 'https://gradfolio-previews.s3.amazonaws.com/modern/preview.html';
    } else if (template.id === 2) {
      previewUrl = 'https://gradfolio-previews.s3.amazonaws.com/creative/preview.html';
    }
    // Open preview in new tab
    window.open(previewUrl, '_blank');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setUploadedFile(file);
      parseResume(file);
    } else {
      alert('Please upload a PDF or Word document');
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setUploadedFile(file);
      parseResume(file);
    } else {
      alert('Please upload a PDF or Word document');
    }
  };

  const parseResume = async (file: File) => {
    setIsParsingLoading(true);
    try {
      // Create FormData to send file to backend
      const formData = new FormData();
      formData.append('resume', file);

      // Send request to backend API
      const response = await fetch('http://localhost:5001/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setParsedData(result.data.parsedData);
        console.log('Successfully parsed resume:', result.data);
      } else {
        throw new Error(result.error || 'Failed to parse resume');
      }
      
      setIsParsingLoading(false);
    } catch (error) {
      console.error('Error parsing resume:', error);
      setIsParsingLoading(false);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error parsing resume: ${errorMessage}. Make sure the backend server is running on port 5001.`);
    }
  };

  // Show payment page if template is selected
  if (showPayment && selectedTemplate) {
    return <PaymentPage template={selectedTemplate} onCancel={handleCancelPayment} />;
  }

  return (
    <div className="template-selector">
      <div className="template-selector-container">
        <div className="template-header">
          <button className="back-button" onClick={() => window.history.back()}>
            <i className="fas fa-arrow-left"></i>
            Back to Home
          </button>
          <br />
          <div className="sale-ribbon">
            <div className="ribbon-content">
              <div className="ribbon-icon"></div>
              <div className="ribbon-text">
                <div className="ribbon-title">
                  <span className="rotating-text">Stand Out for Half the Price.</span>
                  <span className="rotating-text">Launch Your Portfolio — 50% Off!</span>
                  <span className="rotating-text">50% Off. 100% Hireable.</span>
                  <span className="rotating-text">Fresh Grad? Fresh Deal!</span>
                  <span className="rotating-text">Career Launch Sale — 50% Off!</span>
                </div>
              </div>
              <div className="ribbon-badge">50% OFF</div>
            </div>
            <div className="ribbon-shine"></div>
          </div>
          
          <div className="header-content">
            <h1>Choose Your Portfolio Template</h1>
            <p>Select a template that best represents your professional style and showcase your work beautifully</p>
          </div>
        </div>

        <div className="templates-grid">
          {templates.map((template) => (
            <div 
              key={template.id} 
              className={`template-card ${template.id === 3 || template.id === 4 ? 'coming-soon' : ''}`}
              onClick={() => handleTemplateSelect(template)}
            >
              {template.badge && (
                <div className={`template-badge ${template.badge.toLowerCase().replace(' ', '-')}`}>
                  {template.badge}
                </div>
              )}
              
              <div className="template-preview">
                <div className="template-image">
                  {template.id === 1 && (
                    <div className="preview-mockup modern-preview">
                      <div className="preview-header">
                        <div className="preview-nav">
                          <div className="nav-logo">Basic</div>
                          <div className="nav-links">
                            <span></span><span></span><span></span>
                          </div>
                        </div>
                      </div>
                      <div className="preview-content">
                        <div className="hero-section">
                          <div className="hero-title">Clean & Professional</div>
                          <div className="hero-subtitle">Portfolio</div>
                          <div className="hero-particles">
                            <div className="particle"></div>
                            <div className="particle"></div>
                            <div className="particle"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {template.id === 2 && (
                    <div className="preview-mockup creative-preview">
                      <div className="preview-header">
                        <div className="creative-nav">
                          <div className="nav-brand">Plus</div>
                          <div className="nav-menu">
                            <span></span><span></span>
                          </div>
                        </div>
                      </div>
                      <div className="preview-content">
                        <div className="creative-hero">
                          <div className="creative-title">Creative Plus</div>
                          <div className="creative-grid">
                            <div className="grid-item"></div>
                            <div className="grid-item"></div>
                            <div className="grid-item"></div>
                            <div className="grid-item"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {template.id === 3 && (
                    <div className="preview-mockup corporate-preview">
                      <div className="coming-soon-overlay">
                        <div className="coming-soon-text">
                          <h3>Coming Soon</h3>
                          <p>This template is under development</p>
                        </div>
                      </div>
                      <div className="preview-header">
                        <div className="corporate-nav">
                          <div className="nav-brand">Pro</div>
                          <div className="nav-links">
                            <span></span><span></span><span></span>
                          </div>
                        </div>
                      </div>
                      <div className="preview-content">
                        <div className="corporate-hero">
                          <div className="corporate-title">Pro Business</div>
                          <div className="corporate-stats">
                            <div className="stat"></div>
                            <div className="stat"></div>
                            <div className="stat"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {template.id === 4 && (
                    <div className="preview-mockup executive-preview">
                      <div className="coming-soon-overlay">
                        <div className="coming-soon-text">
                          <h3>Coming Soon</h3>
                          <p>This template is under development</p>
                        </div>
                      </div>
                      <div className="preview-header">
                        <div className="executive-nav">
                          <div className="nav-brand">Executive</div>
                          <div className="nav-links">
                            <span></span><span></span><span></span><span></span>
                          </div>
                        </div>
                      </div>
                      <div className="preview-content">
                        <div className="executive-hero">
                          <div className="executive-title">Elite Business</div>
                          <div className="executive-features">
                            <div className="feature"></div>
                            <div className="feature"></div>
                            <div className="feature"></div>
                            <div className="feature"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="template-info">
                <div className="template-title">
                  <h3>{template.name}</h3>
                  <button 
                    className="preview-btn"
                    onClick={(e) => handlePreview(template, e)}
                    disabled={template.id === 3 || template.id === 4}
                  >
                    {template.id === 3 || template.id === 4 ? 'Soon' : 'Preview'}
                  </button>
                </div>
                
                <p className="template-description">{template.description}</p>
                
                <div className="template-features">
                  <h4>Features:</h4>
                  <ul>
                    {template.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="template-actions">
                  <button 
                    className={`select-btn ${template.id === 3 || template.id === 4 ? 'disabled' : ''}`}
                    disabled={template.id === 3 || template.id === 4}
                  >
                    {template.id === 3 || template.id === 4 ? 'Coming Soon' : 'Choose This Template'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="template-comparison">
          <h2>Compare Templates</h2>
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Basic</th>
                  <th>Plus</th>
                  <th>Pro</th>
                  <th>Executive</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Theme Style</td>
                  <td>Dark + Gold</td>
                  <td>Colorful Gradients</td>
                  <td>Advanced Professional</td>
                  <td>Premium Business</td>
                </tr>
                <tr>
                  <td>Best For</td>
                  <td>Developers, Tech</td>
                  <td>Designers, Creative</td>
                  <td>Advanced Professionals</td>
                  <td>C-Level Executives</td>
                </tr>
                <tr>
                  <td>Animations</td>
                  <td>Particle Effects</td>
                  <td>Creative Transitions</td>
                  <td>Premium Effects</td>
                  <td>Elite Animations</td>
                </tr>
                <tr>
                  <td>Customization</td>
                  <td>High</td>
                  <td>High</td>
                  <td>Advanced</td>
                  <td>White-label</td>
                </tr>
                <tr>
                  <td>Mobile Responsive</td>
                  <td>✓</td>
                  <td>✓</td>
                  <td>✓</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>Support</td>
                  <td>Standard</td>
                  <td>Standard</td>
                  <td>Priority</td>
                  <td>Dedicated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <br />

        {/* Resume Upload Section */}
        <div className="resume-upload-section">
          <h2>Quick Start: Upload Your Resume</h2>
          <p>Upload your resume and we'll automatically extract your information to populate your portfolio template</p>
          
          <div 
            className="resume-upload-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="upload-content">
              <i className="fas fa-cloud-upload-alt upload-icon"></i>
              <h3>Drag & Drop Your Resume Here</h3>
              <p>or</p>
              <label htmlFor="resume-upload" className="upload-button">
                Choose File
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
              <p className="upload-info">Supports PDF and Word documents (max 10MB)</p>
            </div>
          </div>

          {uploadedFile && (
            <div className="uploaded-file">
              <i className="fas fa-file-alt"></i>
              <span>{uploadedFile.name}</span>
              <button onClick={() => {setUploadedFile(null); setParsedData(null);}}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}

          {isParsingLoading && (
            <div className="parsing-status">
              <div className="loading-spinner"></div>
              <p>Parsing your resume...</p>
            </div>
          )}

          {parsedData && (
            <div className="parsed-data-section">
              <h3>Extracted Data</h3>
              <div className="json-display">
                <pre>{JSON.stringify(parsedData, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;