import React, { useState, useEffect } from 'react';
import './Dashboard.css';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if user has a portfolio
    checkExistingPortfolio();
  }, [user]);

  const checkExistingPortfolio = async () => {
    try {
      const response = await fetch(`/.netlify/functions/portfolio/${user.username}`);
      if (response.ok) {
        setPortfolioUrl(`${window.location.origin}/u/${user.username}`);
      }
    } catch (error) {
      console.log('No existing portfolio found');
    }
  };

  const handleCreatePortfolio = (templateType: string) => {
    // Redirect to template admin with auth context
    const adminUrl = `${window.location.origin}/${templateType}/admin.html?auth=true&username=${user.username}`;
    window.location.href = adminUrl;
  };

  const handleViewPortfolio = () => {
    if (portfolioUrl) {
      window.open(portfolioUrl, '_blank');
    }
  };

  const copyPortfolioUrl = () => {
    if (portfolioUrl) {
      navigator.clipboard.writeText(portfolioUrl);
      setMessage('Portfolio URL copied to clipboard!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="user-info">
          <h1>Welcome, {user.username}!</h1>
          <p>Manage your professional portfolio</p>
        </div>
        <button onClick={onLogout} className="logout-btn">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>

      <div className="dashboard-content">
        {portfolioUrl ? (
          <div className="portfolio-status">
            <div className="status-card active">
              <div className="status-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3>Portfolio Active</h3>
              <p>Your portfolio is live and accessible</p>
              <div className="portfolio-url">
                <input 
                  type="text" 
                  value={portfolioUrl} 
                  readOnly 
                  className="url-input"
                />
                <button onClick={copyPortfolioUrl} className="copy-btn">
                  <i className="fas fa-copy"></i>
                </button>
              </div>
              <div className="portfolio-actions">
                <button onClick={handleViewPortfolio} className="btn btn-primary">
                  <i className="fas fa-eye"></i> View Portfolio
                </button>
                <button onClick={() => handleCreatePortfolio('landing_1')} className="btn btn-secondary">
                  <i className="fas fa-edit"></i> Edit Portfolio
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="portfolio-status">
            <div className="status-card inactive">
              <div className="status-icon">
                <i className="fas fa-plus-circle"></i>
              </div>
              <h3>Create Your Portfolio</h3>
              <p>Choose a template to get started</p>
            </div>
          </div>
        )}

        <div className="templates-section">
          <h2>Portfolio Templates</h2>
          <div className="templates-grid">
            <div className="template-card">
              <div className="template-preview modern-preview">
                <div className="preview-content">
                  <h4>Modern Professional</h4>
                  <p>Clean, dark theme perfect for developers</p>
                </div>
              </div>
              <div className="template-actions">
                <button 
                  onClick={() => window.open(`${window.location.origin}/landing_1/preview.html`, '_blank')}
                  className="btn btn-outline"
                >
                  Preview
                </button>
                <button 
                  onClick={() => handleCreatePortfolio('landing_1')}
                  className="btn btn-primary"
                >
                  {portfolioUrl ? 'Edit' : 'Create'}
                </button>
              </div>
            </div>

            <div className="template-card">
              <div className="template-preview creative-preview">
                <div className="preview-content">
                  <h4>Creative Portfolio</h4>
                  <p>Vibrant design for creative professionals</p>
                </div>
              </div>
              <div className="template-actions">
                <button 
                  onClick={() => window.open(`${window.location.origin}/landing_2/preview.html`, '_blank')}
                  className="btn btn-outline"
                >
                  Preview
                </button>
                <button 
                  onClick={() => handleCreatePortfolio('landing_2')}
                  className="btn btn-primary"
                >
                  {portfolioUrl ? 'Switch Template' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-link"></i>
              <h4>Custom URL</h4>
              <p>Get your personalized portfolio URL</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-palette"></i>
              <h4>Customizable</h4>
              <p>Full control over content and styling</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-mobile-alt"></i>
              <h4>Responsive</h4>
              <p>Works perfectly on all devices</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-download"></i>
              <h4>Download</h4>
              <p>Export your portfolio source code</p>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="message-toast">
          {message}
        </div>
      )}
    </div>
  );
};

export default Dashboard;