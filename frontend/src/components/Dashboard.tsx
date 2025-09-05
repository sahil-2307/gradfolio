import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { LinkedInService, LinkedInData } from '../services/linkedinService';
import LinkedInPreview from './LinkedInPreview';

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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    // Clear any existing data first to start fresh
    clearAllStoredData();
    // Then check if user has a portfolio
    checkExistingPortfolio();
    // Update stats
    updateStats();
    // Apply theme
    applyTheme();
  }, [user]);

  useEffect(() => {
    applyTheme();
  }, [isDarkMode]);

  const applyTheme = () => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

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
    setMessage('Checking LinkedIn configuration...');

    try {
      // Create LinkedIn OAuth URL
      const clientId = process.env.REACT_APP_LINKEDIN_CLIENT_ID;
      console.log('LinkedIn Client ID:', clientId);
      console.log('LinkedIn Client ID configured:', !!clientId && !clientId.includes('your_linkedin'));
      
      // Check if credentials are properly configured
      if (!clientId || clientId === 'your_linkedin_client_id_here' || clientId.includes('your_linkedin')) {
        setMessage('❌ LinkedIn integration not configured. LinkedIn credentials are missing or using placeholder values. Please use sample data instead.');
        setTimeout(() => setMessage(''), 8000);
        setLoading(false);
        return;
      }

      setMessage('LinkedIn credentials found. Testing LinkedIn service...');

      // Skip service test to avoid Mixed Content and CORS issues
      // LinkedIn service availability will be tested during actual OAuth flow
      setMessage('LinkedIn credentials found. Proceeding with authentication...');
      console.log('Skipping LinkedIn service test to avoid Mixed Content issues');
      
      const redirectUri = encodeURIComponent(`${window.location.origin}/api/linkedin-callback`);
      const scope = encodeURIComponent('openid profile email');
      const state = encodeURIComponent(JSON.stringify({ userId: user.id, username: user.username }));

      console.log('LinkedIn OAuth config:', {
        clientId: clientId.substring(0, 10) + '...',
        redirectUri: decodeURIComponent(redirectUri),
        scope: decodeURIComponent(scope),
        origin: window.location.origin
      });

      const linkedinUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
      
      console.log('LinkedIn OAuth URL created:', {
        url: linkedinUrl.substring(0, 100) + '...',
        redirectUri: decodeURIComponent(redirectUri),
        origin: window.location.origin,
        fullRedirectUri: `${window.location.origin}/api/linkedin-callback`,
        currentLocation: window.location.href
      });
      
      setMessage('🔄 Opening LinkedIn authentication... If popup is blocked, you will be redirected.');
      
      // Try popup first
      let authWindow: Window | null = null;
      
      try {
        authWindow = window.open(
          linkedinUrl, 
          'linkedin-oauth',
          'width=500,height=700,left=' + (window.screen.width / 2 - 250) + ',top=' + (window.screen.height / 2 - 350) + ',scrollbars=yes,resizable=yes,status=yes,location=yes'
        );
        
        console.log('Popup window opened:', !!authWindow);
      } catch (popupError) {
        console.warn('Popup creation failed:', popupError);
        authWindow = null;
      }
      
      if (!authWindow || authWindow.closed) {
        // Fallback to direct redirect
        setMessage('🔄 Popup blocked. Redirecting to LinkedIn...');
        setTimeout(() => {
          console.log('Redirecting to LinkedIn:', linkedinUrl);
          window.location.href = linkedinUrl;
        }, 2000);
        return;
      }
      
      // Monitor popup
      let checkInterval: NodeJS.Timeout;
      let timeoutId: NodeJS.Timeout;
      
      const cleanup = () => {
        if (checkInterval) clearInterval(checkInterval);
        if (timeoutId) clearTimeout(timeoutId);
        setLoading(false);
      };
      
      checkInterval = setInterval(() => {
        try {
          if (authWindow && authWindow.closed) {
            cleanup();
            setMessage('✅ LinkedIn authentication completed. Checking for imported data...');
            
            // Check URL parameters for errors
            const urlParams = new URLSearchParams(window.location.search);
            const error = urlParams.get('error');
            const errorMessage = urlParams.get('message');
            
            if (error) {
              console.error('LinkedIn OAuth error from callback:', error, errorMessage);
              if (error === 'linkedin_backend_not_configured') {
                setMessage('⚠️ LinkedIn backend credentials not configured. Backend needs LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET environment variables. Use sample data for now.');
              } else {
                setMessage(`❌ LinkedIn authentication failed: ${errorMessage || error}. Please try again or use sample data.`);
              }
              setTimeout(() => setMessage(''), 10000);
            } else {
              // Check if LinkedIn data was successfully imported
              setTimeout(async () => {
                console.log('Checking for LinkedIn data after OAuth completion...');
                await checkLinkedInData();
                
                // Also check localStorage directly for debugging
                const localData = localStorage.getItem(`linkedin_data_${user.username}`);
                console.log('LinkedIn localStorage check:', {
                  hasLocalStorage: !!localData,
                  hasLinkedInData: hasLinkedInData,
                  username: user.username
                });
                
                if (!hasLinkedInData && !localData) {
                  setMessage('⚠️ LinkedIn authentication completed but no data was imported. Check browser console for debug info. Please try again or use sample data.');
                  setTimeout(() => setMessage(''), 8000);
                } else {
                  setMessage('✅ LinkedIn data imported successfully!');
                  setTimeout(() => setMessage(''), 3000);
                }
              }, 3000);
            }
          } else if (authWindow) {
            // Check if we can access the window URL (same origin)
            try {
              const currentUrl = authWindow.location.href;
              console.log('Current popup URL:', currentUrl);
              if (currentUrl.includes('/dashboard')) {
                console.log('Detected redirect to dashboard, closing popup');
                authWindow.close();
              }
            } catch (e) {
              // Cross-origin error is expected during OAuth flow
            }
          }
        } catch (error) {
          console.warn('Error monitoring auth window:', error);
        }
      }, 1500);
      
      // Timeout after 5 minutes
      timeoutId = setTimeout(() => {
        cleanup();
        if (authWindow && !authWindow.closed) {
          authWindow.close();
        }
        setMessage('⏱️ LinkedIn authentication timed out. This may be due to LinkedIn service issues mentioned in your message. Please use sample data or try again later.');
        setTimeout(() => setMessage(''), 10000);
      }, 300000);
      
    } catch (error) {
      console.error('LinkedIn login error:', error);
      setMessage('❌ LinkedIn authentication failed. This appears to be the same LinkedIn service issue you mentioned. Please use sample data to continue.');
      setTimeout(() => setMessage(''), 10000);
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
    setLoading(true);
    setMessage('🔄 Loading sample LinkedIn data...');

    const testData: LinkedInData = {
      personal: {
        fullName: user.username.replace('_', ' ').replace('-', ' ') || 'Professional User',
        email: `${user.username}@professional.com`,
        phone: '+1 (555) 123-4567',
        linkedin: `https://linkedin.com/in/${user.username}`,
        github: `https://github.com/${user.username}`,
        website: `https://${user.username}.dev`
      },
      about: {
        paragraph1: 'Experienced professional with a passion for innovation and excellence in the technology industry. Proven track record of delivering high-quality solutions and leading successful projects.',
        paragraph2: 'Skilled in full-stack development, project management, and team collaboration. Committed to continuous learning and staying current with emerging technologies and best practices.'
      },
      experience: [
        {
          position: 'Senior Software Developer',
          company: 'Tech Innovations Corp',
          duration: '2022 - Present',
          description: 'Lead development of scalable web applications using modern frameworks. Collaborate with cross-functional teams to deliver enterprise-level solutions. Mentor junior developers and drive technical excellence across projects.'
        },
        {
          position: 'Full Stack Developer',
          company: 'Digital Solutions Ltd',
          duration: '2020 - 2022',
          description: 'Developed and maintained web applications using React, Node.js, and cloud technologies. Implemented CI/CD pipelines and improved system performance by 45%.'
        },
        {
          position: 'Junior Developer',
          company: 'StartUp Ventures',
          duration: '2019 - 2020',
          description: 'Built responsive web interfaces and REST APIs. Participated in agile development processes and contributed to multiple successful product launches.'
        }
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University of Technology',
          year: '2019',
          description: 'Graduated with honors. Focus on Software Engineering, Database Systems, and Machine Learning. Active in computer science clubs and hackathons.'
        }
      ],
      skills: {
        technical: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Git', 'REST APIs', 'GraphQL'],
        soft: ['Leadership', 'Problem Solving', 'Team Collaboration', 'Communication', 'Project Management', 'Strategic Thinking']
      },
      projects: [
        {
          title: 'Portfolio Management Platform',
          description: 'Comprehensive platform for creating and managing professional portfolios with multiple templates and customization options',
          technologies: ['React', 'Node.js', 'MongoDB', 'Supabase'],
          link: 'https://onlineportfolios.in'
        },
        {
          title: 'E-commerce Analytics Dashboard',
          description: 'Real-time analytics dashboard for e-commerce businesses with advanced reporting and data visualization',
          technologies: ['React', 'Python', 'PostgreSQL', 'Chart.js'],
          link: `https://github.com/${user.username}/analytics-dashboard`
        },
        {
          title: 'AI-Powered Code Assistant',
          description: 'Intelligent code completion and suggestion tool using machine learning algorithms',
          technologies: ['Python', 'TensorFlow', 'REST API', 'Docker'],
          link: `https://github.com/${user.username}/ai-code-assistant`
        }
      ],
      achievements: [
        'Led successful migration of legacy systems to modern cloud architecture',
        'Contributed to 10+ open source projects with over 500 GitHub stars',
        'Speaker at 3 technology conferences and meetups',
        'Mentor in university coding bootcamp program',
        'Published technical articles with 50K+ total views'
      ]
    };

    console.log('Adding comprehensive sample LinkedIn data for user:', user.username);
    try {
      const result = await LinkedInService.storeLinkedInData(user.username, testData);
      console.log('Sample data store result:', result);
      
      if (result.success) {
        setHasLinkedInData(true);
        setLinkedInData(testData);
        setMessage('✅ Sample LinkedIn data loaded successfully! This demonstrates how your actual LinkedIn data would appear.');
        console.log('Sample LinkedIn data state updated successfully');
        setTimeout(() => setMessage(''), 5000);
      } else {
        console.error('Failed to store sample LinkedIn data:', result.error);
        setMessage('❌ Failed to load sample data. Please try again.');
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error loading sample data:', error);
      setMessage('❌ Error loading sample data. Please try again.');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-brand">
          <div className="brand-name">OnlinePortfolios</div>
        </div>
        <div className="header-controls">
          <button onClick={toggleTheme} className="theme-toggle" title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <i className={isDarkMode ? 'fas fa-sun' : 'fas fa-moon'}></i>
          </button>
          <button onClick={onLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>
      
      <div className="welcome-section">
        <h1>Welcome, {user.username}!</h1>
        <p>Manage your professional portfolio</p>
      </div>

      <div className="dashboard-content">
        {/* Main Portfolio Creation Sections */}
        <div className="main-sections">
          <h2 className="sections-title">
            <i className="fas fa-rocket"></i> Create Your Portfolio
          </h2>
          <div className="sections-grid">
            
            {/* LinkedIn Section */}
            <div className="creation-section linkedin-section">
              <div className="section-header">
                <div className="section-icon linkedin-icon">
                  <i className="fab fa-linkedin-in"></i>
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
                      <button onClick={addTestLinkedInData} className="btn btn-outline" disabled={loading}>
                        <i className="fas fa-flask"></i> {loading ? 'Loading...' : 'Use Sample Data'}
                      </button>
                      <div className="linkedin-status-info">
                        <p className="helper-text">
                          <i className="fas fa-info-circle"></i> 
                          If LinkedIn shows "Network Will Be Back Soon", it's a LinkedIn service issue, not your app.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Resume Section */}
            <div className="creation-section resume-section">
              <div className="section-header">
                <div className="section-icon resume-icon">
                  <i className="fas fa-file-pdf"></i>
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
                  <i className="fas fa-pen-to-square"></i>
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
          <h2 className="stats-title">
            <i className="fas fa-chart-line"></i> Your Dashboard Statistics
          </h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-cloud-upload-alt"></i>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.resumesUploaded}</h3>
                <p className="stat-label">Resumes Uploaded</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-user-tie"></i>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.portfoliosDeveloped}</h3>
                <p className="stat-label">Portfolios Developed</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-swatchbook"></i>
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.templatesAvailable}</h3>
                <p className="stat-label">Templates Available</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-external-link-alt"></i>
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