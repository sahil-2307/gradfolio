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
  const [hasResumeData, setHasResumeData] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const [stats, setStats] = useState({
    resumesUploaded: 0,
    portfoliosDeveloped: 0,
    templatesAvailable: 3,
    portfolioUrls: 0
  });

  useEffect(() => {
    // Clear any existing data first to start fresh
    clearAllStoredData();
    // Then check if user has a portfolio
    checkExistingPortfolio();
    // Update stats
    updateStats();
  }, [user]);

  const updateStats = () => {
    if (user?.username) {
      // Check localStorage for stats
      const resumeData = localStorage.getItem(`resume_data_${user.username}`);
      const linkedinData = localStorage.getItem(`linkedin_data_${user.username}`);
      
      setStats(prev => ({
        ...prev,
        resumesUploaded: resumeData ? 1 : 0,
        portfoliosDeveloped: portfolioUrl ? 1 : 0,
        portfolioUrls: portfolioUrl ? 1 : 0
      }));
    }
  };

  const clearAllStoredData = () => {
    if (user?.username) {
      // Clear both LinkedIn and resume data to start fresh
      LinkedInService.clearLinkedInData(user.username);
      localStorage.removeItem(`resume_data_${user.username}`);
      setHasLinkedInData(false);
      setLinkedInData(null);
      setHasResumeData(false);
      setResumeData(null);
    }
  };

  const checkResumeData = () => {
    if (user?.username) {
      const storedResumeData = localStorage.getItem(`resume_data_${user.username}`);
      if (storedResumeData) {
        try {
          const data = JSON.parse(storedResumeData);
          setResumeData(data);
          setHasResumeData(true);
        } catch (error) {
          console.error('Error parsing resume data:', error);
          setHasResumeData(false);
        }
      } else {
        setHasResumeData(false);
      }
    }
  };

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
    // Always keep resume section visible
    setPortfolioUrl('');
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

      console.log('Resume parser response:', result);
      
      if (result.success) {
        console.log('Parsed resume data:', JSON.stringify(result.data, null, 2));
        setMessage('Resume processed successfully! Here\'s what we extracted:');
        
        // Display the parsed data in console and message
        const summary = `
Name: ${result.data.personal?.fullName || 'Not found'}
Email: ${result.data.personal?.email || 'Not found'}
Phone: ${result.data.personal?.phone || 'Not found'}
Experience: ${result.data.experience?.length || 0} entries
Education: ${result.data.education?.length || 0} entries
Skills: ${result.data.skills?.technical?.length || 0} technical skills
Projects: ${result.data.projects?.length || 0} projects
        `;
        
        console.log('Resume parsing summary:', summary);
        
        // Store the resume data for later use instead of immediately redirecting
        localStorage.setItem(`resume_data_${user.username}`, JSON.stringify(result.data));
        console.log('Stored resume data in localStorage for user:', user.username);
        console.log('Data being stored:', JSON.stringify(result.data, null, 2));
        
        // Update state to show resume data is available
        setResumeData(result.data);
        setHasResumeData(true);
        console.log('Resume state updated - hasResumeData:', true);
        console.log('Resume data set to state:', result.data);
        
        // Show success message
        setMessage('Resume data extracted successfully! You can now view the data or create a portfolio.');
        setTimeout(() => setMessage(''), 5000);
      } else {
        console.error('Resume parsing failed:', result);
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

      // Skip connectivity test to avoid HTTPS/CORS issues
      setMessage('Preparing LinkedIn authentication...');

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

  // Clear any existing LinkedIn data on component mount
  const clearExistingLinkedInData = async () => {
    if (user?.username) {
      await LinkedInService.clearLinkedInData(user.username);
      setHasLinkedInData(false);
      setLinkedInData(null);
    }
  };

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
        <div className="header-left">
          <div className="brand-info">
            <h2 className="brand-name">OnlinePortfolios</h2>
          </div>
          <div className="user-info">
            <h1>Welcome, {user.username}!</h1>
            <p>Manage your professional portfolio</p>
          </div>
        </div>
        <button onClick={onLogout} className="logout-btn">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>

      <div className="dashboard-content">
        {/* Main Portfolio Creation Sections */}
        <div className="main-sections">
          <h2 className="sections-title">Create Your Portfolio</h2>
          <div className="sections-grid">
            
            {/* LinkedIn Section */}
            <div className="creation-section linkedin-section">
              <div className="section-header">
                <div className="section-icon linkedin-icon">
                  <i className="fab fa-linkedin"></i>
                </div>
                <div className="section-title">
                  <h3>LinkedIn Import</h3>
                  <p>Import data from your LinkedIn profile</p>
                </div>
              </div>
              
              <div className="section-content">
                {hasLinkedInData && linkedInData ? (
                  <div className="data-preview">
                    <div className="preview-info">
                      <p><strong>{linkedInData.personal?.fullName || 'LinkedIn User'}</strong></p>
                      <p>{linkedInData.personal?.email || 'Email not available'}</p>
                      <div className="preview-stats">
                        <span>{linkedInData.experience?.length || 0} Jobs</span>
                        <span>{(linkedInData.skills?.technical?.length || 0) + (linkedInData.skills?.soft?.length || 0)} Skills</span>
                      </div>
                    </div>
                    <div className="section-actions">
                      <button onClick={() => navigate('/linkedin-preview')} className="btn btn-outline">
                        <i className="fas fa-eye"></i> View Data
                      </button>
                      <button onClick={handleCreatePortfolioWithLinkedIn} className="btn btn-primary">
                        <i className="fas fa-magic"></i> Create Portfolio
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No LinkedIn data available</p>
                    <div className="section-actions">
                      <button onClick={handleLinkedInLogin} className="btn btn-linkedin" disabled={loading}>
                        <i className="fab fa-linkedin"></i> {loading ? 'Connecting...' : 'Connect LinkedIn'}
                      </button>
                      <button onClick={addTestLinkedInData} className="btn btn-outline">
                        <i className="fas fa-flask"></i> Sample Data
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Resume Section */}
            <div className="creation-section resume-section">
              <div className="section-header">
                <div className="section-icon resume-icon">
                  <i className="fas fa-file-alt"></i>
                </div>
                <div className="section-title">
                  <h3>Resume Upload</h3>
                  <p>Upload and parse your resume automatically</p>
                </div>
              </div>
              
              <div className="section-content">
                {hasResumeData && resumeData ? (
                  <div className="data-preview">
                    <div className="preview-info">
                      <p><strong>{resumeData.personal?.fullName || 'Resume Owner'}</strong></p>
                      <p>{resumeData.personal?.email || 'Email not available'}</p>
                      <div className="preview-stats">
                        <span>{resumeData.experience?.length || 0} Jobs</span>
                        <span>{(resumeData.skills?.technical?.length || 0) + (resumeData.skills?.soft?.length || 0)} Skills</span>
                      </div>
                    </div>
                    <div className="section-actions">
                      <button onClick={() => console.log('Resume Data:', JSON.stringify(resumeData, null, 2))} className="btn btn-outline">
                        <i className="fas fa-code"></i> View JSON
                      </button>
                      <button onClick={() => handleCreatePortfolio('landing_1')} className="btn btn-primary">
                        <i className="fas fa-magic"></i> Create Portfolio
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No resume uploaded yet</p>
                    <div className="section-actions">
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
                        <i className="fas fa-upload"></i> {loading ? 'Processing...' : 'Upload Resume'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Manual Form Section */}
            <div className="creation-section form-section">
              <div className="section-header">
                <div className="section-icon form-icon">
                  <i className="fas fa-edit"></i>
                </div>
                <div className="section-title">
                  <h3>Manual Form</h3>
                  <p>Fill out information manually using our form</p>
                </div>
              </div>
              
              <div className="section-content">
                <div className="empty-state">
                  <p>Create portfolio by filling out a form</p>
                  <div className="section-actions">
                    <button onClick={() => handleCreatePortfolio('landing_1')} className="btn btn-primary">
                      <i className="fas fa-edit"></i> Start Manual Form
                    </button>
                    <button onClick={() => handleCreatePortfolio('landing_2')} className="btn btn-outline">
                      <i className="fas fa-paint-brush"></i> Creative Template
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Statistics Section */}
        <div className="statistics-section">
          <h2 className="stats-title">Your Dashboard Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-file-upload"></i>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.resumesUploaded}</h3>
                <p className="stat-label">Resumes Uploaded</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-briefcase"></i>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.portfoliosDeveloped}</h3>
                <p className="stat-label">Portfolios Developed</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-palette"></i>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.templatesAvailable}</h3>
                <p className="stat-label">Templates Available</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-link"></i>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.portfolioUrls}</h3>
                <p className="stat-label">Portfolio URLs</p>
              </div>
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