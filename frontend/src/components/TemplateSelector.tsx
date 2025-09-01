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
    name: "Modern Professional",
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
    name: "Creative Portfolio",
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
    name: "Corporate Elite",
    description: "Professional business-style template for corporate professionals",
    features: [
      "Corporate blue theme",
      "Executive layout design",
      "Achievement highlights",
      "Professional timeline",
      "Business card integration"
    ],
    image: "/landing_3/preview.png",
    adminUrl: "/landing_3/admin.html",
    previewUrl: "/landing_3/index.html",
    badge: "Coming Soon"
  }
];

const TemplateSelector: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const navigate = useNavigate();

  const handleTemplateSelect = async (template: Template) => {
    if (template.id === 3) {
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
    
    // Show payment page instead of directly going to admin
    setSelectedTemplate(template);
    setShowPayment(true);
  };

  const handleCancelPayment = () => {
    setShowPayment(false);
    setSelectedTemplate(null);
  };

  const handlePreview = (template: Template, event: React.MouseEvent) => {
    event.stopPropagation();
    if (template.id === 3) {
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

  // Show payment page if template is selected
  if (showPayment && selectedTemplate) {
    return <PaymentPage template={selectedTemplate} onCancel={handleCancelPayment} />;
  }

  return (
    <>

    <div className="template-selector">
      <div className="template-selector-container">
        <div className="template-header">
          <button className="back-button" onClick={() => window.history.back()}>
            <i className="fas fa-arrow-left"></i>
            Back to Home
          </button>
          <br />
          <div className="header-content">
            <h1>Choose Your Portfolio Template</h1>
            <p>Select a template that best represents your professional style and showcase your work beautifully</p>
          </div>
        </div>

        <div className="templates-grid">
          {templates.map((template) => (
            <div 
              key={template.id} 
              className={`template-card ${template.id === 3 ? 'coming-soon' : ''}`}
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
                          <div className="nav-logo">Portfolio</div>
                          <div className="nav-links">
                            <span></span><span></span><span></span>
                          </div>
                        </div>
                      </div>
                      <div className="preview-content">
                        <div className="hero-section">
                          <div className="hero-title">Create Your Professional</div>
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
                          <div className="nav-brand">Creative</div>
                          <div className="nav-menu">
                            <span></span><span></span>
                          </div>
                        </div>
                      </div>
                      <div className="preview-content">
                        <div className="creative-hero">
                          <div className="creative-title">Creative Portfolio</div>
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
                          <div className="nav-brand">Corporate</div>
                          <div className="nav-links">
                            <span></span><span></span><span></span>
                          </div>
                        </div>
                      </div>
                      <div className="preview-content">
                        <div className="corporate-hero">
                          <div className="corporate-title">Professional Business</div>
                          <div className="corporate-stats">
                            <div className="stat"></div>
                            <div className="stat"></div>
                            <div className="stat"></div>
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
                    disabled={template.id === 3}
                  >
                    {template.id === 3 ? 'Soon' : 'Preview'}
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
                    className={`select-btn ${template.id === 3 ? 'disabled' : ''}`}
                    disabled={template.id === 3}
                  >
                    {template.id === 3 ? 'Coming Soon' : 'Choose This Template'}
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
                  <th>Modern Professional</th>
                  <th>Creative Portfolio</th>
                  <th>Corporate Elite</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Theme Style</td>
                  <td>Dark + Gold</td>
                  <td>Colorful Gradients</td>
                  <td>Corporate Blue</td>
                </tr>
                <tr>
                  <td>Best For</td>
                  <td>Developers, Tech</td>
                  <td>Designers, Creative</td>
                  <td>Business, Corporate</td>
                </tr>
                <tr>
                  <td>Animations</td>
                  <td>Particle Effects</td>
                  <td>Creative Transitions</td>
                  <td>Subtle Professional</td>
                </tr>
                <tr>
                  <td>Customization</td>
                  <td>High</td>
                  <td>High</td>
                  <td>High</td>
                </tr>
                <tr>
                  <td>Mobile Responsive</td>
                  <td>✓</td>
                  <td>✓</td>
                  <td>✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
        </>
  );
};

export default TemplateSelector;