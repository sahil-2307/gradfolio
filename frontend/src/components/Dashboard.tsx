import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkedInService, LinkedInData } from '../services/linkedinService';
import LinkedInPreview from './LinkedInPreview';
import './Dashboard.css';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [hasLinkedInData, setHasLinkedInData] = useState(false);
  const [linkedInData, setLinkedInData] = useState<any>(null);

  useEffect(() => {
    // Check if user has a portfolio
    checkExistingPortfolio();
    // Check if user has LinkedIn data
    checkLinkedInData();
  }, [user]);

  const checkLinkedInData = async () => {
    if (user?.username) {
      const hasData = await LinkedInService.hasLinkedInData(user.username);
      setHasLinkedInData(hasData);
      
      if (hasData) {
        // Fetch the actual LinkedIn data for preview
        const result = await LinkedInService.getLinkedInData(user.username);
        if (result.success && result.data) {
          setLinkedInData(result.data);
        }
      }
    }
  };

  const checkExistingPortfolio = async () => {
    try {
      console.log('Checking existing portfolio for user:', user.username);
      
      // Check if user has an existing portfolio by trying to access it
      const response = await fetch(`/u/${user.username}`, {
        method: 'HEAD' // Use HEAD to avoid downloading full HTML
      });
      
      console.log('Portfolio check response:', {
        status: response.status,
        ok: response.ok,
        url: `/u/${user.username}`
      });
      
      if (response.ok) {
        // If HEAD request succeeds, portfolio likely exists
        const portfolioUrl = `${window.location.origin}/u/${user.username}`;
        console.log('Valid portfolio found, setting URL:', portfolioUrl);
        setPortfolioUrl(portfolioUrl);
      } else {
        console.log('No portfolio found for user:', user.username);
      }
    } catch (error) {
      console.log('Error checking portfolio:', error);
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
    setMessage('Checking LinkedIn service availability...');

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
        setMessage('LinkedIn integration not configured. Please use the sample data option below to see how it works.');
        setTimeout(() => setMessage(''), 5000);
        setLoading(false);
        return;
      }

      // First, check if LinkedIn OAuth endpoint is accessible
      setMessage('Testing LinkedIn connectivity...');
      
      try {
        const testResponse = await fetch('https://www.linkedin.com/oauth/v2/authorization', {
          method: 'HEAD',
          mode: 'no-cors'
        });
        console.log('LinkedIn connectivity test completed');
      } catch (connectivityError) {
        console.warn('LinkedIn connectivity test failed:', connectivityError);
        setMessage('LinkedIn service appears to be experiencing issues. You can try connecting anyway or use sample data.');
      }

      const linkedinUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
      
      console.log('LinkedIn OAuth URL Details:', {
        fullUrl: linkedinUrl,
        redirectUri: decodeURIComponent(redirectUri),
        origin: window.location.origin,
        currentUrl: window.location.href
      });
      
      setMessage('Opening LinkedIn authentication...');
      
      // Try multiple approaches for better reliability
      let authWindow: Window | null = null;
      
      // Approach 1: Try popup with specific parameters for better compatibility
      try {
        authWindow = window.open(
          linkedinUrl, 
          'linkedin-oauth',
          'width=500,height=600,left=' + (window.screen.width / 2 - 250) + ',top=' + (window.screen.height / 2 - 300) + ',scrollbars=yes,resizable=yes,status=yes,location=yes'
        );
      } catch (popupError) {
        console.warn('Popup creation failed:', popupError);
        authWindow = null;
      }
      
      if (!authWindow || authWindow.closed) {
        // Approach 2: Direct redirect with user confirmation
        setMessage('Popup blocked or failed. Click OK to redirect to LinkedIn authentication.');
        const userConfirmed = window.confirm('LinkedIn authentication requires opening a new page. Click OK to continue or Cancel to use sample data instead.');
        
        if (userConfirmed) {
          setMessage('Redirecting to LinkedIn...');
          setTimeout(() => {
            window.location.href = linkedinUrl;
          }, 1000);
        } else {
          setLoading(false);
          setMessage('LinkedIn connection cancelled. You can use sample data to see how the feature works.');
          setTimeout(() => setMessage(''), 5000);
        }
        return;
      }
      
      // Monitor popup for completion with better error handling
      let checkInterval: NodeJS.Timeout;
      let timeoutId: NodeJS.Timeout;
      
      const cleanup = () => {
        if (checkInterval) clearInterval(checkInterval);
        if (timeoutId) clearTimeout(timeoutId);
      };
      
      checkInterval = setInterval(() => {
        try {
          if (authWindow && authWindow.closed) {
            cleanup();
            setLoading(false);
            setMessage('LinkedIn authentication window closed. Checking for imported data...');
            
            // Check if LinkedIn data was successfully imported
            setTimeout(() => {
              checkLinkedInData();
              setMessage('');
            }, 2000);
          } else if (authWindow) {
            // Check if we can access the window URL (same origin)
            try {
              const currentUrl = authWindow.location.href;
              if (currentUrl.includes('/dashboard')) {
                // User was redirected back to dashboard, close popup
                authWindow.close();
              }
            } catch (e) {
              // Cross-origin error is expected during OAuth flow
            }
          }
        } catch (error) {
          console.warn('Error monitoring auth window:', error);
        }
      }, 1000);
      
      // Auto-close after 10 minutes with better messaging
      timeoutId = setTimeout(() => {
        cleanup();
        if (authWindow && !authWindow.closed) {
          authWindow.close();
        }
        setLoading(false);
        setMessage('LinkedIn authentication timed out. This might be due to LinkedIn service issues. Try again later or use sample data.');
        setTimeout(() => setMessage(''), 8000);
      }, 600000);
      
    } catch (error) {
      console.error('LinkedIn login error:', error);
      setMessage('LinkedIn service is currently experiencing issues. Please try again later or use the sample data option to see how the feature works.');
      setTimeout(() => setMessage(''), 8000);
      setLoading(false);
    }
  };

  const handleCreatePortfolioWithLinkedIn = () => {
    // Navigate to templates page with LinkedIn data flag
    navigate('/templates?source=linkedin');
  };

  // Test function to add sample LinkedIn data
  const addTestLinkedInData = async () => {
    const testData: LinkedInData = {
      personal: {
        fullName: 'Sahil Bhujbal',
        email: 'sahil@example.com',
        phone: '+1 (555) 123-4567',
        linkedin: 'https://linkedin.com/in/sahilbhujbal',
        github: 'https://github.com/sahil-2307',
        website: 'https://sahilbhujbal.dev'
      },
      about: {
        paragraph1: 'Passionate Computer Science graduate with expertise in full-stack development and AI/ML technologies.',
        paragraph2: 'Experienced in building scalable web applications and working with modern development frameworks.'
      },
      experience: [
        {
          position: 'Full Stack Developer',
          company: 'Tech Solutions Inc',
          duration: '2023 - Present',
          description: 'Developed and maintained web applications using React, Node.js, and MongoDB. Led a team of 3 developers on multiple client projects.'
        },
        {
          position: 'Software Engineering Intern',
          company: 'StartupXYZ',
          duration: '2022 - 2023',
          description: 'Built responsive web interfaces and REST APIs. Improved application performance by 40% through code optimization.'
        }
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University of Technology',
          year: '2023',
          description: 'Graduated Magna Cum Laude with focus on Software Engineering and Machine Learning'
        }
      ],
      skills: {
        technical: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB', 'AWS', 'Docker', 'Git'],
        soft: ['Leadership', 'Problem Solving', 'Team Collaboration', 'Communication']
      },
      projects: [
        {
          title: 'E-commerce Platform',
          description: 'Full-stack e-commerce solution with payment integration and admin dashboard',
          technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
          link: 'https://github.com/sahil-2307/ecommerce'
        },
        {
          title: 'AI Chat Application',
          description: 'Real-time chat application with AI-powered responses using OpenAI API',
          technologies: ['React', 'Socket.io', 'OpenAI', 'Express'],
          link: 'https://github.com/sahil-2307/ai-chat'
        }
      ],
      achievements: [
        'Winner of University Hackathon 2023',
        'Published research paper on Machine Learning applications',
        'Contributed to 5+ open source projects'
      ]
    };

    console.log('Adding test LinkedIn data for user:', user.username);
    const result = await LinkedInService.storeLinkedInData(user.username, testData);
    console.log('Store result:', result);
    
    if (result.success) {
      setHasLinkedInData(true);
      setLinkedInData(testData);
      setMessage('Test LinkedIn data added successfully!');
      console.log('LinkedIn data state updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } else {
      console.error('Failed to store LinkedIn data:', result.error);
      setMessage('Failed to add test data. Please try again.');
      setTimeout(() => setMessage(''), 5000);
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
        {/* LinkedIn Data Section */}
        {hasLinkedInData && linkedInData && (
          <div className="linkedin-data-section">
            <div className="status-card linkedin">
              <div className="linkedin-header">
                <div className="status-icon">
                  <i className="fab fa-linkedin"></i>
                </div>
                <div className="linkedin-title">
                  <h3>LinkedIn Data Available</h3>
                  <p>Your LinkedIn profile has been imported and is ready to use</p>
                </div>
              </div>
              
              {/* LinkedIn Data Preview */}
              <div className="linkedin-preview">
                <div className="linkedin-personal">
                  <div className="personal-info">
                    <h4><i className="fas fa-user"></i> {linkedInData.personal?.fullName || 'Name not available'}</h4>
                    <p><i className="fas fa-envelope"></i> {linkedInData.personal?.email || 'Email not available'}</p>
                    {linkedInData.personal?.linkedin && (
                      <p><i className="fab fa-linkedin"></i> 
                        <a href={linkedInData.personal.linkedin} target="_blank" rel="noopener noreferrer">
                          LinkedIn Profile
                        </a>
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="linkedin-summary">
                  <div className="summary-stats">
                    <div className="stat-item">
                      <span className="stat-number">{linkedInData.experience?.length || 0}</span>
                      <span className="stat-label">Experience</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{linkedInData.education?.length || 0}</span>
                      <span className="stat-label">Education</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{(linkedInData.skills?.technical?.length || 0) + (linkedInData.skills?.soft?.length || 0)}</span>
                      <span className="stat-label">Skills</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{linkedInData.projects?.length || 0}</span>
                      <span className="stat-label">Projects</span>
                    </div>
                  </div>
                  
                  {linkedInData.about?.paragraph1 && (
                    <div className="about-preview">
                      <h5><i className="fas fa-info-circle"></i> About</h5>
                      <p>{linkedInData.about.paragraph1.substring(0, 200)}{linkedInData.about.paragraph1.length > 200 ? '...' : ''}</p>
                    </div>
                  )}
                  
                  {linkedInData.skills?.technical?.length > 0 && (
                    <div className="skills-preview">
                      <h5><i className="fas fa-code"></i> Top Skills</h5>
                      <div className="skill-tags-preview">
                        {linkedInData.skills.technical.slice(0, 6).map((skill: string, index: number) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                        {linkedInData.skills.technical.length > 6 && (
                          <span className="skill-tag more">+{linkedInData.skills.technical.length - 6} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="linkedin-actions">
                <button onClick={() => navigate('/linkedin-preview')} className="btn btn-outline">
                  <i className="fas fa-eye"></i> View Full Data
                </button>
                <button onClick={() => handleCreatePortfolioWithLinkedIn()} className="btn btn-primary">
                  <i className="fas fa-magic"></i> Create Portfolio from LinkedIn
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Show LinkedIn import option if no data */}
        {!hasLinkedInData && (
          <div className="linkedin-import-prompt">
            <div className="import-card">
              <div className="import-icon">
                <i className="fab fa-linkedin"></i>
              </div>
              <h3>Import from LinkedIn</h3>
              <p>Connect your LinkedIn profile to automatically populate your portfolio with professional data</p>
              <div className="linkedin-buttons">
                <button onClick={handleLinkedInLogin} className="btn btn-linkedin" disabled={loading}>
                  <i className="fab fa-linkedin"></i> {loading ? 'Connecting...' : 'Connect LinkedIn'}
                </button>
                <div className="divider-text">or try sample data first</div>
                <button onClick={addTestLinkedInData} className="btn btn-outline">
                  <i className="fas fa-flask"></i> Use Sample Data
                </button>
                <p className="helper-text">LinkedIn experiencing issues? Use sample data to see how your information would appear, then try connecting later</p>
              </div>
            </div>
          </div>
        )}

        {!portfolioUrl && (
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

            </div>
          </div>
        )}

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