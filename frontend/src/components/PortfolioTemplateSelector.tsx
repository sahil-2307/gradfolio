import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMobileDetection } from '../hooks/useMobileDetection';
import './PortfolioTemplateSelector.css';

interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
  tags: string[];
  isPopular?: boolean;
  isPremium?: boolean;
}

const PortfolioTemplateSelector: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isMobile } = useMobileDetection();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const username = searchParams.get('username');

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

  const templates: Template[] = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean, minimalist design with smooth animations and modern typography',
      image: '/api/placeholder/400/300?text=Modern',
      tags: ['Clean', 'Professional', 'Animations'],
      isPopular: true
    },
    {
      id: 'creative',
      name: 'Creative Portfolio',
      description: 'Bold colors and creative layouts perfect for designers and artists',
      image: '/api/placeholder/400/300?text=Creative',
      tags: ['Colorful', 'Creative', 'Artistic'],
    },
    {
      id: 'developer',
      name: 'Developer Focus',
      description: 'Code-oriented design with syntax highlighting and project showcases',
      image: '/api/placeholder/400/300?text=Developer',
      tags: ['Technical', 'Code', 'Projects'],
      isPopular: true
    },
    {
      id: 'business',
      name: 'Business Executive',
      description: 'Professional corporate design for business professionals and executives',
      image: '/api/placeholder/400/300?text=Business',
      tags: ['Corporate', 'Executive', 'Formal']
    },
    {
      id: 'minimal',
      name: 'Minimal Elegance',
      description: 'Ultra-clean minimal design focusing on content and readability',
      image: '/api/placeholder/400/300?text=Minimal',
      tags: ['Minimal', 'Clean', 'Simple']
    },
    {
      id: 'glassmorphism',
      name: 'Glassmorphism',
      description: 'Modern glass-like effects with blurred backgrounds and transparency',
      image: '/api/placeholder/400/300?text=Glass',
      tags: ['Modern', 'Glass', 'Effects'],
      isPremium: true
    }
  ];

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleGeneratePortfolio = async () => {
    if (!selectedTemplate || !username) return;

    setIsGenerating(true);
    
    try {
      // Get the portfolio data from localStorage
      const portfolioData = localStorage.getItem(`portfolio_data_${username}`);
      
      if (!portfolioData) {
        throw new Error('Portfolio data not found. Please go back and regenerate.');
      }

      // For now, we'll use our existing portfolio preview with the selected template
      // In the future, you can create different template components
      const portfolioUrl = `${window.location.origin}/resume-generator?username=${username}&template=${selectedTemplate}`;
      window.open(portfolioUrl, '_blank');
      
    } catch (error) {
      console.error('Error generating portfolio:', error);
      alert('Failed to generate portfolio. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const goBack = () => {
    navigate('/resume-preview');
  };

  return (
    <div className={`template-selector-container${isMobile ? ' mobile' : ''}${isDarkMode ? ' dark' : ''}`}>
      {/* Header */}
      <div className="template-header">
        <div className="header-content">
          <button onClick={goBack} className="back-btn">
            <i className="fas fa-arrow-left"></i>
            Back to Resume
          </button>
          
          <button onClick={toggleTheme} className="theme-toggle">
            <div className={`toggle-track${isDarkMode ? ' dark' : ''}`}>
              <div className={`toggle-thumb${isDarkMode ? ' dark' : ' light'}`}></div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="template-content">
        <div className="template-hero">
          <h1>Choose Your Portfolio Template</h1>
          <p>Select a template that best represents your style and profession</p>
        </div>

        {/* Template Grid */}
        <div className="templates-grid">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`template-card${selectedTemplate === template.id ? ' selected' : ''}`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              {template.isPopular && (
                <div className="template-badge popular">Popular</div>
              )}
              {template.isPremium && (
                <div className="template-badge premium">Premium</div>
              )}
              
              <div className="template-image">
                <img src={template.image} alt={template.name} />
                <div className="template-overlay">
                  <button className="preview-btn">
                    <i className="fas fa-eye"></i>
                    Preview
                  </button>
                </div>
              </div>
              
              <div className="template-info">
                <h3>{template.name}</h3>
                <p>{template.description}</p>
                <div className="template-tags">
                  {template.tags.map((tag, index) => (
                    <span key={index} className="template-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Generate Button */}
        <div className="generate-section">
          <button
            onClick={handleGeneratePortfolio}
            disabled={!selectedTemplate || isGenerating}
            className={`generate-btn${!selectedTemplate ? ' disabled' : ''}`}
          >
            {isGenerating ? (
              <>
                <div className="btn-spinner"></div>
                Generating Portfolio...
              </>
            ) : (
              <>
                <i className="fas fa-magic"></i>
                Generate My Portfolio
              </>
            )}
          </button>
          
          {selectedTemplate && (
            <p className="selection-info">
              Selected: <strong>{templates.find(t => t.id === selectedTemplate)?.name}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioTemplateSelector;