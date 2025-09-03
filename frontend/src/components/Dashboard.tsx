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
      // Check if user has an existing portfolio by trying to access it
      const response = await fetch(`/u/${user.username}`, { method: 'HEAD' });
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

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMessage('File size too large. Please upload a file smaller than 10MB.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    setMessage('Processing your resume...');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('userId', user.id);
      formData.append('username', user.username);

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Resume processed successfully! Creating your portfolio...');
        // Redirect to template admin with pre-filled data
        const adminUrl = `/landing_1/admin.html?auth=true&username=${user.username}&resumeData=${encodeURIComponent(JSON.stringify(result.data))}`;
        setTimeout(() => {
          window.location.href = adminUrl;
        }, 1500);
      } else {
        setMessage(result.message || 'Failed to process resume. Please try again.');
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (error) {
      console.error('Resume upload error:', error);
      setMessage('Failed to upload resume. Please try again.');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInLogin = async () => {
    console.log('LinkedIn Connect clicked');
    setLoading(true);
    setMessage('Connecting to LinkedIn...');

    try {
      // Create LinkedIn OAuth URL
      const clientId = process.env.REACT_APP_LINKEDIN_CLIENT_ID;
      console.log('LinkedIn Client ID configured:', !!clientId);
      
      const redirectUri = encodeURIComponent(`${window.location.origin}/api/linkedin-callback`);
      const scope = encodeURIComponent('r_liteprofile r_emailaddress');
      const state = encodeURIComponent(JSON.stringify({ userId: user.id, username: user.username }));

      console.log('LinkedIn OAuth config:', {
        clientId: clientId ? 'configured' : 'missing',
        redirectUri: decodeURIComponent(redirectUri),
        scope: decodeURIComponent(scope)
      });

      if (!clientId) {
        setMessage('LinkedIn integration not configured. Please add REACT_APP_LINKEDIN_CLIENT_ID to environment variables.');
        setTimeout(() => setMessage(''), 5000);
        setLoading(false);
        return;
      }

      const linkedinUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
      
      console.log('Redirecting to LinkedIn:', linkedinUrl.substring(0, 100) + '...');
      
      // Redirect to LinkedIn OAuth
      window.location.href = linkedinUrl;
      
    } catch (error) {
      console.error('LinkedIn login error:', error);
      setMessage('Failed to connect to LinkedIn. Please try again.');
      setTimeout(() => setMessage(''), 5000);
      setLoading(false);
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
          <div className="portfolio-creation">
            <div className="creation-header">
              <h2>Quick Portfolio Creation</h2>
              <p>Get started instantly with one of these easy options</p>
            </div>
            
            <div className="creation-options">
              <div className="creation-card">
                <div className="creation-icon">
                  <i className="fas fa-file-upload"></i>
                </div>
                <h3>Upload Resume</h3>
                <p>Upload your resume and we'll automatically create your portfolio</p>
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  onChange={handleResumeUpload}
                />
                <button 
                  onClick={() => document.getElementById('resume-upload')?.click()}
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Upload Resume'}
                </button>
              </div>

              <div className="creation-card">
                <div className="creation-icon">
                  <i className="fab fa-linkedin"></i>
                </div>
                <h3>Import from LinkedIn</h3>
                <p>Connect your LinkedIn profile to auto-fill your portfolio</p>
                <button 
                  onClick={handleLinkedInLogin}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Connect LinkedIn
                </button>
              </div>
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
                  onClick={() => window.open('https://gradfolio-previews.s3.amazonaws.com/modern/preview.html', '_blank')}
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
                  onClick={() => window.open('https://gradfolio-previews.s3.amazonaws.com/creative/preview.html', '_blank')}
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